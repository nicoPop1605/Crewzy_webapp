import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { OfflineSyncManager } from './utils/offlineSync'; 

OfflineSyncManager.init();

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);