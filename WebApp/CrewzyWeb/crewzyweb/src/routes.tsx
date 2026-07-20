import { createBrowserRouter} from "react-router-dom";
import { CalendarPage } from "./pages/CalendarPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { FriendsPage } from "./pages/FriendsPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { ProtectedRoute } from "./components/ProtectedRoute"

// Componentă pentru a securiza rutele pe baza rolului


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        // AM ELIMINAT <Layout> AICI. Pagina de admin va ocupa tot ecranul.
        element: (
            <ProtectedRoute requireAdmin={true}>
                <AdminPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/",
        element: <ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>,
    },
    {
        path: "/discover",
        element: <ProtectedRoute><Layout><DiscoverPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/calendar",
        element: <ProtectedRoute><Layout><CalendarPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/friends",
        element: <ProtectedRoute><Layout><FriendsPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/profile",
        element: <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>,
    },
    {
        path: "/promotion",
        element: <ProtectedRoute><Layout><div className="flex-1 flex items-center justify-center text-gray-500">Promotion - Coming Soon</div></Layout></ProtectedRoute>,
    },
    {
        path: "*",
        element: <Layout><div className="flex-1 flex items-center justify-center text-gray-500">Page Not Found</div></Layout>,
    },
]);