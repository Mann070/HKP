import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import './index.css';

// Simple Toast Provider
export const ToastContext = React.createContext();

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <Router>
        <div>
          <header className="container">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 className="header-title">Harsiddh Kids Point</h1>
            </Link>
          </header>

          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<CategoryPage />} />
            </Routes>
          </main>

          {/* Toast Container */}
          <div className="toast-container">
            {toasts.map((toast) => (
              <div key={toast.id} className={`toast ${toast.type}`}>
                {toast.message}
              </div>
            ))}
          </div>
        </div>
      </Router>
    </ToastContext.Provider>
  );
}

export default App;
