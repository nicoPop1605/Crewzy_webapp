import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
    }

    try {
        // Căutăm userul în baza de date și aducem și datele despre Rolul lui
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: {
                role: {
                    include: { permissions: true } // Aducem și permisiunile (ALL_ACCESS sau READ_EVENTS)
                }
            }
        });

        // Verificăm dacă există și dacă parola se potrivește (fără criptare, fix cum a cerut profu')
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        // Nu trimitem parola înapoi către frontend pentru siguranță
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login" });
    }
};