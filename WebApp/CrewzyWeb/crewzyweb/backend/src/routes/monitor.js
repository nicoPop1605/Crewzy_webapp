import express from 'express';
import { getDb } from '../data/mongoClient.js';
import { analyzeBehaviorWithAI } from '../services/aiMonitor.js';

const router = express.Router();

// Aici ținem logurile temporare în memoria serverului (pentru a nu stresa baza de date mereu)
const userActivityLogs = {};

router.post('/log-action', async (req, res) => {
    const { userId, action, timestamp } = req.body;
    const db = getDb();

    if (!userActivityLogs[userId]) {
        userActivityLogs[userId] = [];
    }

    // Adăugăm acțiunea curentă în istoric
    userActivityLogs[userId].push({ action, time: new Date(timestamp) });

    // Păstrăm doar ultimele 5 acțiuni ca să le analizăm
    if (userActivityLogs[userId].length > 5) {
        userActivityLogs[userId].shift();
    }

    // Dacă utilizatorul a făcut 5 acțiuni, declanșăm AI-ul să verifice comportamentul
    if (userActivityLogs[userId].length === 5) {
        const timeDiff = userActivityLogs[userId][4].time - userActivityLogs[userId][0].time;

        // Dacă a făcut 5 acțiuni în mai puțin de 3 secunde (3000 ms), e FOARTE suspect. Trezim AI-ul!
        if (timeDiff < 3000) {
            console.log(`⚠️ Activitate suspectă detectată la userul ${userId}. Analizăm cu AI...`);

            const aiVerdict = await analyzeBehaviorWithAI(userId, userActivityLogs[userId]);
            console.log(`🤖 AI VERDICT: ${aiVerdict}`);

            if (aiVerdict.startsWith("BOT")) {
                // Salvăm bot-ul în baza de date la "Lista neagră"
                if (db) {
                    await db.collection('observation_list').updateOne(
                        { userId },
                        { $set: { reason: aiVerdict, detectedAt: new Date() } },
                        { upsert: true }
                    );
                }
                // Curățăm logurile ca să nu facă spam continuu la AI
                userActivityLogs[userId] = [];
                return res.status(403).json({ warning: "Comportament de tip BOT detectat de AI!", verdict: aiVerdict });
            }
        }
    }

    res.json({ success: true });
});

export default router;