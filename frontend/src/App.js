import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import LoginView from './modules/auth/login_view';
import NotFoundView from './modules/errors/not_found_view';
import Health from './modules/health/view';
import Home from './modules/home/view';
import BiodataView from './modules/biodata/view';
import ListBiodataView from './modules/list-biodata/view';


function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">home</Link> |{" "}
        <Link to="/health">status</Link> |{" "}
        <Link to="/login">login</Link> |{" "}
        <Link to="/biodata">biodata</Link> |{" "}
        <Link to="/list-biodata">list biodata</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health" element={<Health />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/biodata" element={<BiodataView />} />
        <Route path="/list-biodata" element={<ListBiodataView />} />
        <Route path="/biodata-detail/:id" element={<BiodataView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
