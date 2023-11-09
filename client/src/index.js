import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <Router>
    <Routes>
      <Route path=":roomName" element={<App />} />
    </Routes>
  </Router>
);
