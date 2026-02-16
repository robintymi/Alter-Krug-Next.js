'use client';

import { useState } from 'react';
import { updateSiteContent, logout } from '@/app/actions';

type SimpleSectionKey = 'header' | 'hero' | 'hotel' | 'events' | 'restaurant';

type SectionFieldMap = {
  header: 'bookingUrl';
  hero: 'title' | 'subtitle';
  hotel: 'title' | 'description';
  events: 'title' | 'description';
  restaurant: 'title' | 'description';
};

interface EditableContent {
  header: {
    bookingUrl: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  hotel: {
    title: string;
    description: string;
  };
  events: {
    title: string;
    description: string;
  };
  restaurant: {
    title: string;
    description: string;
  };
  footer: {
    address: {
      lines: string[];
      email: string;
      phone: string;
    };
  };
}

interface ContentEditorProps {
  initialContent: EditableContent;
}

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState<EditableContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSectionChange = <K extends SimpleSectionKey>(
    section: K,
    field: SectionFieldMap[K],
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFooterLineChange = (index: number, value: string) => {
    setContent((prev) => {
      const nextLines = [...prev.footer.address.lines];
      nextLines[index] = value;

      return {
        ...prev,
        footer: {
          ...prev.footer,
          address: {
            ...prev.footer.address,
            lines: nextLines,
          },
        },
      };
    });
  };

  const handleFooterContactChange = (field: 'email' | 'phone', value: string) => {
    setContent((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        address: {
          ...prev.footer.address,
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await updateSiteContent(content);
    setSaving(false);

    if (res.success) {
      setMessage('Erfolgreich gespeichert!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMessage('Fehler beim Speichern.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inhalte bearbeiten</h1>
          <div className="flex gap-4">
            <button onClick={() => logout().then(() => window.location.reload())} className="text-red-500 hover:underline">
              Abmelden
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 rounded p-4 ${message.includes('Fehler') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          <section className="rounded-md border p-4">
            <h2 className="mb-4 text-xl font-semibold">Header / Navigation</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Booking URL</label>
              <input
                type="text"
                value={content.header.bookingUrl}
                onChange={(e) => handleSectionChange('header', 'bookingUrl', e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
            <div className="rounded bg-yellow-50 p-4 text-yellow-800">
              <p>Hinweis: Die Menuepunkte koennen derzeit nur direkt in der JSON-Datei bearbeitet werden.</p>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h2 className="mb-4 text-xl font-semibold">Hero (Startbild)</h2>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Titel</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => handleSectionChange('hero', 'title', e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Untertitel</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => handleSectionChange('hero', 'subtitle', e.target.value)}
                  className="w-full rounded border p-2"
                  rows={2}
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h2 className="mb-4 text-xl font-semibold">Hotel</h2>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Titel</label>
                <input
                  type="text"
                  value={content.hotel.title}
                  onChange={(e) => handleSectionChange('hotel', 'title', e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Beschreibung</label>
                <textarea
                  value={content.hotel.description}
                  onChange={(e) => handleSectionChange('hotel', 'description', e.target.value)}
                  className="w-full rounded border p-2"
                  rows={5}
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h2 className="mb-4 text-xl font-semibold">Events</h2>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Titel</label>
                <input
                  type="text"
                  value={content.events.title}
                  onChange={(e) => handleSectionChange('events', 'title', e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Beschreibung</label>
                <textarea
                  value={content.events.description}
                  onChange={(e) => handleSectionChange('events', 'description', e.target.value)}
                  className="w-full rounded border p-2"
                  rows={5}
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h2 className="mb-4 text-xl font-semibold">Restaurant</h2>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Titel</label>
                <input
                  type="text"
                  value={content.restaurant.title}
                  onChange={(e) => handleSectionChange('restaurant', 'title', e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Beschreibung</label>
                <textarea
                  value={content.restaurant.description}
                  onChange={(e) => handleSectionChange('restaurant', 'description', e.target.value)}
                  className="w-full rounded border p-2"
                  rows={5}
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border p-4">
            <h2 className="mb-4 text-xl font-semibold">Footer / Kontakt</h2>
            <div className="grid gap-4">
              <div className="font-semibold text-gray-700">Anschrift Zeilen:</div>
              {content.footer.address.lines.map((line: string, i: number) => (
                <input
                  key={i}
                  type="text"
                  value={line}
                  onChange={(e) => handleFooterLineChange(i, e.target.value)}
                  className="w-full rounded border p-2"
                />
              ))}
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="text"
                  value={content.footer.address.email}
                  onChange={(e) => handleFooterContactChange('email', e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Telefon</label>
                <input
                  type="text"
                  value={content.footer.address.phone}
                  onChange={(e) => handleFooterContactChange('phone', e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
