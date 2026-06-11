import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Warranty from './pages/Warranty';
import Maintenance from './pages/Maintenance';
import { Navbar, Footer } from './components/Navigation';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
