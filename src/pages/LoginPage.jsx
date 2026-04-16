// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';  // ← Добавляем CSS файл

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/optimize');  // ← Переход на страницу оптимизатора
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Логотип */}
        <div className="login-logo">
          <span className="logo-plus">+</span>
          <span className="logo-t1">T1</span>
        </div>

        {/* Заголовок */}
        <h1 className="login-title">Вход в систему</h1>
        <p className="login-subtitle">Оптимизация маршрутов доставки</p>

        {/* Форма */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Войти
          </button>
        </form>

        <div className="login-footer">© 2026 T1 Холдинг</div>
      </div>
    </div>
  );
}