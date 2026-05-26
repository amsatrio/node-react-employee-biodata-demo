import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginView() {
  const navigate = useNavigate(); // For redirecting after successful login

  // Toggle between 'login' and 'register' views
  const [isLogin, setIsLogin] = useState(true);

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Basic loading & feedback state
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Dynamic endpoint target mapping your Express router
    const endpoint = isLogin ? '/v1/auth/login' : '/v1/auth/register';
    
    try {
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Express returned a 400 or 401 error message status
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        alert('Login successful!');
        // Store your JWT Token securely in localStorage
        localStorage.setItem('token', data.token);
        
        // Redirect to protected dashboard or profile overview
        navigate('/biodata'); 
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true); // Flip user back to the login screen
        setPassword('');  // Clear password for security
      }
    } catch (err) {
      alert(`Authentication Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form Header */}
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      {/* Auth Form */}
      <form onSubmit={handleSubmit}>

        {/* Email field */}
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Password field */}
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {/* Toggle View Link */}
      <p>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button 
          type="button"
          onClick={() => {
            setEmail('');
            setPassword('');
            setIsLogin(!isLogin); // Toggle state view smoothly instead of hard linking
          }}
          disabled={loading}
        > 
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}