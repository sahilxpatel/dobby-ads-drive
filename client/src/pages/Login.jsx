import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/drive');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setError('');
    setter(e.target.value);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f5f7',
      padding: '20px'
    },
    card: {
      background: '#fff',
      padding: '40px 30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
      boxSizing: 'border-box'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    title: {
      margin: '0 0 8px 0',
      color: '#333',
      fontSize: '24px'
    },
    subtitle: {
      margin: '0',
      color: '#666',
      fontSize: '14px'
    },
    errorBox: {
      background: '#ffebee',
      color: '#d32f2f',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #ffcdd2',
      fontSize: '14px',
      textAlign: 'center'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      color: '#444',
      fontWeight: '500'
    },

    button: {
      width: '100%',
      padding: '12px',
      background: '#0066ff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background 0.2s'
    },
    buttonDisabled: {
      background: '#80b3ff',
      cursor: 'not-allowed'
    },
    footer: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#666'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dobby Ads Drive</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              className="auth-input"
              placeholder="Enter your email"
              value={email} 
              onChange={handleInputChange(setEmail)} 
              required 
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div className="auth-password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input"
                placeholder="Enter your password"
                value={password} 
                onChange={handleInputChange(setPassword)} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="auth-toggle"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={styles.footer}>
          Don't have an account? <Link to="/signup" style={{color: '#0066ff', textDecoration: 'none', fontWeight: '500'}}>Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
