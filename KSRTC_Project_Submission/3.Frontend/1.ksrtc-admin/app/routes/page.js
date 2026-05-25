'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/routes');
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="p-6 text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Available Routes</h1>
            <p className="mt-1 text-blue-100">All active KSRTC bus routes</p>
          </div>
          <Link href="/">
            <button className="px-4 py-2 font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl p-8 mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : routes.length > 0 ? (
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route, index) => (
                <div key={index} className="p-6 transition-shadow border-l-4 border-blue-500 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase">Route {index + 1}</p>
                      <p className="mt-2 text-xl font-bold text-blue-600">{route}</p>
                    </div>
                    <div className="text-3xl">🚌</div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-blue-200">
                    <Link href={`/predict?route=${route}`}>
                      <button className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
                        View & Predict
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-lg shadow-lg">
            <p className="text-lg text-gray-500">No routes available</p>
          </div>
        )}
      </main>
    </div>
  );
}
