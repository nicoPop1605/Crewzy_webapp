// Importăm uneltele Jest specifice pentru ESM
import { jest } from '@jest/globals';
import mockPrismaClient from '../data/prismaMock.js';

// 1. Suprascriem Prisma folosind metoda specifică modulelor moderne (ESM)
jest.unstable_mockModule('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrismaClient)
}));

// 2. Importăm dinamic funcțiile din controller DOAR DUPĂ ce am făcut mock la baza de date
const { createEvent, getEvents, deleteEvent } = await import('./eventsController.js');

describe('Events Controller CRUD Operations', () => {

    let req, res;

    beforeEach(() => {
        req = { body: {}, query: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('CREATE Event', () => {
        it('should return 400 if title is missing', async () => {
            req.body = { location: 'Cluj' };
            await createEvent(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });

        it('should create an event successfully', async () => {
            req.body = { title: 'Party', location: 'Cluj', date: '2026-05-10' };

            const fakeEvent = { id: '123', title: 'Party', location: 'Cluj', status: 'pending' };
            mockPrismaClient.event.create.mockResolvedValue(fakeEvent);

            await createEvent(req, res);

            expect(mockPrismaClient.event.create).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(fakeEvent);
        });
    });

    describe('READ Events (Paginare)', () => {
        it('should return paginated events', async () => {
            req.query = { page: '1', limit: '2' };

            const fakeEventsList = [
                { id: '1', title: 'Ev1' },
                { id: '2', title: 'Ev2' }
            ];

            mockPrismaClient.event.count.mockResolvedValue(10);
            mockPrismaClient.event.findMany.mockResolvedValue(fakeEventsList);

            await getEvents(req, res);

            expect(mockPrismaClient.event.count).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.event.findMany).toHaveBeenCalledWith({ skip: 0, take: 2 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                totalItems: 10,
                totalPages: 5,
                currentPage: 1,
                data: fakeEventsList
            }));
        });
    });

    describe('DELETE Event', () => {
        it('should return 404 if event does not exist', async () => {
            req.params.id = 'invalid-id';

            mockPrismaClient.event.findUnique.mockResolvedValue(null);

            await deleteEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
        });

        it('should delete event successfully', async () => {
            req.params.id = 'valid-id';

            mockPrismaClient.event.findUnique.mockResolvedValue({ id: 'valid-id' });
            mockPrismaClient.event.delete.mockResolvedValue({ id: 'valid-id' });

            await deleteEvent(req, res);

            expect(mockPrismaClient.event.delete).toHaveBeenCalledWith({ where: { id: 'valid-id' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
        });
    });
});