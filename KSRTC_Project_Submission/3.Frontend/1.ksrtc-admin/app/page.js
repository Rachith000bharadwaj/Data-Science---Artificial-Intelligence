'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import apiService from './services/api';

// Dynamic import for MapComponent
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  loading: () => <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>,
  ssr: false,
});

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [busData, setBusData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount and every 5 seconds
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [healthData, analyticsData, busStatusData, trafficDataRes] = await Promise.all([
        apiService.getHealth().catch(() => null),
        apiService.getAnalytics().catch(() => null),
        apiService.getBusStatus().catch(() => null),
        apiService.getTrafficData().catch(() => null),
      ]);

      setStats(healthData);
      setAnalytics(analyticsData);
      setBusData(busStatusData?.buses || []);
      setTrafficData(trafficDataRes);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from backend');
    } finally {
      setLoading(false);
    }
  }

  // Chart data preparations
  const speedDistributionData = trafficData?.speedDistribution || [
    { name: 'Low Congestion (>40 km/h)', value: 45 },
    { name: 'Moderate (20-40 km/h)', value: 35 },
    { name: 'High Congestion (<20 km/h)', value: 20 },
  ];

  const peakHourData = analytics?.peakHours || [
    { time: '6 AM', passengers: 50 },
    { time: '8 AM', passengers: 150 },
    { time: '10 AM', passengers: 300 },
    { time: '12 PM', passengers: 200 },
    { time: '2 PM', passengers: 150 },
    { time: '4 PM', passengers: 180 },
    { time: '6 PM', passengers: 350 },
    { time: '8 PM', passengers: 250 },
  ];

  const delayData = analytics?.delays || [
    { route: 'Route 101', delay: 3 },
    { route: 'Route 102', delay: 5 },
    { route: 'Route 103', delay: 8 },
    { route: 'Route 104', delay: 2 },
    { route: 'Route 105', delay: 4 },
  ];

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
          {/* HEADER */}
          <header className="sticky top-0 z-50 text-white shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
            <div className="container px-6 py-6 mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🚌</div>
                  <div>
                    <h1 className="text-3xl font-bold">KSRTC Route Optimization System</h1>
                    <p className="text-blue-100">Karnataka State Road Transport Corporation</p>
                  </div>
                </div>
                <div className="flex items-center px-4 py-2 space-x-2 rounded-full bg-white/20">
                  <div className={`w-3 h-3 ${stats ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse`}></div>
                  <span className="text-sm font-semibold">
                    {stats ? 'System Operational' : 'Connecting...'}
                  </span>
                </div>
              </div>
            </div>
          </header>
    
          <div className="container px-6 py-8 mx-auto">
            {/* Error Display */}
            {error && (
              <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
    
            {/* KEY METRICS */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-6">
              <div className="p-6 bg-white border-l-4 border-blue-500 shadow-lg rounded-xl">
                <p className="text-xs font-bold text-gray-500 uppercase">Total Buses</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {analytics?.totalBuses || '150'}
                </p>
                <p className="mt-2 text-xs text-green-600">✓ Fleet Ready</p>
              </div>
    
              <div className="p-6 bg-white border-l-4 border-green-500 shadow-lg rounded-xl">
                <p className="text-xs font-bold text-gray-500 uppercase">Daily Passengers</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {analytics?.dailyPassengers?.toLocaleString() || '25,000'}
                </p>
                <p className="mt-2 text-xs text-green-600">↑ Live Data</p>
              </div>
    
              <div className="p-6 bg-white border-l-4 border-purple-500 shadow-lg rounded-xl">
                <p className="text-xs font-bold text-gray-500 uppercase">Active Routes</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {analytics?.activeRoutes || '45'}
                </p>
                <p className="mt-2 text-xs text-green-600">✓ All Operational</p>
              </div>
    
              <div className="p-6 bg-white border-l-4 border-orange-500 shadow-lg rounded-xl">
                <p className="text-xs font-bold text-gray-500 uppercase">On-Time %</p>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {analytics?.onTimePercentage || '87.5'}%
                </p>
                <p className="mt-2 text-xs text-orange-600">↑ Target: 90%</p>
              </div>
    
              <div className="p-6 bg-white border-l-4 shadow-lg rounded-xl border-cyan-500">
                <p className="text-xs font-bold text-gray-500 uppercase">Fleet Utilization</p>
                <p className="mt-2 text-3xl font-bold text-cyan-600">
                  {analytics?.fleetUtilization || '82'}%
                </p>
                <p className="mt-2 text-xs text-green-600">↑ High Demand</p>
              </div>
    
              <div className="p-6 bg-white border-l-4 border-red-500 shadow-lg rounded-xl">
                <p className="text-xs font-bold text-gray-500 uppercase">Avg Delay</p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {analytics?.avgDelay || '5.2'} min
                </p>
                <p className="mt-2 text-xs text-red-600">↑ Peak Hour</p>
              </div>
            </div>
    
            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
              <div className="p-6 bg-white shadow-lg rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-800">📊 Traffic Speed Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={speedDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${value}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {speedDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
    
              <div className="p-6 bg-white shadow-lg rounded-xl lg:col-span-2">
                <h3 className="mb-4 text-lg font-bold text-gray-800">📈 Peak Hour Demand</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={peakHourData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="passengers"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      name="Passengers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
    
            {/* MAP SECTION - FULL WIDTH */}
            <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">📍 Real-Time Bus Tracking Map</h2>
              <div style={{ height: '550px', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <MapComponent buses={busData} />
              </div>
              
              {/* Bus Info Cards */}
              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
                {busData && busData.length > 0 ? (
                  busData.map((bus) => (
                    <div key={bus.id} className="p-4 border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="mb-2 font-bold text-blue-600">🚌 {bus.id}</div>
                      <p className="mb-1 text-sm text-gray-700"><b>Route:</b> {bus.route}</p>
                      <p className="mb-1 text-sm text-gray-700"><b>Speed:</b> {bus.speed} km/h</p>
                      <p className="text-sm text-gray-700"><b>Status:</b> 
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded-full ${
                          bus.status === 'In Transit' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bus.status}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-500">Loading bus data...</div>
                )}
              </div>
            </div>
    
            {/* BUS STATUS TABLE */}
            <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">🚌 Live Bus Status</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Bus ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Route</th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Speed</th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Occupancy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {busData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          {loading ? 'Loading bus data...' : 'No buses currently active'}
                        </td>
                      </tr>
                    ) : (
                      busData.map((bus) => (
                        <tr key={bus.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{bus.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{bus.route}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              bus.status === 'In Transit' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bus.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{bus.speed} km/h</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{bus.occupancy}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
    
            {/* QUICK ACTIONS */}
            <div className="p-8 mb-8 bg-white shadow-lg rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">🚀 Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Link href="/optimize">
                  <button className="w-full px-6 py-4 font-semibold text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105">
                    ⚙️ Route Optimization
                  </button>
                </Link>
                <Link href="/analytics">
                  <button className="w-full px-6 py-4 font-semibold text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105">
                    📈 Analytics
                  </button>
                </Link>
                <Link href="/schedule">
                  <button className="w-full px-6 py-4 font-semibold text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:scale-105">
                    📅 Schedule
                  </button>
                </Link>
                <Link href="/settings">
                  <button className="w-full px-6 py-4 font-semibold text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 hover:scale-105">
                    ⚙️ Settings
                  </button>
                </Link>
              </div>
            </div>
    
            {/* SYSTEM INFO */}
            <div className="p-8 text-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <h3 className="mb-4 text-xl font-bold">🔌 System Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm opacity-90">API Status:</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    stats ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {stats ? '✅ ONLINE' : '❌ OFFLINE'}
                  </span>
                </div>
                <div>
                  <p className="mb-2 text-sm opacity-90">Model Type:</p>
                  <span className="text-lg font-bold">{stats?.prediction_mode || 'ML Model'}</span>
                </div>
                <div>
                  <p className="mb-2 text-sm opacity-90">Routes Loaded:</p>
                  <span className="text-lg font-bold">{stats?.total_routes || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
