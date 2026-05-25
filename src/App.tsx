import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CursorGlow } from './components/CursorGlow';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Cursor Glow effect behind text and grids */}
        <CursorGlow />
        
        {/* Sticky navbar navigation */}
        <Navbar />
        
        {/* Page body content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        {/* Footer info & links */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
