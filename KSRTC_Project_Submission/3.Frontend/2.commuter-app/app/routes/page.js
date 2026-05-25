'use client'

import { useState, useEffect } from 'react'
import { loadKSRTCBuses } from '../services/api'

export default function RoutesPage() {
  const [uniqueRoutes, setUniqueRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      const buses = await loadKSRTCBuses()
      
      // Get unique routes
      const routesMap = new Map()
      buses.forEach(bus => {
        if (!routesMap.has(bus.route)) {
          routesMap.set(bus.route, {
            name: bus.route,
            origin: bus.origin,
            destination: bus.destination,
            distance: bus.distance,
            stops: bus.stops,
            frequency: bus.frequency,
            busesCount: 1
          })
        } else {
          const route = routesMap.get(bus.route)
          route.busesCount += 1
          routesMap.set(bus.route, route)
        }
      })
      
      setUniqueRoutes(Array.from(routesMap.values()))
      setLoading(false)
    }
    
    fetchRoutes()
  }, [])

  return (
    <>
      {/* HEADER */}
      <header>
        <div className="container">
          <div className="logo">
            <span style={{ fontSize: '32px' }}>📍</span>
            <div>Where Is My Bus</div>
          </div>
          <nav>
            <a href="/">📊 Dashboard</a>
            <a href="/routes">🛣️ Routes</a>
          </nav>
        </div>
      </header>

      {/* ROUTES */}
      <div style={{ padding: '40px 20px', background: '#0f172a', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h1 style={{ marginBottom: '30px', color: '#06b6d4', fontSize: '32px' }}>
            🛣️ All KSRTC Routes ({uniqueRoutes.length})
          </h1>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1' }}>
              <div style={{ fontSize: '24px' }}>⏳ Loading routes...</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {uniqueRoutes.map((route, idx) => (
                <div key={idx} className="card">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>
                        {route.name}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', fontSize: '14px' }}>
                        <div>📏 <span style={{ color: '#06b6d4' }}>{route.distance} km</span></div>
                        <div>🛑 <span style={{ color: '#06b6d4' }}>{route.stops} stops</span></div>
                        <div>⏱️ <span style={{ color: '#06b6d4' }}>{route.frequency}</span></div>
                        <div>🚌 <span style={{ color: '#10b981' }}>{route.busesCount} buses</span></div>
                      </div>
                    </div>
                    <a href="/">
                      <button className="btn btn-primary">Track →</button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a href="/">
              <button className="btn btn-secondary" style={{ fontSize: '16px', padding: '12px 40px' }}>
                ← Back to Dashboard
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <p>&copy; 2025 KSRTC - Where Is My Bus Real-Time Tracking</p>
      </footer>
    </>
  )
}
