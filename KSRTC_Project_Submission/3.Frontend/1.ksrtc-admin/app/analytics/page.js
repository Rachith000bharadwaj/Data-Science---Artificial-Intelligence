'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

export default function AnalyticsPage() {
  const [routes, setRoutes] = useState([]);
  const [routeAnalytics, setRouteAnalytics] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  async function fetchAnalyticsData() {
    try {
      setLoading(true);
      const [routesRes, analyticsRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/routes'),
        axios.get('http://127.0.0.1:5000/api/analytics/routes'),
      ]);

      setRoutes(routesRes.data.routes || []);
      setRouteAnalytics(analyticsRes.data.route_analytics || []);

      if (routesRes.data.routes && routesRes.data.routes.length > 0) {
        setSelectedRoute(routesRes.data.routes[0].id);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default data
      const defaultRoutes = [
        { id: 'Route_101', name: 'MG Road' },
        { id: 'Route_102', name: 'Brigade Road' },
        { id: 'Route_103', name: 'Whitefield' },
      ];
      setRoutes(defaultRoutes);
      setSelectedRoute(defaultRoutes[0].id);
    } finally {
      setLoading(false);
    }
  }

  const selectedRouteData = routeAnalytics.find((r) => r.route_id === selectedRoute);

  const passengersData = selectedRouteData?.hourly_passengers || [
    { hour: '6 AM', count: 50 },
    { hour: '8 AM', count: 250 },
    { hour: '10 AM', count: 180 },
    { hour: '12 PM', count: 120 },
    { hour: '2 PM', count: 90 },
    { hour: '4 PM', count: 160 },
    { hour: '6 PM', count: 300 },
    { hour: '8 PM', count: 200 },
  ];

  const routePerformance = routeAnalytics.map((r) => ({
    route: r.route_id,
    onTimePercentage: r.on_time_percentage || 85,
    avgDelay: r.avg_delay_minutes || 5,
    passengers: r.total_passengers || 1000,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <header className="text-white shadow-lg bg-gradient-to-r from-green-600 to-teal-600">
        <div className="container px-6 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">📈 Analytics Dashboard</h1>
            <Link href="/">
              <button className="px-4 py-2 font-semibold rounded-lg bg-white/20 hover:bg-white/30">
                ← Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container px-6 py-8 mx-auto">
        {/* Route Selection */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
          <label className="block mb-3 text-sm font-bold">Select Route for Detailed Analysis</label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none md:w-96 focus:ring-2 focus:ring-green-500"
          >
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name || route.id}
              </option>
            ))}
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Hourly Passengers */}
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h3 className="mb-4 text-lg font-bold">⏰ Hourly Passenger Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={passengersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Passengers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Route Performance */}
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h3 className="mb-4 text-lg font-bold">🏆 On-Time Performance by Route</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={routePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="onTimePercentage"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="On-Time %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Comparison Table */}
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-bold">📊 Route Comparison Analytics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 font-bold text-left">Route</th>
                  <th className="px-6 py-3 font-bold text-left">Total Passengers</th>
                  <th className="px-6 py-3 font-bold text-left">On-Time %</th>
                  <th className="px-6 py-3 font-bold text-left">Avg Delay</th>
                  <th className="px-6 py-3 font-bold text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {routePerformance.map((route, idx) => (
                  <tr key={route.route} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{route.route}</td>
                    <td className="px-6 py-4">{route.passengers.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-2 mr-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${route.onTimePercentage}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">{route.onTimePercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{route.avgDelay} min</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                        route.onTimePercentage >= 85
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {route.onTimePercentage >= 85 ? '✓ Good' : '⚠ Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-4">
          <div className="p-6 text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
            <p className="mb-2 text-sm opacity-90">Total Routes</p>
            <p className="text-3xl font-bold">{routes.length}</p>
          </div>
          <div className="p-6 text-white shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
            <p className="mb-2 text-sm opacity-90">Avg On-Time %</p>
            <p className="text-3xl font-bold">
              {(routePerformance.reduce((a, b) => a + b.onTimePercentage, 0) / routePerformance.length).toFixed(1)}%
            </p>
          </div>
          <div className="p-6 text-white shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
            <p className="mb-2 text-sm opacity-90">Total Passengers</p>
            <p className="text-3xl font-bold">
              {(routePerformance.reduce((a, b) => a + b.passengers, 0) / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="p-6 text-white shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
            <p className="mb-2 text-sm opacity-90">Avg Delay</p>
            <p className="text-3xl font-bold">
              {(routePerformance.reduce((a, b) => a + b.avgDelay, 0) / routePerformance.length).toFixed(1)} min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
