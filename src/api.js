// src/api.js
const API_BASE = 'http://localhost:8000/api'; // потом замените на реальный

export const api = {
  // Генерация синтетических точек
  generatePoints: async (params) => {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Ошибка генерации точек');
    return response.json();
  },

  // Получение базового маршрута
  getBaselineRoute: async (points) => {
    const response = await fetch(`${API_BASE}/route/baseline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
    return response.json();
  },

  // Получение оптимизированного маршрута
  getOptimizedRoute: async (points) => {
    const response = await fetch(`${API_BASE}/route/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
    return response.json();
  },

  // Получение полилинии маршрута для отрисовки
  getRoutePolyline: async (points) => {
    const response = await fetch(`${API_BASE}/route/polyline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
    return response.json();
  }
};