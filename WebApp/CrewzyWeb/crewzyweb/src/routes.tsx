import React from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import { CalendarPage } from "./pages/CalendarPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { FriendsPage } from "./pages/FriendsPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./components/Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="size-full flex bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50">
      <Sidebar />
      {children}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: "/discover",
    element: <Layout><DiscoverPage /></Layout>,
  },
  {
    path: "/calendar",
    element: <Layout><CalendarPage /></Layout>,
  },
  {
    path: "/friends",
    element: <Layout><FriendsPage /></Layout>,
  },
  {
    path: "/profile",
    element: <Layout><ProfilePage /></Layout>,
  },
  {
    path: "/promotion",
    element: <Layout><div className="flex-1 flex items-center justify-center text-gray-500">Promotion - Coming Soon</div></Layout>,
  },
  {
    path: "*",
    element: <Layout><div className="flex-1 flex items-center justify-center text-gray-500">Page Not Found</div></Layout>,
  },
]);