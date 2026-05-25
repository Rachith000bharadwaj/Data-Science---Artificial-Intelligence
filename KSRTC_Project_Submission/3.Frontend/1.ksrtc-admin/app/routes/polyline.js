import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function MapComponent({ buses = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const polylinesRef = useRef([]);
  const [routeLines, setRouteLines] = useState([]);

  // Fetch and store polylines
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/routes/polyline").then((res) => {
      setRouteLines(res.data.routes);
    });
  }, []);

  useEffect(() => {
    // ... [map initialization as before]
    // Remove old polylines
    if (polylinesRef.current.length > 0 && map.current) {
      polylinesRef.current.forEach((poly) => poly.remove());
      polylinesRef.current = [];
    }
    if (map.current && routeLines.length > 0) {
      import('leaflet').then((L) => {
        routeLines.forEach((route) => {
          const poly = L.polyline(route.polyline, {
            color: "#6366f1", // indigo-500
            weight: 4,
            opacity: 0.7,
          }).addTo(map.current);
          polylinesRef.current.push(poly);
        });
      });
    }
  }, [routeLines]);

  // ... [rest as before, markers etc.]

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "0.5rem",
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
        border: "1px solid #d1d5db",
      }}
      ref={mapContainer}
      className="rounded-lg"
    />
  );
}
