import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../data/mongoClient.js';

const router = express.Router();
const SECRET_KEY = "crewzy_super_secret_key_2026";

// 1. REGISTER (USER sau ADMIN)

router.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;
    const db = getDb();

    if (!db) return res.status(500).json({ error: "Database offline" });

    try {
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email-ul este deja folosit!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Dacă nu se trimite rol, default este USER
        const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

        const newUser = { email, name, password: hashedPassword, role: userRole, createdAt: new Date() };
        await db.collection('users').insertOne(newUser);

        res.status(201).json({ message: "Cont creat cu succes!" });
    } catch (error) { res.status(500).json({ error: "Eroare internă" }); }
});

// 2. 3-WAY AUTH: LOGIN (PASUL 1 - Verificare Parolă și Generare OTP)
// 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = getDb();

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(401).json({ error: "Credențiale incorecte!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Credențiale incorecte!" });

        // GENERĂM OTP (Cod de 6 cifre) pentru 3-Way Auth
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Salvăm OTP-ul în baza de date cu valabilitate 5 minute
        await db.collection('users').updateOne(
            { email },
            { $set: { otp: otpCode, otpExpires: new Date(Date.now() + 5 * 60000) } }
        );

        console.log(`\n📧 [SIMULARE EMAIL] Către: ${email}`);
        console.log(`🔑 CODUL TĂU DE AUTENTIFICARE (OTP) ESTE: ${otpCode}\n`);

        res.json({ message: "Codul OTP a fost trimis pe email. Te rugăm să îl introduci pentru a finaliza logarea.", requireOtp: true, email: email });

    } catch (error) { res.status(500).json({ error: "Eroare internă a serverului" }); }
});

// 3. 3-WAY AUTH: VERIFY OTP (PASUL 2 - Emitere Token Final)

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const db = getDb();

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            return res.status(401).json({ error: "Cod OTP invalid sau expirat!" });
        }

        // Ștergem OTP-ul pentru că a fost folosit
        await db.collection('users').updateOne({ email }, { $unset: { otp: "", otpExpires: "" } });

        // Generăm JWT-ul cu Permisiunile de Rol
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ message: "Login finalizat cu succes!", token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) { res.status(500).json({ error: "Eroare internă" }); }
});

// 4. PASSWORD RECOVERY: FORGOT PASSWORD

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const db = getDb();

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(404).json({ error: "Email-ul nu există în sistem." });

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        await db.collection('users').updateOne(
            { email },
            { $set: { resetToken: resetToken, resetTokenExpires: new Date(Date.now() + 15 * 60000) } } // 15 minute
        );

        console.log(`\n📧 [SIMULARE EMAIL] Către: ${email}`);
        console.log(`🔄 CODUL TĂU DE RESETARE PAROLĂ ESTE: ${resetToken}\n`);

        res.json({ message: "Instrucțiunile de resetare au fost trimise pe email." });
    } catch (error) { res.status(500).json({ error: "Eroare internă" }); }
});

// 5. PASSWORD RECOVERY: RESET PASSWORD

router.post('/reset-password', async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    const db = getDb();

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user || user.resetToken !== resetToken || new Date() > user.resetTokenExpires) {
            return res.status(400).json({ error: "Cod de resetare invalid sau expirat!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.collection('users').updateOne(
            { email },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpires: "" }
            }
        );

        res.json({ message: "Parola a fost schimbată cu succes! Te poți loga acum." });
    } catch (error) { res.status(500).json({ error: "Eroare internă" }); }
});

export default router;