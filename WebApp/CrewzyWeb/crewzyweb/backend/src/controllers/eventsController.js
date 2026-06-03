// Ștergem importul de memoryStore și aducem Prisma!
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getEvents = async (req, res) => {
    try {
        // Păstrăm logica ta de paginare!
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Numărăm totalul din baza de date
        const totalItems = await prisma.event.count();

        // Scoatem datele din DB (folosind skip și take pentru paginare)
        const data = await prisma.event.findMany({
            skip: skip,
            take: limit
        });

        const results = {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            data
        };

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la preluarea evenimentelor' });
    }
};

export const getEventStats = async (req, res) => {
    try {
        // Cerem bazei de date să numere pentru noi
        const total = await prisma.event.count();
        const accepted = await prisma.event.count({
            where: { status: 'accepted' }
        });

        res.status(200).json({ total, accepted });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la calcularea statisticilor' });
    }
};

export const createEvent = async (req, res) => {
    const { title, location, date } = req.body;

    // Păstrăm Validarea ta pe Server! E excelentă!
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (!location || typeof location !== 'string') {
        return res.status(400).json({ error: 'Location is required' });
    }

    try {
        // Inserăm în baza de date cu Prisma (ID-ul se generează automat de DB)
        const newEvent = await prisma.event.create({
            data: {
                title: title.trim(),
                location: location.trim(),
                date: date || new Date().toISOString().split('T')[0],
                status: 'pending'
            }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la crearea evenimentului' });
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificăm dacă există (similar cu ce făceai cu findIndex)
        const eventExists = await prisma.event.findUnique({ where: { id: id } });

        if (!eventExists) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Ștergem din baza de date
        await prisma.event.delete({
            where: { id: id }
        });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la ștergerea evenimentului' });
    }
};