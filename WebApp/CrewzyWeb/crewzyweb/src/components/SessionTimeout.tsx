import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SessionTimeout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login') return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const logoutUser = () => {
            console.log("⏱️ Sesiune expirată din cauza inactivității!");

            // Ștergem datele sesiunii
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('currentUser');

            alert("Sesiunea a expirat din cauza inactivității. Te rugăm să te reconectezi.");
            navigate('/login'); // Îl trimitem la ușa din față
        };

        const resetTimer = () => {
            clearTimeout(timeoutId);
            // Când prezinți, poți să iei mâinile de pe mouse 1 minut ca să se vadă efectul.
            timeoutId = setTimeout(logoutUser, 60000);
        };

        // Orice interacțiune a utilizatorului resetează cronometrul
        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Pornim cronometrul la prima încărcare a paginii
        resetTimer();

        // Curățăm evenimentele când componenta se demontează (best practice în React)
        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
            clearTimeout(timeoutId);
        };
    }, [navigate, location.pathname]);

    return null; // Componenta nu afișează absolut nimic pe ecran
}