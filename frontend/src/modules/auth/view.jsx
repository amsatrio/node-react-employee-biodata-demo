import React, { useState } from 'react';

function Auth() {
  // Toggle between 'login' and 'register' views
  const [isLogin, setIsLogin] = useState(true);

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login Logic
      console.log('Logging in with:', { email, password });
      alert(`Logging in with: ${email}`);
    } else {
      // Register Logic
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Registering with:', { name, email, password });
      alert(`Registered successfully as: ${name}`);
    }
  };

  return (
    <div>
      {/* Form Header */}
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      {/* Auth Form */}
      <form onSubmit={handleSubmit}>
        {/* Name field - Only shows for Register */}
        {!isLogin && (
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        {/* Email field - Shows for both */}
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password field - Shows for both */}
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password field - Only shows for Register */}
        {!isLogin && (
          <div>
            <label>Confirm Password: </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {/* Toggle View Link */}
      <p>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            // Optional: Clear fields when switching forms
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setName('');
          }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}

export default Auth;