// ============================================
// API SERVICE - Handles all backend requests
// ============================================

import axios from 'axios';

// ============================================
// 1. CONFIGURATION
// ============================================

// The base URL where your Flask backend is running
const API_BASE_URL = 'http://127.0.0.1:5000';

// Create an axios instance with default settings
// This is like creating a "template" for all API calls
const api = axios.create({
  baseURL: API_BASE_URL,           // All requests go to this URL
  timeout: 10000,                   // Wait max 10 seconds for response
  headers: {
    'Content-Type': 'application/json',  // Send/receive JSON data
  },
});

// ============================================
// 2. ERROR HANDLING
// ============================================

// This runs before each request is sent
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// This runs after each response is received
api.interceptors.response.use(
  (response) => {
    // Success response
    console.log('API Response Success:', response.status);
    return response;
  },
  (error) => {
    // Error response
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// ============================================
// 3. API SERVICE FUNCTIONS
// ============================================

// Create an object with all API methods
export const apiService = {
  
  // ============================================
  // HEALTH & SYSTEM ENDPOINTS
  // ============================================
  
  /**
   * Check if backend is running and healthy
   * GET /health
   * Returns: { status, spark_active, model_loaded, prediction_mode }
   */
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error.message);
      return null;
    }
  },

  // ============================================
  // DASHBOARD ENDPOINTS
  // ============================================

  /**
   * Get dashboard analytics data
   * GET /api/analytics
   * Returns: { totalBuses, dailyPassengers, activeRoutes, onTimePercentage, fleetUtilization, avgDelay, peakHours, ... }
   */
  getAnalytics: async () => {
    try {
      const response = await api.get('/api/analytics');
      return response.data;
    } catch (error) {
      console.error('Analytics fetch failed:', error.message);
      return {};
    }
  },

  /**
   * Get real-time bus status data
   * GET /api/buses/status
   * Returns: { buses: [ { id, route, status, speed, occupancy, lat, lng, ... }, ... ] }
   */
  getBusStatus: async () => {
    try {
      const response = await api.get('/api/buses/status');
      return response.data;
    } catch (error) {
      console.error('Bus status fetch failed:', error.message);
      return { buses: [] };
    }
  },

  /**
   * Get traffic data for charts
   * GET /api/traffic
   * Returns: { speedDistribution, congestionLevels, ... }
   */
  getTrafficData: async () => {
    try {
      const response = await api.get('/api/traffic');
      return response.data;
    } catch (error) {
      console.error('Traffic data fetch failed:', error.message);
      return {};
    }
  },

  // ============================================
  // ROUTES ENDPOINTS
  // ============================================

  /**
   * Get all available KSRTC routes
   * GET /api/routes
   * Returns: { routes: [ { id, name, distance, avg_passengers, ... }, ... ] }
   */
  getRoutes: async () => {
    try {
      const response = await api.get('/api/routes');
      return response.data;
    } catch (error) {
      console.error('Routes fetch failed:', error.message);
      return { routes: [] };
    }
  },

  /**
   * Get analytics data for each route
   * GET /api/analytics/routes
   * Returns: { route_analytics: [ { route_id, on_time_percentage, avg_delay_minutes, total_passengers, hourly_passengers, ... }, ... ] }
   */
  getRouteAnalytics: async () => {
    try {
      const response = await api.get('/api/analytics/routes');
      return response.data;
    } catch (error) {
      console.error('Route analytics fetch failed:', error.message);
      return { route_analytics: [] };
    }
  },

  /**
   * Get detailed data for a specific route
   * GET /api/routes/{routeId}
   * @param {string} routeId - The route ID (e.g., 'Route_101')
   * Returns: { route_details including stops, timing, capacity, etc. }
   */
  getRouteDetails: async (routeId) => {
    try {
      const response = await api.get(`/api/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.error(`Route details fetch failed for ${routeId}:`, error.message);
      return {};
    }
  },

  // ============================================
  // OPTIMIZATION ENDPOINTS
  // ============================================

  /**
   * Get route optimization recommendations
   * POST /api/optimize
   * @param {object} params - { route_id, buses_available, date }
   * Returns: { predicted_passengers, buses_required, optimal_interval, estimated_revenue, recommendations }
   */
  optimizeRoute: async (params) => {
    try {
      const response = await api.post('/api/optimize', {
        route_id: params.route_id,
        buses_available: params.buses_available || 5,
        date: params.date || new Date().toISOString().split('T')[0],
      });
      return response.data;
    } catch (error) {
      console.error('Route optimization failed:', error.message);
      return null;
    }
  },

  /**
   * Get optimization for a specific route ID
   * GET /api/optimize/{routeId}
   * @param {string} routeId - The route ID
   * Returns: optimization data
   */
  getRouteOptimization: async (routeId) => {
    try {
      const response = await api.get(`/api/optimize/${routeId}`);
      return response.data;
    } catch (error) {
      console.error(`Optimization fetch failed for ${routeId}:`, error.message);
      return null;
    }
  },

  // ============================================
  // SCHEDULE ENDPOINTS
  // ============================================

  /**
   * Get schedule predictions
   * POST /api/predict-schedule
   * @param {object} params - { route_id, date, time, ... }
   * Returns: { predictions, confidence, recommendations }
   */
  getSchedulePredictions: async (params) => {
    try {
      const response = await api.post('/api/predict-schedule', params);
      return response.data;
    } catch (error) {
      console.error('Schedule prediction failed:', error.message);
      return null;
    }
  },

  /**
   * Get all schedules for a route
   * GET /api/schedules/{routeId}
   * @param {string} routeId - The route ID
   * Returns: { schedules: [ { time, frequency, buses_required, ... }, ... ] }
   */
  getSchedules: async (routeId) => {
    try {
      const response = await api.get(`/api/schedules/${routeId}`);
      return response.data;
    } catch (error) {
      console.error(`Schedules fetch failed for ${routeId}:`, error.message);
      return { schedules: [] };
    }
  },

  // ============================================
  // BUS TRACKING ENDPOINTS
  // ============================================

  /**
   * Get real-time location of all buses
   * GET /api/buses/locations
   * Returns: { buses: [ { id, lat, lng, speed, route, ... }, ... ] }
   */
  getBusLocations: async () => {
    try {
      const response = await api.get('/api/buses/locations');
      return response.data;
    } catch (error) {
      console.error('Bus locations fetch failed:', error.message);
      return { buses: [] };
    }
  },

  /**
   * Get details for a specific bus
   * GET /api/buses/{busId}
   * @param {string} busId - The bus ID (e.g., 'Bus-54F')
   * Returns: { bus_details including current location, status, route, etc. }
   */
  getBusDetails: async (busId) => {
    try {
      const response = await api.get(`/api/buses/${busId}`);
      return response.data;
    } catch (error) {
      console.error(`Bus details fetch failed for ${busId}:`, error.message);
      return null;
    }
  },

  // ============================================
  // PREDICTION ENDPOINTS
  // ============================================

  /**
   * Get passenger demand prediction
   * POST /api/predict-demand
   * @param {object} params - { route_id, date, time }
   * Returns: { predicted_passengers, confidence_score }
   */
  predictDemand: async (params) => {
    try {
      const response = await api.post('/api/predict-demand', params);
      return response.data;
    } catch (error) {
      console.error('Demand prediction failed:', error.message);
      return null;
    }
  },

  /**
   * Get traffic prediction for a route
   * POST /api/predict-traffic
   * @param {object} params - { route_id, date, time }
   * Returns: { predicted_speed, congestion_level, expected_delay }
   */
  predictTraffic: async (params) => {
    try {
      const response = await api.post('/api/predict-traffic', params);
      return response.data;
    } catch (error) {
      console.error('Traffic prediction failed:', error.message);
      return null;
    }
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  /**
   * Create a new schedule
   * POST /api/admin/schedules
   * @param {object} scheduleData - { route_id, frequency, buses_required, ... }
   */
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/api/admin/schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Schedule creation failed:', error.message);
      return null;
    }
  },

  /**
   * Update route configuration
   * PUT /api/admin/routes/{routeId}
   * @param {string} routeId - The route ID
   * @param {object} updateData - { name, distance, capacity, ... }
   */
  updateRoute: async (routeId, updateData) => {
    try {
      const response = await api.put(`/api/admin/routes/${routeId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Route update failed for ${routeId}:`, error.message);
      return null;
    }
  },

  // ============================================
  // EXPORT ENDPOINTS
  // ============================================

  /**
   * Export report (CSV/PDF)
   * GET /api/export/report
   * @param {string} format - 'csv' or 'pdf'
   * Returns: file download
   */
  exportReport: async (format = 'csv') => {
    try {
      const response = await api.get(`/api/export/report?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Report export failed:', error.message);
      return null;
    }
  },
};

// ============================================
// 4. EXPORT
// ============================================

// Export the service as default
export default apiService;

// Also export for named imports if needed
export { api };
