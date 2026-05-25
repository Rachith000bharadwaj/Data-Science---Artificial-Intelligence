'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([
    { id: 1, route: 'Route_101 (MG Road)', time: '06:00 AM', buses: 3, status: 'Active', passengers: 120 },
    { id: 2, route: 'Route_102 (Brigade Road)', time: '06:30 AM', buses: 2, status: 'Active', passengers: 85 },
    { id: 3, route: 'Route_103 (Whitefield)', time: '07:00 AM', buses: 4, status: 'Active', passengers: 150 },
    { id: 4, route: 'Route_104 (Mysore Road)', time: '07:30 AM', buses: 3, status: 'Delayed', passengers: 95 },
    { id: 5, route: 'Route_105 (Hassan Road)', time: '08:00 AM', buses: 2, status: 'Scheduled', passengers: 60 }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      <header className="text-white shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        <div className="container px-6 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">📅 Schedule Planning</h1>
            <Link href="/">
              <button className="px-4 py-2 font-semibold rounded-lg bg-white/20 hover:bg-white/30">
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container px-6 py-8 mx-auto">
        <div className="p-8 mb-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-bold">Today's Schedule Overview</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Departure Time</th>
                  <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Buses Assigned</th>
                  <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Expected Passengers</th>
                  <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{schedule.route}</td>
                    <td className="px-6 py-4 text-gray-900">{schedule.time}</td>
                    <td className="px-6 py-4 text-gray-900">{schedule.buses} buses</td>
                    <td className="px-6 py-4 text-gray-900">{schedule.passengers}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        schedule.status === 'Active' ? 'bg-green-100 text-green-800' :
                        schedule.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {schedule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="p-6 bg-white border-l-4 border-blue-500 shadow-lg rounded-xl">
            <p className="text-xs font-bold text-gray-500 uppercase">Total Routes</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">5</p>
          </div>
          <div className="p-6 bg-white border-l-4 border-green-500 shadow-lg rounded-xl">
            <p className="text-xs font-bold text-gray-500 uppercase">Active Schedules</p>
            <p className="mt-2 text-2xl font-bold text-green-600">3</p>
          </div>
          <div className="p-6 bg-white border-l-4 border-yellow-500 shadow-lg rounded-xl">
            <p className="text-xs font-bold text-gray-500 uppercase">Delayed</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">1</p>
          </div>
          <div className="p-6 bg-white border-l-4 border-purple-500 shadow-lg rounded-xl">
            <p className="text-xs font-bold text-gray-500 uppercase">Total Buses</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">14</p>
          </div>
        </div>
      </div>
    </div>
  );
}
