<?php
require_once __DIR__ . '/config.php';

// Stripe PHP SDK laden
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Kein corsHeaders() hier — Webhook wird nur von Stripe aufgerufen
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Nur POST erlaubt.', 405);
}

$payload = file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (!$sigHeader) {
    jsonError('Keine Stripe-Signatur.', 400);
}

try {
    \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);
    $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, STRIPE_WEBHOOK_SECRET);
} catch (\Exception $e) {
    jsonError('Signatur ungültig: ' . $e->getMessage(), 400);
}

if ($event->type === 'checkout.session.completed') {
    $session = $event->data->object;
    $bookingId = $session->metadata->booking_id ?? null;

    if ($bookingId) {
        $db = getDB();

        // Buchung als bestätigt markieren
        $stmt = $db->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $stmt->execute(['confirmed', $bookingId]);

        // Buchungsdaten laden
        $stmt = $db->prepare('SELECT * FROM bookings WHERE id = ?');
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch();

        if ($booking) {
            $totalFormatted = number_format($booking['total_price_cents'] / 100, 2, ',', '.') . ' €';

            // Bestätigungs-E-Mail an Kunden
            sendResendEmail(
                $booking['customer_email'],
                "Buchungsbestätigung: {$booking['event_title']}",
                "
                <h2>Buchungsbestätigung</h2>
                <p>Hallo {$booking['customer_name']},</p>
                <p>vielen Dank für Ihre Buchung!</p>
                <table style='border-collapse:collapse;margin:16px 0'>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Veranstaltung:</td><td>{$booking['event_title']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Datum:</td><td>{$booking['event_date']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Plätze:</td><td>{$booking['seats']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Gesamtpreis:</td><td>{$totalFormatted}</td></tr>
                </table>
                <p>Wir freuen uns auf Sie!</p>
                <p>Ihr Team vom Alter Krug</p>
                "
            );

            // Benachrichtigung an Admin
            $phone = $booking['customer_phone'] ?: '—';
            sendResendEmail(
                ADMIN_EMAIL,
                "Neue Buchung: {$booking['event_title']} — {$booking['seats']} Plätze",
                "
                <h2>Neue Buchung eingegangen</h2>
                <table style='border-collapse:collapse;margin:16px 0'>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Event:</td><td>{$booking['event_title']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Datum:</td><td>{$booking['event_date']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Kunde:</td><td>{$booking['customer_name']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>E-Mail:</td><td>{$booking['customer_email']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Telefon:</td><td>{$phone}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Plätze:</td><td>{$booking['seats']}</td></tr>
                    <tr><td style='padding:4px 12px 4px 0;font-weight:bold'>Betrag:</td><td>{$totalFormatted}</td></tr>
                </table>
                "
            );
        }
    }
}

jsonResponse(['received' => true]);

// --- Resend E-Mail Helper ---
function sendResendEmail(string $to, string $subject, string $html): void {
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . RESEND_API_KEY,
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'from' => 'Alter Krug <' . FROM_EMAIL . '>',
            'to' => [$to],
            'subject' => $subject,
            'html' => $html,
        ]),
    ]);
    curl_exec($ch);
    curl_close($ch);
}
