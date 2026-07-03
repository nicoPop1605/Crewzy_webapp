import request from 'supertest';
import app from '../server.js';
import { db } from '../src/data/memoryStore.js';

describe('Events REST API CRUD Operations', () => {

    beforeEach(() => {
        db.events = [
            { id: '1', title: 'Test Event 1', location: 'Room 1', date: '2026-03-20', status: 'accepted' }
        ];
    });

    test('GET /api/rest-events should return paginated events', async () => {
        const res = await request(app).get('/api/rest-events?page=1&limit=10');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalItems).toBe(1);
    });

    // TEST NOU PENTRU 100% COVERAGE (Acoperă funcția getEventStats)
    test('GET /api/rest-events/stats should return event statistics', async () => {
        const res = await request(app).get('/api/rest-events/stats');
        expect(res.statusCode).toBe(200);
        expect(res.body.total).toBe(1);
        expect(res.body.accepted).toBe(1);
    });

    test('POST /api/rest-events should create a valid event', async () => {
        const newEvent = { title: 'New Party', location: 'Club', date: '2026-03-25' };
        const res = await request(app).post('/api/rest-events').send(newEvent);
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('New Party');
    });

    test('POST /api/rest-events should FAIL validation if title is missing', async () => {
        const invalidEvent = { location: 'Club' };
        const res = await request(app).post('/api/rest-events').send(invalidEvent);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Title is required');
    });

    // TEST NOU PENTRU 100% COVERAGE (Acoperă validarea locației)
    test('POST /api/rest-events should FAIL validation if location is missing', async () => {
        const invalidEvent = { title: 'Party' };
        const res = await request(app).post('/api/rest-events').send(invalidEvent);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Location is required');
    });

    test('DELETE /api/rest-events/:id should remove an event', async () => {
        const res = await request(app).delete('/api/rest-events/1');
        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/rest-events/:id should return 404 for invalid ID', async () => {
        const res = await request(app).delete('/api/rest-events/999');
        expect(res.statusCode).toBe(404);
    });

    // Acoperă Liniile 6-7 (Branch): Testăm paginarea fără parametri în URL
    test('GET /api/rest-events should use default pagination if no query params provided', async () => {
        const res = await request(app).get('/api/rest-events');
        expect(res.statusCode).toBe(200);
        expect(res.body.currentPage).toBe(1); // Verificăm că a pus automat pagina 1
    });

    // Acoperă Linia 41 (Branch): Testăm crearea fără dată
    test('POST /api/rest-events should use current date if date is missing', async () => {
        const newEvent = { title: 'Surprise Party', location: 'Office' }; // Fără dată
        const res = await request(app).post('/api/rest-events').send(newEvent);
        expect(res.statusCode).toBe(201);
        expect(res.body.date).toBeDefined(); // Verificăm că a generat automat data de azi
    });
});