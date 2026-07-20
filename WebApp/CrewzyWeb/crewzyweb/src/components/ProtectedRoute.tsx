import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('jwt_token');

    if (!userStr || !token) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userStr);

    if (requireAdmin && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    if (!requireAdmin && user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};