import jwt from 'jsonwebtoken';

const SECRET_KEY = "crewzy_super_secret_key_2026";

// 1. Verifică dacă utilizatorul este logat (are Token valid)
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ error: "Un token este necesar pentru autentificare" });

    try {
        // Token-ul vine sub forma "Bearer eyJhbGci..." așa că îl tăiem
        const bearerToken = token.split(" ")[1] || token;
        const decoded = jwt.verify(bearerToken, SECRET_KEY);
        req.user = decoded; // Salvăm datele utilizatorului în request
        next(); // Îl lăsăm să treacă
    } catch (err) {
        return res.status(401).json({ error: "Token invalid sau expirat" });
    }
};

// 2. Verifică dacă utilizatorul are un anumit ROL (Schema de permisiuni)
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Acces interzis. Nu ai permisiunile necesare pentru acest rol." });
        }
        next();
    };
};