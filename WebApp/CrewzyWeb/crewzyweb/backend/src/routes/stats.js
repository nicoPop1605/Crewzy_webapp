import express from 'express';
import NodeCache from 'node-cache';
import { getDb } from '../data/mongoClient.js';

const router = express.Router();
// Setăm cache-ul să expire la 30 de secunde
const statsCache = new NodeCache({ stdTTL: 30 });

// ==============================================================
// 1. GENERARE DATE FAKER (Să umplem baza cu zeci de mii de date)
// ==============================================================
router.post('/generate-massive-data', async (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "DB Offline" });

    // Creăm INDECȘI (Cerință Gold) pentru a face căutările de 100x mai rapide
    await db.collection('events').createIndex({ "attendees.id": 1 });
    await db.collection('events').createIndex({ createdAt: -1 });

    res.json({ message: "Indecșii de performanță au fost creați! Folosește Faker loop-ul existent pentru a pompa date." });
});


router.get('/heavy-stats-naive', async (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "DB Offline" });

    try {
        // Căutare grea pe relație many-to-many: Numărăm la câte evenimente participă fiecare
        const heavyStat = await db.collection('events').aggregate([
            { $unwind: "$attendees" }, // Desfacem array-ul
            { $group: { _id: "$attendees.id", participations: { $sum: 1 }, userName: { $first: "$attendees.name" } } },
            { $sort: { participations: -1 } },
            { $limit: 10 }
        ]).toArray();

        res.json({ source: "DATABASE (SLOW)", data: heavyStat });
    } catch (err) {
        res.status(500).json({ error: "Eroare la calcul." });
    }
});


router.get('/heavy-stats-robust', async (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "DB Offline" });

    try {
        // 1. Verificăm dacă avem deja răspunsul în RAM (Cache)
        const cachedData = statsCache.get("top_attendees");
        if (cachedData) {
            // Dacă un atac DDOS lovește aici, returnăm instant din memorie! Nu atingem baza de date.
            return res.json({ source: "CACHE MEMORY (FAST)", data: cachedData });
        }

        // 2. Dacă nu e în cache (sau a expirat), calculăm din nou
        const heavyStat = await db.collection('events').aggregate([
            { $unwind: "$attendees" },
            { $group: { _id: "$attendees.id", participations: { $sum: 1 }, userName: { $first: "$attendees.name" } } },
            { $sort: { participations: -1 } },
            { $limit: 10 }
        ]).toArray();

        // 3. Salvăm rezultatul în Cache pentru următoarele 30 de secunde
        statsCache.set("top_attendees", heavyStat);

        res.json({ source: "DATABASE (SLOW - CALCULATED FIRST TIME)", data: heavyStat });
    } catch (err) {
        res.status(500).json({ error: "Eroare la calcul." });
    }
});

export default router;