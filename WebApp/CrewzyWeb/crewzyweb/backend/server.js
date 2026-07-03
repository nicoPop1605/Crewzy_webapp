import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { faker } from '@faker-js/faker';
import cors from 'cors';
import { GraphQLError } from 'graphql';
import { connectMongo, getDb } from './src/data/mongoClient.js';

import eventRoutes from './src/routes/events.js';
import authRoutes from './src/routes/auth.js';
import statsRoutes from './src/routes/stats.js';
import monitorRoutes from './src/routes/monitor.js';

let events = [];
let comments = [];
let loopInterval = null;

const typeDefs = gql`
  type Attendee { id: ID!, name: String!, avatar: String!, status: String! }
  type SuspiciousUser { id: ID, userId: String, reason: String, detectedAt: String }
  type Log { id: ID, action: String, details: String, timestamp: String }
  type Comment { id: ID!, text: String!, author: String! }
  type Event { id: ID!, title: String!, date: String, time: String, location: String, description: String, color: String, attendees: [Attendee], comments: [Comment] }

  type Query {
    getEvents(offset: Int, limit: Int): [Event]
    getEventStats: String
    getLogs: [Log]  
    getSuspiciousUsers: [SuspiciousUser]
  }

  type Mutation {
    addEvent(title: String!, date: String, time: String, location: String, description: String): Event
    deleteEvent(id: ID!): Boolean  
    updateEvent(id: ID!, title: String!, date: String, time: String, location: String, description: String): Event
    updateRsvp(eventId: ID!, status: String!): Boolean
    joinEvent(eventId: ID!): Boolean
    leaveEvent(eventId: ID!): Boolean
    addComment(eventId: ID!, text: String!, author: String!): Comment
  }
`;

const resolvers = {
    Query: {
        getEvents: async (_, { offset = 0, limit = 10 }) => {
            const db = getDb();
            if (!db) return [];
            try { return await db.collection('events').find().sort({ createdAt: -1 }).skip(offset).limit(limit).toArray(); }
            catch (error) { return []; }
        },
        getEventStats: async () => {
            const db = getDb();
            if (!db) return "DB Offline";
            const total = await db.collection('events').countDocuments();
            return `Total Events in DB: ${total}`;
        },
        getLogs: async () => {
            const db = getDb();
            if (!db) return [];
            try {
                const logs = await db.collection('logs').find().sort({ timestamp: -1 }).limit(50).toArray();
                return logs.map(log => ({
                    id: log._id.toString(), action: log.action, details: log.details,
                    timestamp: log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'
                }));
            } catch (error) { return []; }
        },
        getSuspiciousUsers: async () => {
            const db = getDb();
            if (!db) return [];
            try {
                const suspects = await db.collection('observation_list').find().sort({ detectedAt: -1 }).toArray();
                return suspects.map(s => ({
                    id: s._id.toString(), userId: s.userId, reason: s.reason,
                    detectedAt: s.detectedAt ? new Date(s.detectedAt).toLocaleString() : 'N/A'
                }));
            } catch (error) { return []; }
        }
    },
    Event: {
        comments: (parent) => comments.filter(c => c.eventId === parent.id)
    },
    Mutation: {
        addEvent: async (_, args) => {
            if (!args.title || args.title.trim() === '') throw new GraphQLError('Title empty', { extensions: { code: 'BAD_USER_INPUT' } });
            const db = getDb();
            const newEvent = { id: Date.now().toString(), ...args, time: args.time || '12:00 PM', status: 'accepted', attendees: [{ id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' }], createdAt: new Date() };
            if (db) {
                try {
                    await db.collection('events').insertOne(newEvent);
                    await db.collection('logs').insertOne({ action: "CREATE_EVENT", details: `S-a creat evenimentul: ${args.title}`, timestamp: new Date() });
                } catch (error) { }
            }
            return newEvent;
        },
        deleteEvent: async (_, { id }) => {
            const db = getDb();
            if (!db) return false;
            try {
                await db.collection('events').deleteOne({ id: id });
                await db.collection('logs').insertOne({ action: "DELETE_EVENT", details: `S-a șters evenimentul: ${id}`, timestamp: new Date() });
                return true;
            } catch (error) { return false; }
        },
        updateEvent: async (_, args) => {
            const db = getDb();
            if (!db) return null;
            try {
                const { id, ...updateData } = args;
                await db.collection('events').updateOne({ id: id }, { $set: updateData });
                await db.collection('logs').insertOne({ action: "UPDATE_EVENT", details: `S-a modificat: ${id}`, timestamp: new Date() });
                return await db.collection('events').findOne({ id: id });
            } catch (error) { return null; }
        },
        updateRsvp: async (_, { eventId, status }) => {
            const db = getDb();
            if (!db) return false;
            try {
                await db.collection('events').updateOne({ id: eventId, "attendees.id": "me" }, { $set: { "attendees.$.status": status } });
                return true;
            } catch (error) { return false; }
        },
        joinEvent: async (_, { eventId }) => {
            const db = getDb();
            if (!db) return false;
            try {
                const meUser = { id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' };
                await db.collection('events').updateOne({ id: eventId }, { $push: { attendees: meUser } });
                return true;
            } catch (error) { return false; }
        },
        leaveEvent: async (_, { eventId }) => {
            const db = getDb();
            if (!db) return false;
            try {
                await db.collection('events').updateOne({ id: eventId }, { $pull: { attendees: { id: 'me' } } });
                return true;
            } catch (error) { return false; }
        },
        addComment: (_, { eventId, text, author }) => {
            const newComment = { id: Date.now().toString(), eventId, text, author };
            comments.push(newComment);
            return newComment;
        }
    }
};

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

app.use('/api/rest-events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/monitor', monitorRoutes);

// connectMongo(); // Lasă linia asta comentată pe Render dacă nu folosești MongoDB acum

const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', async (socket) => {
    console.log(`🔌 Client connected via WebSockets: ${socket.id}`);
    const db = getDb();
    if (db) {
        try {
            const messages = await db.collection('messages').find().sort({ timestamp: 1 }).limit(50).toArray();
            socket.emit('chat_history', messages);
        } catch (error) { }
    }

    socket.on('send_message', async (data) => {
        const { userId, userName, text } = data;
        const messageDoc = { userId, userName, text, timestamp: new Date().toISOString() };
        if (db) {
            try { await db.collection('messages').insertOne(messageDoc); } catch (error) { }
        }
        io.emit('receive_message', messageDoc);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

app.get('/api/start-loop', (req, res) => {
    if (loopInterval) return res.send('Loop already running');
    loopInterval = setInterval(async () => {
        const randomStatus = ['accepted', 'pending', 'declined'][Math.floor(Math.random() * 3)];
        const fakeEvent = {
            id: faker.string.uuid(), title: faker.company.catchPhrase(), date: `2026-03-${Math.floor(Math.random() * 10 + 20)}`,
            time: `${Math.floor(Math.random() * 12 + 1)}:00 PM`, location: faker.location.streetAddress(), locationType: 'text',
            visibility: 'all-friends', description: faker.lorem.sentence(), color: 'bg-blue-500',
            attendees: [{ id: 'bot_spammer_99', name: 'Evil Spammer Bot', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: randomStatus }]
        };

        events.unshift(fakeEvent);
        io.emit('new_fake_event', fakeEvent);

        const db = getDb();
        if (db) {
            try {
                await db.collection('events').insertOne(fakeEvent);
                await db.collection('logs').insertOne({ action: "CREATE_EVENT", details: `bot_spammer_99:grp_1[BOT]:CREATE_EVENT - Generated: ${fakeEvent.title}`, timestamp: new Date() });
                const oneMinuteAgo = new Date(Date.now() - 60000);
                const recentBotCreations = await db.collection('logs').countDocuments({ action: "CREATE_EVENT", details: { $regex: "bot_spammer_99" }, timestamp: { $gte: oneMinuteAgo } });
                if (recentBotCreations >= 3) {
                    const isAlreadyFlagged = await db.collection('observation_list').findOne({ userId: "bot_spammer_99" });
                    if (!isAlreadyFlagged) {
                        await db.collection('observation_list').insertOne({ userId: "bot_spammer_99", reason: "BOT DETECTION: Flooding", detectedAt: new Date() });
                    }
                }
            } catch (err) { }
        }
    }, 3000);
    res.send('Started Faker Loop!');
});

app.get('/api/stop-loop', (req, res) => {
    clearInterval(loopInterval);
    loopInterval = null;
    res.send('Stopped Faker Loop!');
});

async function startServer() {
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running dynamically on port ${PORT}`);
        console.log(`📡 GraphQL API ready at path: ${apolloServer.graphqlPath}`);
        console.log(`🔌 WebSockets connection available`);
    });
}

if (process.env.NODE_ENV !== 'test') { startServer(); }
export default app;