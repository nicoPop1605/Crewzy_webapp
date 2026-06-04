import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Tragem parola secretă din environment, altfel folosim un fallback
const SECRET_KEY = process.env.JWT_SECRET || "crewzy_super_secret_key_2026";

// 1. REGISTER (USER sau ADMIN)
router.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email-ul este deja folosit!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: userRole
            }
        });

        res.status(201).json({ message: "Cont creat cu succes!" });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA REGISTER: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

// 2. 3-WAY AUTH: LOGIN (PASUL 1 - Verificare Parolă și Generare OTP)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Credențiale incorecte!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Credențiale incorecte!" });

        // GENERĂM OTP (Cod de 6 cifre) pentru 3-Way Auth
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 5 * 60000);

        // Salvăm OTP-ul în baza de date cu valabilitate 5 minute
        await prisma.user.update({
            where: { email },
            data: {
                otp: otpCode,
                otpExpires: expirationTime
            }
        });

        console.log(`\n📧 [SIMULARE EMAIL] Către: ${email}`);
        console.log(`🔑 CODUL TĂU DE AUTENTIFICARE (OTP) ESTE: ${otpCode}\n`);

        res.json({ message: "Codul OTP a fost trimis pe email. Te rugăm să îl introduci.", requireOtp: true, email: email });

    } catch (error) {
        console.error("🔥 EROARE INTERNA LA LOGIN: ", error);
        res.status(500).json({ error: "Eroare internă a serverului" });
    }
});

// 3. 3-WAY AUTH: VERIFY OTP (PASUL 2 - Emitere Token Final)
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
            return res.status(401).json({ error: "Cod OTP invalid sau expirat!" });
        }

        // Ștergem OTP-ul pentru că a fost folosit (Prisma folosește null în loc de unset)
        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpires: null }
        });

        // Generăm JWT-ul cu Permisiunile de Rol (Prisma folosește user.id, nu user._id)
        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ message: "Login finalizat cu succes!", token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA VERIFY OTP: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

// 4. PASSWORD RECOVERY: FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Email-ul nu există în sistem." });

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 15 * 60000);

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: resetToken,
                resetTokenExpires: expirationTime
            }
        });

        console.log(`\n📧 [SIMULARE EMAIL] Către: ${email}`);
        console.log(`🔄 CODUL TĂU DE RESETARE PAROLĂ ESTE: ${resetToken}\n`);

        res.json({ message: "Instrucțiunile de resetare au fost trimise pe email." });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA FORGOT PWD: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

// 5. PASSWORD RECOVERY: RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { email, resetToken, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.resetToken !== resetToken || !user.resetTokenExpires || new Date() > user.resetTokenExpires) {
            return res.status(400).json({ error: "Cod de resetare invalid sau expirat!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        });

        res.json({ message: "Parola a fost schimbată cu succes! Te poți loga acum." });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA RESET PWD: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

export default router;