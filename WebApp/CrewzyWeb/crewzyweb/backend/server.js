import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { faker } from '@faker-js/faker';
import cors from 'cors';

// --- BAZĂ DE DATE SIMULATĂ ÎN MEMORIE ---
let events = [];
let comments = []; // GOLD: Relație 1-to-Many (1 Event are mai multe Comments)
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
    attendees: [Attendee] # <-- Added this!
    comments: [Comment] 
  }

  type Query {
    getEvents(offset: Int, limit: Int): [Event]
    getEventStats: String
  }

  type Mutation {
    addEvent(title: String!, location: String!): Event
    addComment(eventId: ID!, text: String!, author: String!): Comment
  }
`;

const resolvers = {
    Query: {
        getEvents: (_, { offset = 0, limit = 10 }) => events.slice(offset, offset + limit),
        getEventStats: () => `Total Events: ${events.length}, Total Comments: ${comments.length}`
    },
    Event: {
        // Leagă comentariile de eveniment (1-to-Many)
        comments: (parent) => comments.filter(c => c.eventId === parent.id)
    },
    Mutation: {
        addEvent: (_, args) => {
            const newEvent = { id: Date.now().toString(), ...args, date: '2026-03-25', time: '12:00 PM', status: 'accepted' };
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
const httpServer = createServer(app);

// --- SILVER CHALLENGE: WEBSOCKETS ---
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('⚡ Client connected via WebSockets');
});

// --- SILVER CHALLENGE: ENDPOINT-URI PENTRU ASYNC LOOP (FAKER) ---
app.get('/api/start-loop', (req, res) => {
    if (loopInterval) return res.send('Loop already running');

    loopInterval = setInterval(() => {
        // Randomly decide a status for our fake attendee
        const randomStatus = ['accepted', 'pending', 'declined'][Math.floor(Math.random() * 3)];

        // Generate an event that perfectly matches the frontend's MyEvent interface
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
                // 1. Add YOURSELF with the random status so you can update it in the UI
                {
                    id: 'me',
                    name: 'Me',
                    avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100',
                    status: randomStatus
                },
                // 2. Add a random fake friend just to populate the event
                {
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    avatar: faker.image.avatar(),
                    status: 'accepted'
                }
            ]
        };

        events.unshift(fakeEvent); // Add to server "database"

        // Broadcast to client
        io.emit('new_fake_event', fakeEvent);
        console.log(`🤖 Faker generated: ${fakeEvent.title} [${randomStatus}]`);

    }, 3000); // Changed to 3 seconds so you can see the updates faster!

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

    httpServer.listen(4000, () => {
        console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
        console.log(`🔌 WebSockets ready on port 4000`);
    });
}
startServer();