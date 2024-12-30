import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Styling global

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Merender di elemen dengan id 'root'
);
