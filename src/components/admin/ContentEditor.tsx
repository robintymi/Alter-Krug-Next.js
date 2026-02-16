'use client';

import { useState } from 'react';
import { updateSiteContent, logout } from '@/app/actions';

interface ContentEditorProps {
  initialContent: any;
}

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section: string, listName: string, index: number, value: string) => {
     setContent((prev: any) => {
        const newList = [...prev[section][listName]];
        newList[index] = value;
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [listName]: newList
          }
        };
     });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await updateSiteContent(content);
    setSaving(false);
    if (res.success) {
      setMessage('Erfolgreich gespeichert!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Fehler beim Speichern.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inhalte bearbeiten</h1>
          <div className="flex gap-4">
             <button onClick={() => logout().then(() => window.location.reload())} className="text-red-500 hover:underline">Abmelden</button>
             <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
             >
                {saving ? 'Speichert...' : 'Speichern'}
             </button>
          </div>
        </div>
        
        {message && <div className={`p-4 mb-4 rounded ${message.includes('Fehler') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

        <div className="space-y-8">
          {/* Header Section */}
          <section className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Header / Navigation</h2>
             <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Booking URL</label>
                <input
                  type="text"
                  value={content.header.bookingUrl}
                  onChange={(e) => handleChange('header', 'bookingUrl', e.target.value)}
                  className="w-full p-2 border rounded"
                />
             </div>
             <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
                <p>Hinweis: Die Navigationselemente (Menüpunkte) können derzeit nur über die JSON-Datei direkt bearbeitet werden, da sie eine komplexe Verschachtelung aufweisen.</p>
             </div>
          </section>

          {/* Hero Section */}
          <section className="border p-4 rounded-md">
             <h2 className="text-xl font-semibold mb-4">Hero (Startbild)</h2>
             <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <input type="text" value={content.hero.title} onChange={(e) => handleChange('hero', 'title', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Untertitel</label>
                    <textarea value={content.hero.subtitle} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)} className="w-full p-2 border rounded" rows={2} />
                </div>
             </div>
          </section>

          {/* Hotel Section */}
          <section className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Hotel</h2>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <input type="text" value={content.hotel.title} onChange={(e) => handleChange('hotel', 'title', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <textarea value={content.hotel.description} onChange={(e) => handleChange('hotel', 'description', e.target.value)} className="w-full p-2 border rounded" rows={5} />
                </div>
            </div>
          </section>

          {/* Events Section */}
          <section className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Events</h2>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <input type="text" value={content.events.title} onChange={(e) => handleChange('events', 'title', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <textarea value={content.events.description} onChange={(e) => handleChange('events', 'description', e.target.value)} className="w-full p-2 border rounded" rows={5} />
                </div>
            </div>
          </section>
          
           {/* Restaurant Section */}
          <section className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Restaurant</h2>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <input type="text" value={content.restaurant.title} onChange={(e) => handleChange('restaurant', 'title', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <textarea value={content.restaurant.description} onChange={(e) => handleChange('restaurant', 'description', e.target.value)} className="w-full p-2 border rounded" rows={5} />
                </div>
            </div>
          </section>

          {/* Footer Section */}
           <section className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Footer / Kontakt</h2>
            <div className="grid gap-4">
                <div className="font-semibold text-gray-700">Anschrift Zeilen:</div>
                {content.footer.address.lines.map((line: string, i: number) => (
                    <input key={i} type="text" value={line} onChange={(e) => handleArrayChange('footer', 'lines', i, e.target.value)} className="w-full p-2 border rounded" />
                ))}
                 <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                     <input type="text" value={content.footer.address.email} onChange={(e) => handleChange('footer', 'email', e.target.value)} className="w-full p-2 border rounded" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                     <input type="text" value={content.footer.address.phone} onChange={(e) => handleChange('footer', 'phone', e.target.value)} className="w-full p-2 border rounded" />
                 </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
