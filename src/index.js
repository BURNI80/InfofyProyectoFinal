import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './components/Router'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router />
);
