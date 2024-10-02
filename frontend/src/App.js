import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/todo';
import About from './components/About';

function App() {

  return (
    <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg" style={{ background: 'linear-gradient(135deg, #ff4b5c, #ff7675)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" style={{ color: '#fff', fontSize: '1.75rem', letterSpacing: '2px' }} to="/todo">
              <i className="bi bi-list-check me-2"></i>Todo List
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active text-white" to="/todo">
                    <i className="bi bi-house-door-fill me-1"></i>Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/About">
                    <i className="bi bi-info-circle-fill me-1"></i>About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>


        <Routes>
          <Route path='/' element={<Todo />} />
          <Route path='/About' element={<About />} />
          <Route path='/todo' element={<Todo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
