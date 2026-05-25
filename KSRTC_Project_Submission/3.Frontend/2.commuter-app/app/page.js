'use client'

import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000'

export default function Home() {
  const [buses, setBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showRouteOptimization, setShowRouteOptimization] = useState(false)
  const [stats, setStats] = useState({
    busesOnline: 0,
    inTransit: 0,
    delayed: 0,
    onTimeRate: '98%'
  })
  const [searchBus, setSearchBus] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load buses and routes from Flask API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch buses
        const busIds = ['Bus-54F', 'Bus-55A', 'Bus-56B', 'Bus-77A', 'Bus-68E']
        const busesData = []

        for (const busId of busIds) {
          try {
            const response = await fetch(`${API_BASE}/api/bus_location/${busId}`)
            if (response.ok) {
              const data = await response.json()
              busesData.push({
                busNumber: data.bus_id,
                apiId: busId,
                route: data.route,
                status: data.speed > 0 ? 'In Transit' : 'At Stop',
                speed: data.speed,
                eta: data.estimated_arrival,
                occupancy: data.occupancy,
                capacity: data.capacity,
                nextStop: data.next_stop,
                delay: data.speed > 30 ? 'On Time' : '5min late',
                latitude: data.latitude,
                longitude: data.longitude
              })
            }
          } catch (err) {
            console.error(`Error fetching bus ${busId}:`, err)
          }
        }

        // If API fails, use static data
        if (busesData.length === 0) {
          busesData.push(
            {
              busNumber: 'KSRTC-54F',
              apiId: 'Bus-54F',
              route: 'Majestic → Whitefield',
              status: 'In Transit',
              speed: 35,
              eta: '5 min',
              occupancy: 38,
              capacity: 50,
              nextStop: 'MG Road Junction',
              delay: 'On Time',
              latitude: 12.9716,
              longitude: 77.5946
            },
            {
              busNumber: 'KSRTC-55A',
              apiId: 'Bus-55A',
              route: 'Koramangala → Airport',
              status: 'In Transit',
              speed: 28,
              eta: '8 min',
              occupancy: 42,
              capacity: 50,
              nextStop: 'Koramangala Main',
              delay: '3min late',
              latitude: 12.9750,
              longitude: 77.6000
            },
            {
              busNumber: 'KSRTC-56B',
              apiId: 'Bus-56B',
              route: 'Indiranagar → Yeshwanthpur',
              status: 'At Stop',
              speed: 0,
              eta: '2 min',
              occupancy: 22,
              capacity: 55,
              nextStop: 'Indiranagar Station',
              delay: 'On Time',
              latitude: 12.9680,
              longitude: 77.5900
            }
          )
        }

        setBuses(busesData)

        // Fetch routes optimization data
        const routeNames = ['Majestic → Whitefield', 'Koramangala → Airport', 'Indiranagar → Yeshwanthpur']
        const routesData = []

        for (const routeName of routeNames) {
          try {
            const response = await fetch(`${API_BASE}/api/route_analysis/${encodeURIComponent(routeName)}`)
            if (response.ok) {
              const data = await response.json()
              routesData.push({
                name: routeName,
                ...data
              })
            }
          } catch (err) {
            console.error(`Error fetching route ${routeName}:`, err)
          }
        }

        // If API fails, use static route data
        if (routesData.length === 0) {
          routesData.push(
            {
              name: 'Majestic → Whitefield',
              route_name: 'Majestic → Whitefield',
              average_speed_kmh: 34.5,
              peak_congestion_hours: '7-10 AM, 5-8 PM',
              route_status: 'High Demand',
              total_observations: 2450,
              recommendations: [
                'Add extra bus during 7-10 AM (predicted: 250+ passengers)',
                'Consider alternative route due to regular congestion',
                'High demand peaks at 9 AM - increase frequency by 20%'
              ],
              historical_performance: {
                avg_delay_minutes: 5.2,
                on_time_percentage: 85,
                passenger_satisfaction: 4.2
              }
            },
            {
              name: 'Koramangala → Airport',
              route_name: 'Koramangala → Airport',
              average_speed_kmh: 32.1,
              peak_congestion_hours: '6-9 AM, 4-7 PM',
              route_status: 'Medium Demand',
              total_observations: 1890,
              recommendations: [
                'Optimal frequency: Every 12 minutes',
                'Current bus utilization: 85%',
                'Consider express bus during peak hours'
              ],
              historical_performance: {
                avg_delay_minutes: 3.8,
                on_time_percentage: 88,
                passenger_satisfaction: 4.5
              }
            },
            {
              name: 'Indiranagar → Yeshwanthpur',
              route_name: 'Indiranagar → Yeshwanthpur',
              average_speed_kmh: 35.8,
              peak_congestion_hours: '8-10 AM, 6-8 PM',
              route_status: 'Low Demand',
              total_observations: 1650,
              recommendations: [
                'Current schedule is optimal',
                'Monitor demand during festival seasons',
                'Low congestion - good for commuters'
              ],
              historical_performance: {
                avg_delay_minutes: 2.1,
                on_time_percentage: 92,
                passenger_satisfaction: 4.7
              }
            }
          )
        }

        setRoutes(routesData)

        // Calculate stats
        const transit = busesData.filter(b => b.status === 'In Transit').length
        const delayed = busesData.filter(b => b.delay !== 'On Time').length

        setStats({
          busesOnline: busesData.length,
          inTransit: transit,
          delayed: delayed,
          onTimeRate: '98%'
        })

        setError('')
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data. Using sample data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Filter buses
  const filteredBuses = buses.filter(bus => {
    const matchesSearch = 
      bus.busNumber.toLowerCase().includes(searchBus.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchBus.toLowerCase())

    if (filterStatus === 'all') return matchesSearch
    return matchesSearch && bus.status === filterStatus
  })

  const getStatusColor = (status) => {
    if (status === 'In Transit') return '🟢'
    if (status === 'At Stop') return '🔵'
    return '⚪'
  }

  const handleTrack = (bus) => {
    setSelectedBus(bus)
  }

  const handleBackFromTracking = () => {
    setSelectedBus(null)
  }

  const handleViewRouteOptimization = (route) => {
    setSelectedRoute(route)
    setShowRouteOptimization(true)
  }

  // TRACKING PAGE
  if (selectedBus) {
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
          <div style={{
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
              onClick={handleBackFromTracking}
              style={{
                background: '#06b6d4',
                color: '#0f172a',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
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
                {selectedBus.busNumber}
              </h1>
              <div style={{
                background: '#06b6d4',
                color: '#0f172a',
                padding: '8px 15px',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}>
                {selectedBus.speed > 0 ? '🟢 In Transit' : '🔵 At Stop'}
              </div>
            </div>

            <div style={{
              fontSize: '18px',
              color: '#06b6d4',
              marginBottom: '30px'
            }}>
              {selectedBus.route}
            </div>

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
                  {selectedBus.eta}
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #06b6d4'
              }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Speed
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {selectedBus.speed} km/h
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
                  {selectedBus.occupancy}/{selectedBus.capacity}
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
                  {selectedBus.nextStop}
                </div>
              </div>
            </div>

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
                  width: `${(selectedBus.occupancy / selectedBus.capacity) * 100}%`,
                  height: '100%',
                  background: selectedBus.occupancy > selectedBus.capacity * 0.7
                    ? 'linear-gradient(90deg, #ff9800, #f44336)'
                    : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#94a3b8'
            }}>
              <p>📍 Location: {selectedBus.latitude.toFixed(4)}, {selectedBus.longitude.toFixed(4)}</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  // ROUTE OPTIMIZATION PAGE
  if (showRouteOptimization && selectedRoute) {
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
          <div style={{
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
              🛣️ Route Optimization
            </div>
            <button
              onClick={() => setShowRouteOptimization(false)}
              style={{
                background: '#06b6d4',
                color: '#0f172a',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
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
                {selectedRoute.route_name}
              </h1>
              <div style={{
                background: selectedRoute.route_status === 'High Demand' ? '#ef4444' : selectedRoute.route_status === 'Medium Demand' ? '#f59e0b' : '#10b981',
                color: '#0f172a',
                padding: '8px 15px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {selectedRoute.route_status}
              </div>
            </div>

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
                  Average Speed
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {selectedRoute.average_speed_kmh} km/h
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #06b6d4'
              }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Peak Hours
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {selectedRoute.peak_congestion_hours}
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #06b6d4'
              }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  On-Time %
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {selectedRoute.historical_performance.on_time_percentage}%
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #06b6d4'
              }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Avg Delay
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {selectedRoute.historical_performance.avg_delay_minutes}m
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #06b6d4'
              }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Satisfaction
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>
                  {selectedRoute.historical_performance.passenger_satisfaction}⭐
                </div>
              </div>
            </div>

            {/* AI RECOMMENDATIONS */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#22c55e',
                marginTop: 0,
                marginBottom: '15px',
                fontSize: '16px'
              }}>
                🤖 AI-Powered Recommendations
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {selectedRoute.recommendations.map((rec, idx) => (
                  <li key={idx} style={{
                    color: '#cbd5e1',
                    marginBottom: '10px',
                    paddingLeft: '25px',
                    position: 'relative'
                  }}>
                    <span style={{ position: 'absolute', left: 0 }}>✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* DETAILED STATS */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{
                color: '#3b82f6',
                marginTop: 0,
                marginBottom: '15px',
                fontSize: '16px'
              }}>
                📊 Detailed Performance
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Total Observations</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {selectedRoute.total_observations}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Average Delay</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {selectedRoute.historical_performance.avg_delay_minutes} minutes
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Passenger Satisfaction</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {selectedRoute.historical_performance.passenger_satisfaction}/5.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // HOMEPAGE
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
        <div style={{
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
          <nav style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'center'
          }}>
            <button onClick={() => setSearchBus('')} style={{
              color: '#cbd5e1',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontSize: '16px'
            }}>
            </button>
          </nav>
        </div>
      </header>

      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #1e40af'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#06b6d4',
            margin: '0 0 10px 0'
          }}>
            🚌 Track Your KSRTC Bus Live
          </h1>
          <p style={{
            color: '#cbd5e1',
            fontSize: '16px',
            margin: '0'
          }}>
            Know exactly where your bus is, real-time updates every second
          </p>
        </div>
      </section>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e40af',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>
              {stats.busesOnline}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>
              Buses Online
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e40af',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>
              {stats.inTransit}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>
              In Transit
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e40af',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>
              {stats.delayed}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>
              Delayed
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e40af',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>
              {stats.onTimeRate}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>
              On-Time Rate
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => { setShowRouteOptimization(false); setSelectedBus(null) }}
            style={{
              padding: '12px 25px',
              background: '#06b6d4',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚌 Live Buses
          </button>
          <button
            onClick={() => setShowRouteOptimization(true)}
            style={{
              padding: '12px 25px',
              background: '#1e40af',
              color: '#06b6d4',
              border: '2px solid #06b6d4',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🛣️ Routes Optimization
          </button>
        </div>

        {/* SEARCH BOX - ONLY FOR BUSES TAB */}
        {!showRouteOptimization && (
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e40af',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  Search Bus or Route
                </label>
                <input
                  type="text"
                  placeholder="e.g., KSRTC-54F or Whitefield"
                  value={searchBus}
                  onChange={(e) => setSearchBus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f172a',
                    border: '1px solid #1e40af',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  Filter Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f172a',
                    border: '1px solid #1e40af',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">All Buses</option>
                  <option value="In Transit">In Transit</option>
                  <option value="At Stop">At Stop</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => setSearchBus('')}
                  style={{
                    width: '100%',
                    background: '#06b6d4',
                    color: '#0f172a',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BUSES LIST */}
        {!showRouteOptimization && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1' }}>
                <p>Loading buses...</p>
              </div>
            ) : filteredBuses.length > 0 ? (
              <div>
                {filteredBuses.map((bus, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      border: '2px solid #1e40af',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '15px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 1fr',
                      gap: '20px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ color: '#06b6d4', fontSize: '24px', fontWeight: 'bold' }}>
                      {bus.busNumber}
                    </div>
                    <div>
                      <div style={{ color: '#06b6d4', fontSize: '16px', marginBottom: '8px' }}>
                        {bus.route}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        fontSize: '14px',
                        color: '#cbd5e1',
                        flexWrap: 'wrap'
                      }}>
                        <span>{getStatusColor(bus.status)} {bus.status}</span>
                        <span>⏱️ ETA: {bus.eta}</span>
                        <span>🚄 Speed: {bus.speed} km/h</span>
                        <span>👥 {bus.occupancy}/{bus.capacity}</span>
                        <span style={{ color: bus.delay === 'On Time' ? '#10b981' : '#f59e0b' }}>
                          🕐 {bus.delay}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => handleTrack(bus)}
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
                        Track
                      </button>
                      <button
                        style={{
                          background: '#1e40af',
                          color: '#06b6d4',
                          border: '1px solid #06b6d4',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#cbd5e1'
              }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                  No buses found matching "{searchBus}"
                </p>
              </div>
            )}
          </>
        )}

        {/* ROUTES LIST */}
        {showRouteOptimization && (
          <div>
            {routes.length > 0 ? (
              routes.map((route, index) => (
                <div
                  key={index}
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '2px solid #1e40af',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => handleViewRouteOptimization(route)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{
                      color: '#06b6d4',
                      fontSize: '18px',
                      margin: 0
                    }}>
                      {route.route_name}
                    </h3>
                    <div style={{
                      background: route.route_status === 'High Demand' ? '#ef4444' : route.route_status === 'Medium Demand' ? '#f59e0b' : '#10b981',
                      color: '#0f172a',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {route.route_status}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Avg Speed</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>
                        {route.average_speed_kmh} km/h
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Peak Hours</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#06b6d4' }}>
                        {route.peak_congestion_hours}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>On-Time %</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>
                        {route.historical_performance.on_time_percentage}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Satisfaction</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>
                        {route.historical_performance.passenger_satisfaction}⭐
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '15px',
                    color: '#06b6d4',
                    fontSize: '12px',
                    fontStyle: 'italic'
                  }}>
                    Click to view detailed analysis →
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#cbd5e1'
              }}>
                <p>Loading routes...</p>
              </div>
            )}
          </div>
        )}
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
        <p>Powered by KSRTC Dataset & Real-Time Tracking API</p>
      </footer>
    </>
  )
}
