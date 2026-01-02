import { useState } from 'react';

function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://backend-authentication-xxxxx.up.railway.app';

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

      setMessage({
        text: isLogin ? 'Login successful!' : 'Registration successful! You can now log in.',
        type: 'success'
      });

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setTimeout(() => setIsLogin(true), 2000);
      }

    } catch (err) {
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
                placeholder="John"
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
