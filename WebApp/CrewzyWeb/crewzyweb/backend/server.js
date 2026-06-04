



import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http'; // Schimbat aici
import { Server } from 'socket.io';
import { faker } from '@faker-js/faker';
import cors from 'cors';
import { GraphQLError } from 'graphql';
import { connectMongo, getDb } from './src/data/mongoClient.js';

// IMPORTĂM RUTELE REST PENTRU BRONZE & SILVER CHALLENGE
import eventRoutes from './src/routes/events.js';
import authRoutes from './src/routes/auth.js';
import statsRoutes from './src/routes/stats.js';
import monitorRoutes from './src/routes/monitor.js';

// --- BAZĂ DE DATE SIMULATĂ ÎN MEMORIE (Pentru GraphQL / Faker) ---
let events = [];
let comments = [];
let loopInterval = null;

// --- GOLD CHALLENGE: GRAHQL SCHEMA & RESOLVERS ---
const typeDefs = gql`
  type Attendee {
    id: ID!
    name: String!
    avatar: String!
    status: String!
  }

  type SuspiciousUser {
    id: ID
    userId: String
    reason: String
    detectedAt: String
  }

  type Log {
    id: ID
    action: String
    details: String
    timestamp: String
  }

  type Comment {
    id: ID!
    text: String!
    author: String!
  }

  type Event {
    id: ID!
    title: String!
    date: String
    time: String
    location: String
    description: String
    color: String
    attendees: [Attendee] 
    comments: [Comment] 
  }

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

// --- STEALTH DETECT MECHANISM & STRICT LOGGING ---
async function logAndMonitor(db, action, details) {
    const userId = "user_me_123";
    const groupId = "grp_1";
    const role = "USER";
    const timestamp = new Date();

    // 1. FORMATUL STRICT CERUT
    const logString = `${userId}:${groupId}[${role}]:${action} - ${details}:${timestamp.toISOString()}`;

    // Salvăm log-ul curent
    await db.collection('logs').insertOne({
        action: action,
        details: logString,
        timestamp: timestamp
    });

    // 2. STEALTH BEHAVIOUR: EVENT SPAMMING / BOT DETECTION
    // Verificăm dacă utilizatorul abuzează de sistem prin crearea prea rapidă de evenimente
    if (action === "CREATE_EVENT") {
        const oneMinuteAgo = new Date(Date.now() - 60000); // Acum 1 minut

        // Numărăm câte evenimente a creat în ultimul minut
        const recentCreations = await db.collection('logs').countDocuments({
            action: "CREATE_EVENT",
            // Într-o aplicație reală am filtra și după userId, aici folosim regex pe detalii:
            "details": { $regex: userId },
            timestamp: { $gte: oneMinuteAgo }
        });

        console.log(`[STEALTH] Utilizatorul a creat ${recentCreations} evenimente în ultimele 60s.`);

        // Dacă creează 3 sau mai multe evenimente într-un minut, e suspect de SPAM/BOT
        if (recentCreations >= 3) {
            const isAlreadyFlagged = await db.collection('observation_list').findOne({ userId });

            if (!isAlreadyFlagged) {
                await db.collection('observation_list').insertOne({
                    userId: userId,
                    reason: "BOT/SPAM DETECTION: Malevolent flooding of the calendar (3+ events in under 60s).",
                    detectedAt: new Date()
                });
                console.log(`🚨 [SECURITY ALARM] Utilizatorul ${userId} a fost pus sub observație pentru SPAM!`);
            } else {
                console.log(`ℹ️ [INFO] Utilizatorul ${userId} este deja blocat în Observation List.`);
            }
        }
    }
}

const resolvers = {
    Query: {
        // GOLD: Preluăm evenimentele din MongoDB cu Offset și Limit pentru Infinite Scroll
        getEvents: async (_, { offset = 0, limit = 10 }) => {
            const db = getDb();
            if (!db) return [];

            try {
                // Returnăm evenimentele sortate de la cel mai nou la cel mai vechi
                return await db.collection('events')
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(offset)
                    .limit(limit)
                    .toArray();
            } catch (error) {
                console.error("🔴 Eroare la citirea evenimentelor:", error);
                return [];
            }
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
                // Le luăm din MongoDB, sortate de la cel mai nou la cel mai vechi (-1)
                const logs = await db.collection('logs').find().sort({ timestamp: -1 }).limit(50).toArray();

                // Le mapăm ca să le înțeleagă GraphQL
                return logs.map(log => ({
                    id: log._id.toString(),
                    action: log.action,
                    details: log.details,
                    timestamp: log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'
                }));
            } catch (error) {
                console.error("🔴 Eroare la citirea logurilor:", error);
                return [];
            }
        },
        getSuspiciousUsers: async () => {
            const db = getDb();
            if (!db) return [];
            try {
                const suspects = await db.collection('observation_list').find().sort({ detectedAt: -1 }).toArray();
                return suspects.map(s => ({
                    id: s._id.toString(),
                    userId: s.userId,
                    reason: s.reason,
                    detectedAt: s.detectedAt ? new Date(s.detectedAt).toLocaleString() : 'N/A'
                }));
            } catch (error) { return []; }
        }
    },
    

    Event: {
        // Rămâne în memorie pentru moment, sau poate fi scos dacă nu folosești comments
        comments: (parent) => comments.filter(c => c.eventId === parent.id)
    },
    Mutation: {
        addEvent: async (_, args) => {
            // 1. Validări
            if (!args.title || args.title.trim() === '') {
                throw new GraphQLError('Event title cannot be empty', { extensions: { code: 'BAD_USER_INPUT' } });
            }

            const db = getDb();

            // 2. Crearea obiectului evenimentului
            const newEvent = {
                id: Date.now().toString(), // Păstrăm id-ul ca string pentru frontend
                ...args,
                time: args.time || '12:00 PM',
                status: 'accepted',
                attendees: [
                    { id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' }
                ],
                createdAt: new Date()
            };

            // 3. Salvarea în MongoDB și sistemul de Logging (Audit)
            if (db) {
                try {
                    // Salvăm evenimentul
                    await db.collection('events').insertOne(newEvent);

                    // GOLD: Salvăm un LOG de sistem
                    await db.collection('logs').insertOne({
                        action: "CREATE_EVENT",
                        details: `S-a creat evenimentul: ${args.title} la locația ${args.location}`,
                        timestamp: new Date()
                    });
                } catch (error) {
                    console.error("🔴 Eroare la salvarea în DB:", error);
                }
            }

            return newEvent;
        },
        deleteEvent: async (_, { id }) => {
            const db = getDb();
            if (!db) return false;
            try {
                // Ștergem evenimentul după id-ul lui unic
                await db.collection('events').deleteOne({ id: id });

                // Salvăm un log ca să știm cine/ce a șters
                await db.collection('logs').insertOne({
                    action: "DELETE_EVENT",
                    details: `S-a șters evenimentul cu ID-ul: ${id}`,
                    timestamp: new Date()
                });
                return true;
            } catch (error) {
                console.error("🔴 Eroare la ștergerea din DB:", error);
                return false;
            }
        },
        updateEvent: async (_, args) => {
            const db = getDb();
            if (!db) return null;

            try {
                // Extragem id-ul și restul datelor de actualizat
                const { id, ...updateData } = args;

                await db.collection('events').updateOne(
                    { id: id },
                    { $set: updateData }
                );

                await db.collection('logs').insertOne({
                    action: "UPDATE_EVENT",
                    details: `S-a modificat evenimentul cu ID-ul: ${id}`,
                    timestamp: new Date()
                });

                // Căutăm și returnăm evenimentul actualizat
                return await db.collection('events').findOne({ id: id });
            } catch (error) {
                console.error("🔴 Eroare la update în DB:", error);
                return null;
            }
        },

        updateRsvp: async (_, { eventId, status }) => {
            const db = getDb();
            if (!db) return false;

            try {
                // În acest exemplu presupunem că 'me' este utilizatorul curent. 
                // Actualizăm statusul din array-ul de attendees.
                // Notă: E o variantă simplificată. Pentru array-uri complexe se folosește arrayFilters.
                await db.collection('events').updateOne(
                    { id: eventId, "attendees.id": "me" },
                    { $set: { "attendees.$.status": status } }
                );
                return true;
            } catch (error) {
                console.error("🔴 Eroare la update RSVP:", error);
                return false;
            }
        },
        joinEvent: async (_, { eventId }) => {
            const db = getDb();
            if (!db) return false;

            try {
                // Obiectul utilizatorului tău (hardcodat pentru 'me')
                const meUser = {
                    id: 'me',
                    name: 'Me',
                    avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100',
                    status: 'accepted'
                };

                // $push adaugă acest obiect în array-ul 'attendees'
                await db.collection('events').updateOne(
                    { id: eventId },
                    { $push: { attendees: meUser } }
                );
                return true;
            } catch (error) {
                console.error("🔴 Eroare la Join Event:", error);
                return false;
            }
        },

        leaveEvent: async (_, { eventId }) => {
            const db = getDb();
            if (!db) return false;

            try {
                // $pull caută în array-ul 'attendees' elementul care are id-ul 'me' și îl șterge
                await db.collection('events').updateOne(
                    { id: eventId },
                    { $pull: { attendees: { id: 'me' } } }
                );
                return true;
            } catch (error) {
                console.error("🔴 Eroare la Leave Event:", error);
                return false;
            }
        },
        addComment: (_, { eventId, text, author }) => {
            const newComment = { id: Date.now().toString(), eventId, text, author };
            comments.push(newComment);
            return newComment;
        }
    }
};

// --- INITIALIZARE SERVER ---
// --- INITIALIZARE SERVER ---
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/monitor', monitorRoutes);

// Creăm server HTTP simplu (Render adaugă HTTPS automat)
const httpServer = createServer(app);

// --- CONECTĂM RUTELE REST ---
app.use('/api/rest-events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

// Comentăm TEMPORAR MongoDB pentru a permite deploy-ul inițial
// connectMongo();

// Socket.io se conectează la noul httpServer
// --- SILVER CHALLENGE: WEBSOCKETS & NoSQL CHAT ---
// Temporarily suspended MongoDB connection for initial deployment
// connectMongo();

// Connect Socket.io to the new httpServer
const io = new Server(httpServer, { cors: { origin: '*' } });


io.on('connection', async (socket) => {
    console.log(`🔌 Client connected via WebSockets: ${socket.id}`);

    const db = getDb();

    // 1. Când cineva se conectează, îi trimitem istoricul mesajelor din MongoDB
    if (db) {
        try {
            const messages = await db.collection('messages')
                .find()
                .sort({ timestamp: 1 })
                .limit(50)
                .toArray();
            socket.emit('chat_history', messages);
        } catch (error) {
            console.error('🔴 Error fetching chat history:', error);
        }
    }

    // 2. Când utilizatorul trimite un mesaj nou pe chat
    socket.on('send_message', async (data) => {
        const { userId, userName, text } = data;

        const messageDoc = {
            userId,
            userName,
            text,
            timestamp: new Date().toISOString()
        };

        // Salvăm mesajul în baza de date NoSQL
        if (db) {
            try {
                await db.collection('messages').insertOne(messageDoc);
            } catch (error) {
                console.error('🔴 Error saving message:', error);
            }
        }

        // Trimitem mesajul către toți utilizatorii conectați (inclusiv cel care l-a trimis)
        io.emit('receive_message', messageDoc);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// --- ENDPOINT-URI PENTRU ASYNC LOOP (FAKER) ---
app.get('/api/start-loop', (req, res) => {
    if (loopInterval) return res.send('Loop already running');

    // Am adăugat "async" aici pentru a putea folosi baza de date
    loopInterval = setInterval(async () => {
        const randomStatus = ['accepted', 'pending', 'declined'][Math.floor(Math.random() * 3)];
        const fakeEvent = {
            id: faker.string.uuid(),
            title: faker.company.catchPhrase(),
            date: `2026-03-${Math.floor(Math.random() * 10 + 20)}`,
            time: `${Math.floor(Math.random() * 12 + 1)}:00 PM`,
            location: faker.location.streetAddress(),
            locationType: 'text',
            visibility: 'all-friends',
            description: faker.lorem.sentence(),
            color: 'bg-blue-500',
            attendees: [
                { id: 'bot_spammer_99', name: 'Evil Spammer Bot', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: randomStatus }
            ]
        };

        // 1. Logica veche: Trimitem prin WebSocket pe ecran
        events.unshift(fakeEvent);
        io.emit('new_fake_event', fakeEvent);
        console.log(`🤖 Faker generated: ${fakeEvent.title}`);

        // 2. LOGICA NOUĂ: Conectăm Bot-ul la Baza de Date și la Sistemul de Securitate!
        const db = getDb();
        if (db) {
            try {
                // Salvăm evenimentul bot-ului în DB
                await db.collection('events').insertOne(fakeEvent);

                // Forțăm log-ul să creadă că a fost creat de Bot (folosim un userId special în detalii)
                const botLogDetails = `bot_spammer_99:grp_1[BOT]:CREATE_EVENT - Generated fake event: ${fakeEvent.title}`;

                // Înregistrăm acțiunea
                await db.collection('logs').insertOne({
                    action: "CREATE_EVENT",
                    details: botLogDetails,
                    timestamp: new Date()
                });

                // Verificăm dacă Bot-ul face SPAM (exact cum verificăm și un user real)
                const oneMinuteAgo = new Date(Date.now() - 60000);
                const recentBotCreations = await db.collection('logs').countDocuments({
                    action: "CREATE_EVENT",
                    details: { $regex: "bot_spammer_99" }, // căutăm după ID-ul botului
                    timestamp: { $gte: oneMinuteAgo }
                });

                if (recentBotCreations >= 3) {
                    const isAlreadyFlagged = await db.collection('observation_list').findOne({ userId: "bot_spammer_99" });
                    if (!isAlreadyFlagged) {
                        await db.collection('observation_list').insertOne({
                            userId: "bot_spammer_99",
                            reason: "BOT DETECTION: Automated script flooding the calendar system.",
                            detectedAt: new Date()
                        });
                        console.log(`🚨 [SECURITY ALARM] Bot-ul spammer a fost prins și neutralizat!`);

                        // OPȚIONAL: Putem chiar să oprim bot-ul automat când e prins!
                        // clearInterval(loopInterval);
                        // loopInterval = null;
                    }
                }
            } catch (err) {
                console.error("Eroare la DB in Faker:", err);
            }
        }
    }, 3000); // Rulează la fiecare 3 secunde

    res.send('Started Faker Loop!');
});
app.get('/api/stop-loop', (req, res) => {
    clearInterval(loopInterval);
    loopInterval = null;
    res.send('Stopped Faker Loop!');
});

// --- PORNIM SERVERUL ---
async function startServer() {
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    // Preluăm portul setat de Render sau folosim 4000 local
    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running dynamically on port ${PORT}`);
        console.log(`📡 GraphQL API ready at path: ${apolloServer.graphqlPath}`);
        console.log(`🔌 WebSockets connection available`);
    });
}

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;