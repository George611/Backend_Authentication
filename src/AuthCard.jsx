import { useState } from 'react';

function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://backendauthentication-production.up.railway.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
      } else {
        setMessage({
          text: 'Registration successful! You can now log in.',
          type: 'success'
        });
        setTimeout(() => setIsLogin(true), 2000);
      }

    } catch (err) {
      console.error('AuthCard API Error:', err);
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoggedIn) {
    return (
      <div className="glass-card animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--primary-gold)' }}>100/100</h1>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in">
      <div className="auth-header">
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p>{isLogin ? 'Enter your credentials to access your account' : 'Join us today and start your journey'}</p>
      </div>

      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="George"
                required={!isLogin}
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required={!isLogin}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="auth-footer">
        {isLogin ? (
          <p>
            Don't have an account?
            <span className="auth-link" onClick={() => setIsLogin(false)}>Sign up</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span className="auth-link" onClick={() => setIsLogin(true)}>Sign in</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthCard;
