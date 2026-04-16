import { useState } from 'react';
import MapComponent from './MapComponent';
import './App.css';

function RouteOptimizer() {
  const [inputMode, setInputMode] = useState('auto'); // 'auto' | 'manual'
  const [pointInputMode, setPointInputMode] = useState('coordinates'); // 'coordinates' | 'addresses'
  const [radius, setRadius] = useState(1000);
  const [pointsCount, setPointsCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ручной ввод точек
  const [manualPoints, setManualPoints] = useState([]);
  const [newPointLat, setNewPointLat] = useState('');
  const [newPointLng, setNewPointLng] = useState('');
  const [newPointAddress, setNewPointAddress] = useState('');

  // Данные маршрутов
  const [points, setPoints] = useState([]);
  const [baselineRoute, setBaselineRoute] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [showRoute, setShowRoute] = useState('none');

  const radiusOptions = [500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];
  const pointsOptions = [5, 10, 15, 20, 25, 30, 40, 50];

  // Генерация синтетических точек
  const handleGeneratePoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockPoints = Array.from({ length: pointsCount }, (_, i) => ({
        id: i + 1,
        lat: 55.751244 + (Math.random() - 0.5) * 0.1,
        lng: 37.618423 + (Math.random() - 0.5) * 0.1,
        address: `Точка ${i + 1}`,
        type: 'auto'
      }));
      
      setPoints(mockPoints);
      setManualPoints([]);
      setShowRoute('none');
      setBaselineRoute(null);
      setOptimizedRoute(null);
    } catch (err) {
      setError('Ошибка генерации точек');
    } finally {
      setLoading(false);
    }
  };

  // Добавление точки вручную (координаты)
  const handleAddPointCoordinates = () => {
    if (!newPointLat || !newPointLng) {
      setError('Введите координаты');
      return;
    }
    
    const lat = parseFloat(newPointLat);
    const lng = parseFloat(newPointLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Некорректные координаты');
      return;
    }

    const newPoint = {
      id: Date.now(),
      lat,
      lng,
      address: newPointAddress || `Точка ${manualPoints.length + 1}`,
      type: 'manual'
    };

    setManualPoints([...manualPoints, newPoint]);
    setNewPointLat('');
    setNewPointLng('');
    setNewPointAddress('');
    setError(null);
  };

  // Добавление точки по клику на карте
  const handleMapClick = (lat, lng) => {
    if (inputMode !== 'manual') return;
    
    const newPoint = {
      id: Date.now(),
      lat,
      lng,
      address: `Точка ${manualPoints.length + 1}`,
      type: 'manual'
    };

    setManualPoints([...manualPoints, newPoint]);
  };

  // Удаление точки
  const handleDeletePoint = (id) => {
    setManualPoints(manualPoints.filter(p => p.id !== id));
  };

  // Использование ручных точек для расчёта
  const handleUseManualPoints = () => {
    if (manualPoints.length < 2) {
      setError('Добавьте минимум 2 точки');
      return;
    }
    setPoints(manualPoints);
    setShowRoute('none');
    setBaselineRoute(null);
    setOptimizedRoute(null);
  };

  const handleCalculateBaseline = async () => {
    setLoading(true);
    try {
      const mockRoute = {
        distance: Math.round(points.length * 1.5),
        time: Math.round(points.length * 3),
        order: points.map(p => p.id)
      };
      setBaselineRoute(mockRoute);
      setShowRoute('baseline');
    } catch (err) {
      setError('Ошибка расчёта базового маршрута');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const baselineDistance = baselineRoute?.distance || points.length * 1.5;
      const optimizedDistance = Math.round(baselineDistance * 0.7);
      
      const mockRoute = {
        distance: optimizedDistance,
        time: Math.round(optimizedDistance * 2),
        order: points.map(p => p.id).sort(() => Math.random() - 0.5),
        savings: Math.round(((baselineDistance - optimizedDistance) / baselineDistance) * 100)
      };
      setOptimizedRoute(mockRoute);
      setShowRoute('optimized');
      // ✅ СОХРАНЕНИЕ МАРШРУТА В LOCALSTORAGE
      saveRouteToHistory({
        points: points.length,
        distance: `${optimizedDistance} км`,
        time: `${Math.round(optimizedDistance * 2)} мин`,
        saved: `${mockRoute.savings}%`,
        date: new Date().toLocaleDateString('ru-RU'),
        pointsData: points  // Сохраняем координаты точек
      });

    } catch (err) {
      setError('Ошибка оптимизации');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Функция сохранения маршрута
  const saveRouteToHistory = (route) => {
    const savedRoutes = JSON.parse(localStorage.getItem('routes') || '[]');
    const newRoute = {
      id: Date.now(),
      ...route
    };
    savedRoutes.unshift(newRoute);  // Добавляем в начало
    localStorage.setItem('routes', JSON.stringify(savedRoutes));
  };

  

  const handleReset = () => {
    setPoints([]);
    setManualPoints([]);
    setBaselineRoute(null);
    setOptimizedRoute(null);
    setShowRoute('none');
    setError(null);
  };

  return (
    <div className="app-container">
      <div className="map-section">
        <MapComponent 
          points={points}
          manualPoints={manualPoints}
          inputMode={inputMode}
          onMapClick={handleMapClick}
          baselineRoute={baselineRoute}
          optimizedRoute={optimizedRoute}
          showRoute={showRoute}
        />
      </div>

      <div className="sidebar">
        <div className="logo">
          <span style={{ fontSize: '40px', color: '#33adff', fontWeight: 'bold' }}>+</span>
          <span style={{ fontSize: '32px', color: '#0066cc', fontWeight: 'bold' }}>T1</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
            onClick={() => window.location.href = '/dashboard'}
            className="control-btn"
            style={{ 
              flex: 1,
              background: '#10a8b9',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            История маршрутов
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className="control-btn secondary"
            style={{ 
              flex: 1,
              background: '#62a0ba',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Выйти
          </button>
        </div>
        <div className="control-group">
          {/* Режим ввода точек */}
          <div className="toggle-group">
            <button 
              className={`toggle-btn ${inputMode === 'auto' ? 'active' : ''}`}
              onClick={() => setInputMode('auto')}
            >
              Генерация
            </button>
            <button 
              className={`toggle-btn ${inputMode === 'manual' ? 'active' : ''}`}
              onClick={() => setInputMode('manual')}
            >
              Ручной ввод
            </button>
          </div>

          {/* Автоматическая генерация */}
          {inputMode === 'auto' && (
            <>
              <select 
                className="control-select"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                disabled={points.length > 0}
              >
                {radiusOptions.map((r) => (
                  <option key={r} value={r}>Радиус: {r} м</option>
                ))}
              </select>

              <select 
                className="control-select"
                value={pointsCount}
                onChange={(e) => setPointsCount(Number(e.target.value))}
                disabled={points.length > 0}
              >
                {pointsOptions.map((count) => (
                  <option key={count} value={count}>Кол-во точек: {count}</option>
                ))}
              </select>

              <button 
                className="control-btn" 
                onClick={handleGeneratePoints}
                disabled={loading || points.length > 0}
              >
                {loading ? 'Загрузка...' : 'Сгенерировать точки'}
              </button>
            </>
          )}

          {/* Ручной ввод */}
          {inputMode === 'manual' && (
            <>
              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${pointInputMode === 'coordinates' ? 'active' : ''}`}
                  onClick={() => setPointInputMode('coordinates')}
                >
                  Координаты
                </button>
                
              </div>

              {pointInputMode === 'coordinates' && (
                <div className="manual-input-form">
                  <input
                    type="text"
                    className="control-input"
                    placeholder="Широта (55.75)"
                    value={newPointLat}
                    onChange={(e) => setNewPointLat(e.target.value)}
                  />
                  <input
                    type="text"
                    className="control-input"
                    placeholder="Долгота (37.61)"
                    value={newPointLng}
                    onChange={(e) => setNewPointLng(e.target.value)}
                  />
                  <input
                    type="text"
                    className="control-input"
                    placeholder="Адрес (необязательно)"
                    value={newPointAddress}
                    onChange={(e) => setNewPointAddress(e.target.value)}
                  />
                  <button 
                    className="control-btn" 
                    onClick={handleAddPointCoordinates}
                  >
                    Добавить точку
                  </button>
                </div>
              )}

              {pointInputMode === 'click' && (
                <div className="click-hint">
                  Кликните по карте чтобы добавить точку
                </div>
              )}

              {/* Список добавленных точек */}
              {manualPoints.length > 0 && (
                <div className="points-list">
                  <h4>Точки ({manualPoints.length})</h4>
                  {manualPoints.map((point, index) => (
                    <div key={point.id} className="point-item">
                      <span className="point-number">{index + 1}</span>
                      <span className="point-coords">
                        {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                      </span>
                      <button 
                        className="point-delete"
                        onClick={() => handleDeletePoint(point.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    className="control-btn" 
                    onClick={handleUseManualPoints}
                    disabled={manualPoints.length < 2}
                  >
                    Использовать точки
                  </button>
                </div>
              )}
            </>
          )}

          {/* Кнопки расчёта */}
          {points.length > 0 && (
            <>
              <button 
                className="control-btn" 
                onClick={handleCalculateBaseline}
                disabled={loading || baselineRoute}
              >
                {baselineRoute ? 'Базовый построен' : 'Построить базовый'}
              </button>

              <button 
                className="control-btn" 
                onClick={handleOptimize}
                disabled={loading || !baselineRoute || optimizedRoute}
              >
                {optimizedRoute ? 'Оптимизировано' : 'Оптимизировать'}
              </button>

              <div className="btn-row">
                <button className="control-btn secondary" onClick={handleReset}>
                  Сбросить
                </button>
                <button 
                  className="control-btn" 
                  onClick={() => setShowRoute(showRoute === 'baseline' ? 'none' : 'baseline')}
                  disabled={!baselineRoute}
                >
                  Показать базовый
                </button>
              </div>
            </>
          )}
        </div>

        {optimizedRoute && (
          <div className="stats-group">
            <div className="stat-item">
              <span>Было:</span>
              <span>{baselineRoute?.distance || 'X'} км</span>
            </div>
            <div className="stat-item">
              <span>Стало:</span>
              <span>{optimizedRoute.distance} км</span>
            </div>
            <div className="stat-item" style={{ background: '#4caf50' }}>
              <span>Экономия:</span>
              <span>{optimizedRoute.savings}%</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteOptimizer;