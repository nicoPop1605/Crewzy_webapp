import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full flex bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 overflow-hidden">
            <Sidebar />

            {/* Containerul principal pentru conținutul paginilor */}
            <main className="flex-1 h-full overflow-y-auto pb-20 md:pb-0">
                {children}
            </main>
        </div>
    );
}