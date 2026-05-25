'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:5000');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('apiUrl', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      <header className="text-white shadow-2xl bg-gradient-to-r from-gray-600 to-gray-800">
        <div className="container px-6 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">⚙️ Settings</h1>
            <Link href="/">
              <button className="px-4 py-2 font-semibold rounded-lg bg-white/20 hover:bg-white/30">
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </header>
      <div className="container max-w-2xl px-6 py-8 mx-auto">
        <div className="p-8 mb-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-bold">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold">API Base URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Settings
            </button>
            {saved && (
              <div className="p-4 text-green-700 bg-green-100 rounded-lg">
                ✅ Settings saved successfully!
              </div>
            )}
          </div>
        </div>
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-bold">System Information</h2>
          <div className="space-y-4">
            <div className="pb-4 border-b">
              <p className="mb-1 text-sm text-gray-600">API Version</p>
              <p className="text-lg font-bold">1.0</p>
            </div>
            <div className="pb-4 border-b">
              <p className="mb-1 text-sm text-gray-600">Framework</p>
              <p className="text-lg font-bold">Next.js 15 + Flask</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-600">Current API URL</p>
              <p className="text-lg font-bold">{apiUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
