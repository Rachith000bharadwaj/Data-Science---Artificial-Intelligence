'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/predictions');
      setPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prediction History</h1>
            <p className="text-blue-100 mt-1">Recent fare predictions</p>
          </div>
          <Link href="/">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      <main className="p-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : predictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-3 text-left font-bold">Source</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Destination</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Agency</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Bus Type</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Seats</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Duration</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">Predicted Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">{pred.Source}</td>
                      <td className="border border-gray-300 p-3">{pred.Destination}</td>
                      <td className="border border-gray-300 p-3">{pred.Agency}</td>
                      <td className="border border-gray-300 p-3">{pred.Bus_Type}</td>
                      <td className="border border-gray-300 p-3">{pred.Total_Seats}</td>
                      <td className="border border-gray-300 p-3">{pred.Duration_hours} hrs</td>
                      <td className="border border-gray-300 p-3 font-bold text-green-600">
                        ₹{pred.Predicted_Fare}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No predictions yet. Make your first prediction!</p>
              <Link href="/predict">
                <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Make Prediction
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
