import express from 'express';
import { getEvents, createEvent, deleteEvent, getEventStats } from '../controllers/eventsController.js';

const router = express.Router();

// Endpoint-urile sunt separate de logica de implementare (MANDATORY)
router.get('/', getEvents);
router.get('/stats', getEventStats);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

export default router;