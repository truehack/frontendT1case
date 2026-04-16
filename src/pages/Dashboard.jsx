// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();

  // Проверка авторизации
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  // Загрузка истории маршрутов (моковые данные)
  useEffect(() => {
    const savedRoutes = JSON.parse(localStorage.getItem('routes') || '[]');
  
    if (savedRoutes.length > 0) {
        setRoutes(savedRoutes);
    } else {
        // Если маршрутов нет, показываем пустое состояние
        setRoutes([]);
          }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateRoute = () => {
    navigate('/optimize');
  };

  const handleRouteClick = (routeId) => {
    navigate(`/optimize?route=${routeId}`);
  };

  // Фильтрация по поиску
  const filteredRoutes = routes.filter(route => 
    route.date.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.distance.includes(searchQuery) ||
    route.points.toString().includes(searchQuery)
  );

  return (
    <div className="dashboard-page">
      {/* Шапка */}
      <header className="dashboard-header">
        <div className="header-container">
          {/* Логотип */}
          <div className="logo" onClick={() => navigate('/dashboard')}>
            <span className="logo-plus">+</span>
            <span className="logo-t1">T1</span>
          </div>

          {/* Поиск */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск маршрутов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Профиль */}
          <div className="profile-section">
            <div className="avatar">Н</div>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="dashboard-main">
        <div className="main-header">
          <h1 className="page-title">История маршрутов</h1>
          <button className="btn-new-route" onClick={handleCreateRoute}>
            <span className="btn-icon">+</span>
            Новый маршрут
          </button>
        </div>

        {/* Список маршрутов */}
        <div className="routes-container">
          {filteredRoutes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p className="empty-text">
                {searchQuery ? 'Ничего не найдено' : 'История маршрутов пуста'}
              </p>
              {!searchQuery && (
                <button className="btn-create-first" onClick={handleCreateRoute}>
                  Создать первый маршрут
                </button>
              )}
            </div>
          ) : (
            <div className="routes-list">
              {filteredRoutes.map((route) => (
                <div 
                  key={route.id}
                  className="route-card"
                  onClick={() => handleRouteClick(route.id)}
                >
                  <div className="route-left">
                    <div className="route-icon">
                      <span className="route-points">{route.points}</span>
                      <span className="route-label">точек</span>
                    </div>
                    <div className="route-info">
                      <h3 className="route-title">Маршрут от {route.date}</h3>
                      <div className="route-meta">
                        <span className="meta-item"> {route.distance}</span>
                        <span className="meta-item"> {route.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="route-right">
                    <div className="savings-badge">
                      <span className="savings-icon"></span>
                      <span className="savings-text">Экономия {route.saved}</span>
                    </div>
                    <span className="route-arrow"></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}