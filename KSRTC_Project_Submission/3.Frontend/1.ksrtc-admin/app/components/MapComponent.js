'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function MapComponent({ buses = [] }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const markersRef = useRef({});
  const polylinesRef = useRef([]);
  const [routeLines, setRouteLines] = useState([]);

  // Fetch polylines once on mount
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/routes/polyline')
      .then((res) => {
        setRouteLines(res.data.routes || []);
      })
      .catch((err) => console.error('Error fetching polylines:', err));
  }, []);

  // Initialize map ONLY ONCE
  useEffect(() => {
    if (isInitialized || !mapContainer.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Check if map already exists
        if (mapInstance.current) return;

        // Create map
        mapInstance.current = L.map(mapContainer.current, {
          scrollWheelZoom: true,
          touchZoom: true,
          zoom: 11,
          center: [12.9716, 77.5946],
        });

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

        setIsInitialized(true);
        console.log('✓ Map initialized successfully');
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initMap();
  }, [isInitialized]);

  // Draw polylines when they load
  useEffect(() => {
    if (!mapInstance.current || routeLines.length === 0) return;

    const drawPolylines = async () => {
      try {
        const L = await import('leaflet');

        // Remove old
        polylinesRef.current.forEach((p) => p.remove());
        polylinesRef.current = [];

        // Draw new
        routeLines.forEach((route) => {
          const poly = L.polyline(route.polyline, {
            color: '#f59e0b',
            weight: 4,
            opacity: 0.7,
          })
            .bindTooltip(route.name)
            .addTo(mapInstance.current);

          polylinesRef.current.push(poly);
        });

        console.log(`✓ Drew ${routeLines.length} route lines`);
      } catch (error) {
        console.error('Polyline error:', error);
      }
    };

    drawPolylines();
  }, [routeLines, isInitialized]);

  // Update bus markers
  useEffect(() => {
    if (!mapInstance.current || !buses || buses.length === 0) return;

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet');

        // Remove old
        Object.values(markersRef.current).forEach((m) => {
          if (m && m.remove) m.remove();
        });
        markersRef.current = {};

        // Add new
        buses.forEach((bus) => {
          if (!bus.lat || !bus.lng) return;

          const lat = parseFloat(bus.lat);
          const lng = parseFloat(bus.lng);

          if (isNaN(lat) || isNaN(lng)) return;

          const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#1e40af',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .bindPopup(`<b>${bus.id}</b><br/>Route: ${bus.route}`)
            .addTo(mapInstance.current);

          markersRef.current[bus.id] = marker;
        });
      } catch (error) {
        console.error('Marker update error:', error);
      }
    };

    updateMarkers();
  }, [buses, isInitialized]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        border: '1px solid #d1d5db',
      }}
      className="rounded-lg"
    />
  );
}
