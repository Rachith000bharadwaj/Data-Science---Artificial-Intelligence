'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 text-white shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="container px-6 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl">🚌</div>
            <div>
              <div className="text-xl font-bold">KSRTC</div>
              <div className="text-xs text-blue-100">Bus Booking</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link href="/journey-planner" className="font-semibold transition hover:text-blue-100">
              🔍 Book Ticket
            </Link>
            <Link href="/my-bookings" className="font-semibold transition hover:text-blue-100">
              📋 My Bookings
            </Link>
            <button className="px-4 py-2 font-bold text-blue-600 transition bg-white rounded-lg hover:bg-blue-50">
              🔐 Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="text-2xl md:hidden" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="pb-4 mt-4 space-y-2 md:hidden">
            <Link href="/journey-planner" className="block py-2 hover:text-blue-100">
              🔍 Book Ticket
            </Link>
            <Link href="/my-bookings" className="block py-2 hover:text-blue-100">
              📋 My Bookings
            </Link>
            <button className="w-full px-4 py-2 font-bold text-blue-600 bg-white rounded-lg">
              🔐 Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
