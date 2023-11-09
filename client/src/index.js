import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './Pages/App/App';
import Index from './Pages/Index/Index';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path=":roomName" element={<App />} />
    </Routes>
  </Router>
);
