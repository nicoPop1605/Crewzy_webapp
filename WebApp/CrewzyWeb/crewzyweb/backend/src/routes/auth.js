import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "crewzy_super_secret_key_2026";

// 1. REGISTER
router.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email-ul este deja folosit!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const targetRoleName = role === 'ADMIN' ? 'ADMIN' : 'USER';

        // Găsim rolul în DB. Dacă nu există (fiind prima rulare), îl creăm automat!
        let roleRecord = await prisma.role.findUnique({ where: { name: targetRoleName } });
        if (!roleRecord) {
            roleRecord = await prisma.role.create({
                data: { name: targetRoleName, description: 'Auto-generated role' }
            });
        }

        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                roleId: roleRecord.id // Aici era problema înainte!
            }
        });

        res.status(201).json({ message: "Cont creat cu succes!" });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA REGISTER: ", error);
        res.status(500).json({ error: "Eroare internă. Verifică logurile pe Render." });
    }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Credențiale incorecte!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Credențiale incorecte!" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 5 * 60000);

        await prisma.user.update({
            where: { email },
            data: { otp: otpCode, otpExpires: expirationTime }
        });

        console.log(`\n📧 [SIMULARE EMAIL] Către: ${email}`);
        console.log(`🔑 CODUL TĂU OTP ESTE: ${otpCode}\n`);

        res.json({ message: "Codul OTP a fost trimis pe email.", requireOtp: true, email: email });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA LOGIN: ", error);
        res.status(500).json({ error: "Eroare internă a serverului" });
    }
});

// 3. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Aducem și rolul pentru a ști unde redirecționăm
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!user || user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
            return res.status(401).json({ error: "Cod OTP invalid sau expirat!" });
        }

        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpires: null }
        });

        // 1. Extragem rolul în siguranță (dacă ceva merge prost în DB, punem default pe USER)
        const roleName = user.role ? user.role.name : 'USER';

        const token = jwt.sign(
            { userId: user.id, role: roleName, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // 2. AICI ERA PROBLEMA! Acum trimitem și ID-ul, și rolul curățat.
        res.json({
            message: "Login finalizat cu succes!",
            token,
            user: {
                id: user.id,          // <--- FĂRĂ ASTA NU MERGEA ADĂUGAREA DE PRIETENI!
                name: user.name,
                email: user.email,
                role: roleName        // <--- ASTA REPARĂ REDIRECȚIONAREA CĂTRE /admin
            }
        });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA VERIFY OTP: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

// 4. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Email-ul nu există în sistem." });

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 15 * 60000);

        await prisma.user.update({
            where: { email },
            data: { resetToken: resetToken, resetTokenExpires: expirationTime }
        });

        console.log(`\n📧 [SIMULARE EMAIL] Către: ${email}`);
        console.log(`🔄 CODUL TĂU DE RESETARE PAROLĂ ESTE: ${resetToken}\n`);

        res.json({ message: "Instrucțiunile de resetare au fost trimise pe email." });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA FORGOT PWD: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

// 5. RESET PASSWORD
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
            data: { password: hashedPassword, resetToken: null, resetTokenExpires: null }
        });

        res.json({ message: "Parola a fost schimbată cu succes! Te poți loga acum." });
    } catch (error) {
        console.error("🔥 EROARE INTERNA LA RESET PWD: ", error);
        res.status(500).json({ error: "Eroare internă" });
    }
});

export default router;