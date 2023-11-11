import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App';
import CreateRoom from './pages/CreateRoom/CreateRoom';
import Index from './pages/Index/Index';

import Header from './components/Header/Header';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <Router>
  <Header />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/room" element={<CreateRoom />} />
      <Route path="/room/:roomName" element={<App />} />
    </Routes>
  </Router>
);