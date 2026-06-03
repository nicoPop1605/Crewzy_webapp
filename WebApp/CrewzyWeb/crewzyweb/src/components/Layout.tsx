import React from 'react';
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import SessionTimeout from "./SessionTimeout";

export function Layout({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('jwt_token');

    // Dacă NU are token, îl trimitem forțat pe pagina de Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Dacă are token, îi afișăm interfața cu Sidebar și Paznic
    return (
        <div className="size-full flex bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50">
            <Sidebar />
            <SessionTimeout />
            {children}
        </div>
    );
}