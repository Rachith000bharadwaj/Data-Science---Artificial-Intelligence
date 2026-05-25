'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const API_BASE = 'http://localhost:5000'

export default function TrackingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const busId = searchParams.get('id')

  const [busData, setBusData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!busId) {
      setError('No bus selected')
      setLoading(false)
      return
    }

    const fetchBusData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/api/bus_location/${busId}`)
        
        if (response.ok) {
          const data = await response.json()
          setBusData({
            busNumber: data.bus_id,
            route: data.route,
            speed: data.speed,
            eta: data.estimated_arrival,
            occupancy: data.occupancy,
            capacity: data.capacity,
            nextStop: data.next_stop,
            latitude: data.latitude,
            longitude: data.longitude
          })
        } else {
          setError('Bus not found')
        }
      } catch (err) {
        setError('Error loading bus data: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBusData()
    const interval = setInterval(fetchBusData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [busId])

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderBottom: '2px solid #1e40af',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontWeight: 'bold',
            fontSize: '24px',
            color: '#06b6d4'
          }}>
            📍 Where Is My Bus
          </div>
          <button
            onClick={() => router.back()}
            style={{
              background: '#06b6d4',
              color: '#0f172a',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back
          </button>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#cbd5e1'
          }}>
            <div style={{
              border: '3px solid rgba(6, 182, 212, 0.2)',
              borderTop: '3px solid #06b6d4',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }}></div>
            <p>Loading bus details...</p>
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p>{error}</p>
            <button
              onClick={() => router.back()}
              style={{
                marginTop: '15px',
                background: '#06b6d4',
                color: '#0f172a',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Go Back
            </button>
          </div>
        ) : busData ? (
          <div>
            {/* TRACKING CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid #1e40af',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px',
              color: '#e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h1 style={{
                  fontSize: '32px',
                  color: '#06b6d4',
                  margin: 0
                }}>
                  {busData.busNumber}
                </h1>
                <div style={{
                  background: '#06b6d4',
                  color: '#0f172a',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  {busData.speed > 0 ? '🟢 In Transit' : '🔵 At Stop'}
                </div>
              </div>

              <div style={{
                fontSize: '18px',
                color: '#06b6d4',
                marginBottom: '30px'
              }}>
                {busData.route}
              </div>

              {/* STATS GRID */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #06b6d4'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                    ETA
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                    {busData.eta}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #06b6d4'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Current Speed
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                    {busData.speed} km/h
                  </div>
                </div>

                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #06b6d4'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Occupancy
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                    {busData.occupancy}/{busData.capacity}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #06b6d4'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Next Stop
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                    {busData.nextStop}
                  </div>
                </div>
              </div>

              {/* OCCUPANCY BAR */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  Occupancy Level
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(busData.occupancy / busData.capacity) * 100}%`,
                    height: '100%',
                    background: busData.occupancy > busData.capacity * 0.7
                      ? 'linear-gradient(90deg, #ff9800, #f44336)'
                      : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                    transition: 'width 0.3s'
                  }}></div>
                </div>
              </div>

              {/* COORDINATES */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#94a3b8'
              }}>
                <p>📍 Current Location: {busData.latitude.toFixed(4)}, {busData.longitude.toFixed(4)}</p>
              </div>
            </div>

            {/* LIVE TRACKING SECTION */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid #1e40af',
              borderRadius: '15px',
              padding: '30px'
            }}>
              <h2 style={{
                fontSize: '20px',
                color: '#06b6d4',
                marginBottom: '20px',
                marginTop: 0
              }}>
                📍 Live Map
              </h2>
              <div style={{
                background: '#0f172a',
                padding: '40px',
                borderRadius: '10px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                <p>🗺️ Interactive map would display here</p>
                <p style={{ marginTop: '10px' }}>Bus Location: ({busData.latitude.toFixed(4)}, {busData.longitude.toFixed(4)})</p>
                <p style={{ color: '#06b6d4', marginTop: '10px' }}>
                  Heading: {busData.route}
                </p>
              </div>

              {/* AUTO-REFRESH INDICATOR */}
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid #06b6d4',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#06b6d4',
                fontSize: '12px'
              }}>
                🔄 Auto-updating every 5 seconds
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#64748b',
        fontSize: '12px',
        marginTop: '40px',
        borderTop: '1px solid #1e293b'
      }}>
        <p>© 2025 KSRTC - Where Is My Bus</p>
      </footer>
    </>
  )
}
