import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { faker } from '@faker-js/faker';
import cors from 'cors';
import { GraphQLError } from 'graphql';

// IMPORTĂM RUTELE REST PENTRU BRONZE CHALLENGE
import eventRoutes from './src/routes/events.js';

// --- BAZĂ DE DATE SIMULATĂ ÎN MEMORIE ---
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

  type Comment {
    id: ID!
    text: String!
    author: String!
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    time: String!
    location: String!
    color: String
    attendees: [Attendee] 
    comments: [Comment] 
  }

  type Query {
    getEvents(offset: Int, limit: Int): [Event]
    getEventStats: String
  }

  type Mutation {
    addEvent(title: String!, location: String!, date: String): Event
    addComment(eventId: ID!, text: String!, author: String!): Comment
  }
`;

const resolvers = {
    Query: {
        getEvents: (_, { offset = 0, limit = 10 }) => events.slice(offset, offset + limit),
        getEventStats: () => `Total Events: ${events.length}, Total Comments: ${comments.length}`
    },
    Event: {
        comments: (parent) => comments.filter(c => c.eventId === parent.id)
    },
    Mutation: {
        addEvent: (_, args) => {
            if (!args.title || args.title.trim() === '') {
                throw new GraphQLError('Event title cannot be empty', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            if (args.date) {
                const eventDate = new Date(args.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (eventDate < today) {
                    throw new GraphQLError('Event date cannot be in the past', { extensions: { code: 'BAD_USER_INPUT' } });
                }
            }

            const newEvent = {
                id: Date.now().toString(),
                ...args,
                time: args.time || '12:00 PM',
                status: 'accepted',
                attendees: []
            };

            events.unshift(newEvent);
            return newEvent;
        },
        addComment: (_, { eventId, text, author }) => {
            const newComment = { id: Date.now().toString(), eventId, text, author };
            comments.push(newComment);
            return newComment;
        }
    }
};

// --- INITIALIZARE SERVER ---
const app = express();
app.use(cors());
app.use(express.json()); // NECESAR PENTRU REST POST (BRONZE)

const httpServer = createServer(app);

// --- CONECTĂM RUTELE REST (BRONZE CHALLENGE) ---
app.use('/api/rest-events', eventRoutes);

// --- SILVER CHALLENGE: WEBSOCKETS ---
const io = new Server(httpServer, { cors: { origin: '*' } });
io.on('connection', (socket) => {
    console.log('⚡ Client connected via WebSockets');
});

// --- SILVER CHALLENGE: ENDPOINT-URI PENTRU ASYNC LOOP (FAKER) ---
app.get('/api/start-loop', (req, res) => {
    if (loopInterval) return res.send('Loop already running');

    loopInterval = setInterval(() => {
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
                { id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: randomStatus },
                { id: faker.string.uuid(), name: faker.person.fullName(), avatar: faker.image.avatar(), status: 'accepted' }
            ]
        };

        events.unshift(fakeEvent);
        io.emit('new_fake_event', fakeEvent);
        console.log(`🤖 Faker generated: ${fakeEvent.title} [${randomStatus}]`);
    }, 3000);

    res.send('Started Faker Loop!');
});

app.get('/api/stop-loop', (req, res) => {
    clearInterval(loopInterval);
    loopInterval = null;
    res.send('Stopped Faker Loop!');
});

// Pornim Apollo și Serverul
async function startServer() {
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    httpServer.listen(4000, '0.0.0.0', () => {
        console.log(`🚀 GraphQL Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
        console.log(`🥉 REST API ready at http://localhost:4000/api/rest-events`);
        console.log(`🔌 WebSockets ready on port 4000`);
    });
}

// SOLUȚIA PENTRU EROAREA DE JEST: Pornim GraphQL-ul și serverul web DOAR dacă nu suntem în modul test.
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

// EXPORTAM PENTRU TESTELE JEST (BRONZE)
export default app;