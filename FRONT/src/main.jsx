import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import DisplayData from './DisplayData';
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/data-entry' element={<App />} />
        <Route path='/display/:nroCertificado' element={<DisplayData />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
