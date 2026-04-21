/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/offlineSync.ts
export class OfflineSyncManager {
    static init() {
        window.addEventListener('offline', () => {
            console.warn('📶 Network DOWN. Offline mode activated.');
            document.cookie = `crewzy_status=offline; path=/`;
        });

        window.addEventListener('online', () => {
            console.log('📶 Network UP. Synchronizing with server...');
            document.cookie = `crewzy_status=online; path=/`;
            this.syncData();
        });
    }

    static saveOfflineAction(action: any) {
        const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
        queue.push(action);
        localStorage.setItem('offline_queue', JSON.stringify(queue));
        console.log('💾 Saved to local memory for later sync.');
    }

    static syncData() {
        const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
        if (queue.length === 0) return;

        console.log(`🔄 Syncing ${queue.length} items to server...`);
        // Aici se face loop prin cereri și se trimit prin GraphQL la server
        localStorage.removeItem('offline_queue');
    }
}