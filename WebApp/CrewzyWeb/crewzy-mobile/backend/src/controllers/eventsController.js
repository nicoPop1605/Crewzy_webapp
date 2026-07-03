import { db } from '../data/memoryStore.js';
import crypto from 'crypto'; // Pentru generare ID-uri unice

export const getEvents = (req, res) => {
    // Server-Side Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    results.totalItems = db.events.length;
    results.totalPages = Math.ceil(db.events.length / limit);
    results.currentPage = page;
    results.data = db.events.slice(startIndex, endIndex);

    res.status(200).json(results);
};

export const getEventStats = (req, res) => {
    const total = db.events.length;
    const accepted = db.events.filter(e => e.status === 'accepted').length;
    res.status(200).json({ total, accepted });
};

export const createEvent = (req, res) => {
    const { title, location, date } = req.body;

    // Server-Side Validation (MANDATORY)
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (!location || typeof location !== 'string') {
        return res.status(400).json({ error: 'Location is required' });
    }

    const newEvent = {
        id: crypto.randomUUID(),
        title: title.trim(),
        location: location.trim(),
        date: date || new Date().toISOString().split('T')[0],
        status: 'pending'
    };

    db.events.push(newEvent);
    res.status(201).json(newEvent);
};

export const deleteEvent = (req, res) => {
    const { id } = req.params;
    const eventIndex = db.events.findIndex(e => e.id === id);

    if (eventIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
    }

    db.events.splice(eventIndex, 1);
    res.status(200).json({ message: 'Event deleted successfully' });
};