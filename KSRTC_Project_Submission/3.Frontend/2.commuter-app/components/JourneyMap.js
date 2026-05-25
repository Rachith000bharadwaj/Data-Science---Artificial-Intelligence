'use client';

import { useEffect, useRef, useState } from 'react';

export default function JourneyMap({ route }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!route || !mapContainer.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Remove old map if exists
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        // Create new map
        mapInstance.current = L.map(mapContainer.current, {
          scrollWheelZoom: true,
        });

        // Calculate bounds from route coordinates
        const bounds = L.latLngBounds([
          [route.origin_lat, route.origin_lng],
          [route.dest_lat, route.dest_lng],
        ]);

        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(mapInstance.current);

        // Fix marker icons
        const DefaultIcon = L.Icon.Default;
        DefaultIcon.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Draw polyline
        L.polyline([[route.origin_lat, route.origin_lng], [route.dest_lat, route.dest_lng]], {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
        }).addTo(mapInstance.current);

        // Add markers
        L.circleMarker([route.origin_lat, route.origin_lng], {
          radius: 10,
          fillColor: '#10b981',
          color: '#059669',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .bindPopup(`<b>📍 ${route.origin}</b><br/>Departure`)
          .addTo(mapInstance.current);

        L.circleMarker([route.dest_lat, route.dest_lng], {
          radius: 10,
          fillColor: '#ef4444',
          color: '#dc2626',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .bindPopup(`<b>🏁 ${route.destination}</b><br/>Arrival`)
          .addTo(mapInstance.current);

        setMapReady(true);
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initMap();
  }, [route]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        border: '1px solid #d1d5db',
      }}
      className="rounded-lg"
    />
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

export default function JourneyMap({ route }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!route || !mapContainer.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        if (mapInstance.current) {
          mapInstance.current.remove();
        }

        mapInstance.current = L.map(mapContainer.current);
        const bounds = L.latLngBounds([
          [route.origin_lat, route.origin_lng],
          [route.dest_lat, route.dest_lng],
        ]);
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
        }).addTo(mapInstance.current);

        // Draw route
        L.polyline([[route.origin_lat, route.origin_lng], [route.dest_lat, route.dest_lng]], {
          color: '#3b82f6',
          weight: 4,
        }).addTo(mapInstance.current);

        // Markers
        L.circleMarker([route.origin_lat, route.origin_lng], {
          radius: 10,
          fillColor: '#10b981',
          color: '#059669',
          weight: 2,
        })
          .bindPopup(`<b>${route.origin}</b>`)
          .addTo(mapInstance.current);

        L.circleMarker([route.dest_lat, route.dest_lng], {
          radius: 10,
          fillColor: '#ef4444',
          color: '#dc2626',
          weight: 2,
        })
          .bindPopup(`<b>${route.destination}</b>`)
          .addTo(mapInstance.current);
      } catch (error) {
        console.error('Map error:', error);
      }
    };

    initMap();
  }, [route]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '400px', borderRadius: '0.5rem', overflow: 'hidden' }}
    />
  );
}
