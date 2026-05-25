import './App.css';
import Auth from './modules/auth/view';
import Health from './modules/health/view';
import Home from './modules/home/view';

import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/health">Status</Link> |{" "}
        <Link to="/auth">Auth</Link> |{" "}
        <Link to="/form-employee">Form Employee</Link>
      </nav>

      {/* Routes */}
      <Routes>s
        <Route path="/" element={<Home />} />
        <Route path="/health" element={<Health />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
