// API service to load real KSRTC data
export const loadKSRTCBuses = async () => {
  try {
    const response = await fetch('/ksrtc.csv')
    const text = await response.text()
    
    // Parse CSV
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      console.warn('CSV is empty, using default buses')
      return getDefaultBuses()
    }
    
    const headers = lines[0].split(',').map(h => h.trim())
    const buses = []
    const uniqueRoutes = new Set()
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const values = lines[i].split(',').map(v => v.trim())
      const bus = {}
      
      headers.forEach((header, idx) => {
        bus[header] = values[idx] || ''
      })
      
      // Skip if missing key fields
      if (!bus.ID || !bus.Origin || !bus.Destination) continue
      
      const routeKey = `${bus.Origin}→${bus.Destination}`
      
      if (!uniqueRoutes.has(routeKey)) {
        buses.push({
          id: bus.ID,
          busNumber: bus.ID,
          route: routeKey,
          origin: bus.Origin,
          destination: bus.Destination,
          serviceType: bus.ServiceType || 'Regular',
          brand: bus.Brand || 'KSRTC',
          distance: parseInt(bus.Distance) || 20,
          stops: parseInt(bus.Stops) || 10,
          frequency: bus.Frequency || '15 min',
          capacity: parseInt(bus.Capacity) || 50,
          occupancy: Math.floor(Math.random() * 50),
          status: ['In Transit', 'At Stop', 'Delayed'][Math.floor(Math.random() * 3)],
          speed: Math.floor(Math.random() * 40) + 10,
          eta: `${Math.floor(Math.random() * 15) + 5} min`,
          delay: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
          nextStop: 'Next Stop',
          lat: 12.9 + Math.random() * 0.3,
          lng: 77.5 + Math.random() * 0.3,
        })
        
        uniqueRoutes.add(routeKey)
      }
    }
    
    console.log(`Loaded ${buses.length} unique routes from CSV`)
    return buses.length > 0 ? buses : getDefaultBuses()
  } catch (error) {
    console.error('Error loading CSV:', error)
    return getDefaultBuses()
  }
}

// Fallback buses if CSV not found
export const getDefaultBuses = () => {
  return [
    { id: 'KSRTC-54F', busNumber: 'KSRTC-54F', route: 'Majestic → Whitefield', origin: 'Majestic', destination: 'Whitefield', serviceType: 'Express', brand: 'KSRTC', distance: 22, stops: 8, frequency: '15 min', capacity: 50, occupancy: 38, status: 'In Transit', speed: 35, eta: '5 min', delay: 0, nextStop: 'Brigade Road', lat: 12.9766, lng: 77.5712 },
    { id: 'KSRTC-55A', busNumber: 'KSRTC-55A', route: 'Koramangala → Airport', origin: 'Koramangala', destination: 'Airport', serviceType: 'Regular', brand: 'KSRTC', distance: 35, stops: 15, frequency: '20 min', capacity: 50, occupancy: 42, status: 'In Transit', speed: 28, eta: '8 min', delay: 3, nextStop: 'MG Road', lat: 12.9279, lng: 77.6271 },
    { id: 'KSRTC-56B', busNumber: 'KSRTC-56B', route: 'Indiranagar → Yeshwanthpur', origin: 'Indiranagar', destination: 'Yeshwanthpur', serviceType: 'Regular', brand: 'KSRTC', distance: 28, stops: 12, frequency: '15 min', capacity: 55, occupancy: 22, status: 'At Stop', speed: 0, eta: '2 min', delay: 0, nextStop: 'Ulsoor', lat: 12.9698, lng: 77.6399 },
  ]
}
