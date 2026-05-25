'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PredictPage() {
  const [formData, setFormData] = useState({
    Agency: 'KSRTC',
    Source: 'Bangalore',
    Destination: 'Mysore',
    Bus_Type: 'Volvo',
    Total_Seats: 40,
    Duration_hours: 3.5
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Total_Seats' || name === 'Duration_hours' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict_fare', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Make sure Flask API is running.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fare Prediction</h1>
            <p className="text-blue-100 mt-1">Enter bus details to predict fare</p>
          </div>
          <Link href="/">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Prediction Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Agency */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Agency</label>
                  <input
                    type="text"
                    name="Agency"
                    value={formData.Agency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., KSRTC"
                    required
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Source City</label>
                  <input
                    type="text"
                    name="Source"
                    value={formData.Source}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Bangalore"
                    required
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Destination City</label>
                  <input
                    type="text"
                    name="Destination"
                    value={formData.Destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mysore"
                    required
                  />
                </div>

                {/* Bus Type */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Bus Type</label>
                  <select
                    name="Bus_Type"
                    value={formData.Bus_Type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Volvo">Volvo</option>
                    <option value="Ordinary">Ordinary</option>
                    <option value="Semi-Sleeper">Semi-Sleeper</option>
                    <option value="Sleeper">Sleeper</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>

                {/* Total Seats */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Total Seats</label>
                  <input
                    type="number"
                    name="Total_Seats"
                    value={formData.Total_Seats}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                {/* Duration Hours */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="Duration_hours"
                    value={formData.Duration_hours}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0.1"
                    max="24"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Predicting...
                  </span>
                ) : 'Get Fare Prediction'}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-bold">⚠️ Error:</p>
                <p>{error}</p>
              </div>
            )}

            {/* Result Display */}
            {prediction && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg text-white">
                <div className="text-center">
                  <p className="text-lg mb-2">Predicted Fare</p>
                  <p className="text-5xl font-bold mb-2">₹{prediction.predicted_fare}</p>
                  <p className="text-sm opacity-90">{prediction.route}</p>
                  <p className="text-xs opacity-75 mt-2">Bus Type: {prediction.bus_type}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
