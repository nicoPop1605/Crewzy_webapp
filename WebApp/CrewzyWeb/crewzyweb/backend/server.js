import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { faker } from '@faker-js/faker';
import cors from 'cors';
import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';

import eventRoutes from './src/routes/events.js';
import authRoutes from './src/routes/auth.js';
import statsRoutes from './src/routes/stats.js';
import monitorRoutes from './src/routes/monitor.js';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

let loopInterval = null;

const typeDefs = gql`
  type Attendee { id: ID!, name: String!, status: String! }
  type SuspiciousUser { id: ID, userId: String, reason: String, detectedAt: String }
  type Log { id: ID, action: String, details: String, timestamp: String }
  type Comment { id: ID!, text: String!, author: String! }
  type Event { 
    id: ID!, title: String!, date: String, time: String, location: String, 
    description: String, color: String, capacity: Int, attendees: [Attendee], 
    rsvpCount: Int, comments: [Comment] 
  }
  type UserDetails { 
    id: ID!
    name: String!
    email: String!
    avatar: String 
  }
  
  type FriendRequest { 
    id: ID!
    status: String!
    sender: UserDetails 
  }

  type Friend {
    id: ID!
    name: String!
    username: String
    avatar: String
    status: String
  }

  type Query {
    getEvents(scope: String, userId: String, offset: Int, limit: Int): [Event]
    getEventStats: String
    getLogs: [Log]
    getSuspiciousUsers: [SuspiciousUser]
    getPendingRequests(userId: String!): [FriendRequest]
    getFriends(userId: String!): [Friend] 
  }

  type Mutation {
    addAdminEvent(title: String!, date: String, time: String, location: String, description: String, capacity: Int, adminId: String!): Event
    addEvent(title: String!, date: String, time: String, location: String, description: String, userId: String!): Event
    deleteEvent(id: ID!): Boolean
    updateEvent(id: ID!, title: String!, date: String, time: String, location: String, description: String): Event
    updateRsvp(eventId: ID!, userId: String!, status: String!): Boolean
    joinEvent(eventId: ID!, userId: String!): Boolean
    leaveEvent(eventId: ID!, userId: String!): Boolean
    addComment(eventId: ID!, text: String!, author: String!): Comment
    addFriend(userId: String!, friendQuery: String!): Boolean
    acceptFriend(requestId: String!): Boolean
    rejectFriend(requestId: String!): Boolean
    removeFriend(userId: String!, friendId: String!): Boolean
  }
`;

const resolvers = {
    Query: {
        getEvents: async (_, { scope, userId, offset, limit }) => {
            let whereClause = {};

            if (scope === 'MINE') {
                whereClause = { ownerId: userId, type: 'PERSONAL' };
            }
            else if (scope === 'DISCOVER') {
                whereClause = { type: 'COMPANY' };
            }
            else if (scope === 'ADMIN') {
                whereClause = { ownerId: userId, type: 'COMPANY' };
            }
            const dbEvents = await prisma.event.findMany({
                where: whereClause,
                skip: offset,
                take: limit,
                orderBy: { date: 'desc' },
                include: {
                    rsvps: { include: { user: true } },
                    comments: true
                }
            });
            return dbEvents.map(evt => ({
                ...evt,
                id: evt.id.toString(),
                rsvpCount: evt.rsvps.length,
                attendees: evt.rsvps.map(r => ({
                    id: r.user.id, name: r.user.name, status: r.status, avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100'
                })),
                comments: evt.comments
            }));
        },
        getEventStats: async () => `Total Events: ${await prisma.event.count()}`,
        getLogs: async () => (await prisma.log.findMany({ take: 50, orderBy: { timestamp: 'desc' } })).map(l => ({ ...l, id: l.id.toString() })),
        getSuspiciousUsers: async () => (await prisma.observationList.findMany({ orderBy: { detectedAt: 'desc' } })).map(s => ({ ...s, id: s.id.toString() })),
        getPendingRequests: async (_, { userId }) => {
            const requests = await prisma.friendship.findMany({
                where: { friendId: userId, status: "PENDING" },
                include: { sender: true }
            });

            return requests.map(req => ({
                id: req.id,
                status: req.status,
                sender: {
                    id: req.sender.id,
                    name: req.sender.name,
                    email: req.sender.email,
                    avatar: req.sender.avatar || 'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?w=400'
                }
            }));
        },

        getFriends: async (_, { userId }) => {
            const friendships = await prisma.friendship.findMany({
                where: {
                    OR: [
                        { userId: userId },
                        { friendId: userId }
                    ],
                    status: "ACCEPTED"
                }
            });

            const friendIds = friendships.map(f => f.userId === userId ? f.friendId : f.userId);

            if (friendIds.length === 0) return [];

            const friends = await prisma.user.findMany({
                where: { id: { in: friendIds } }
            });

            return friends.map(user => ({
                id: user.id,
                name: user.name,
                username: user.email ? user.email.split('@')[0].toLowerCase() : 'user',
                avatar: user.avatar || 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400',
                status: 'online'
            }));
        }
    },
    Mutation: {
        addEvent: async (_, args) => {
            return await prisma.event.create({
                data: { ...args, ownerId: args.userId, type: 'PERSONAL' }
            });
        },
        addAdminEvent: async (_, { adminId, ...args }) => {
            return await prisma.event.create({
                data: { ...args, ownerId: adminId, type: 'COMPANY' }
            });
        },
        deleteEvent: async (_, { id }) => { await prisma.event.delete({ where: { id: parseInt(id) } }); return true; },
        updateEvent: async (_, args) => await prisma.event.update({ where: { id: parseInt(args.id) }, data: args }),
        joinEvent: async (_, { eventId, userId }) => { await prisma.rSVP.create({ data: { eventId: parseInt(eventId), userId, status: 'going' } }); return true; },
        leaveEvent: async (_, { eventId, userId }) => {
            await prisma.rSVP.deleteMany({ where: { eventId: parseInt(eventId), userId } });
            return true;
        },
        updateRsvp: async (_, { eventId, userId, status }) => {
            await prisma.rSVP.updateMany({ where: { eventId: parseInt(eventId), userId }, data: { status } });
            return true;
        },
        addComment: async (_, { eventId, text, author }) => {
            return await prisma.comment.create({
                data: { text, author, eventId: parseInt(eventId) }
            });
        },
        addFriend: async (_, { userId, friendQuery }) => {
            const targetUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: friendQuery },
                        { name: friendQuery }
                    ]
                }
            });

            if (!targetUser) {
                throw new Error("Utilizatorul nu există în baza de date!");
            }
            if (targetUser.id === userId) {
                throw new Error("Nu te poți adăuga pe tine însuți!");
            }

            const existingFriendship = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { userId: userId, friendId: targetUser.id },
                        { userId: targetUser.id, friendId: userId }
                    ]
                }
            });

            if (existingFriendship) {
                throw new Error("Există deja o cerere de prietenie sau sunteți deja prieteni!");
            }

            await prisma.friendship.create({
                data: {
                    userId: userId,
                    friendId: targetUser.id,
                    status: "PENDING"
                }
            });

            return true;
        },

        acceptFriend: async (_, { requestId }) => {
            await prisma.friendship.update({
                where: { id: requestId },
                data: { status: "ACCEPTED" }
            });
            return true;
        },

        rejectFriend: async (_, { requestId }) => {
            await prisma.friendship.delete({
                where: { id: requestId }
            });
            return true;
        },

        removeFriend: async (_, { userId, friendId }) => {
            await prisma.friendship.deleteMany({
                where: {
                    OR: [
                        { userId: userId, friendId: friendId },
                        { userId: friendId, friendId: userId }
                    ]
                }
            });
            return true;
        }
    }
};

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use('/api/rest-events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/monitor', monitorRoutes);

io.on('connection', (socket) => {
    socket.on('send_message', async (data) => {
        await prisma.message.create({ data: { userId: data.userId, userName: data.userName, text: data.text } });
        io.emit('receive_message', data);
    });
});

app.get('/api/start-loop', (req, res) => {
    if (loopInterval) return res.send('Running');
    loopInterval = setInterval(async () => {
        const fake = await prisma.event.create({
            data: { title: faker.company.catchPhrase(), date: new Date().toISOString(), location: 'Bot Location' }
        });
        io.emit('new_fake_event', fake);
    }, 3000);
    res.send('Started');
});

async function startServer() {
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    httpServer.listen(4000, () => console.log('🚀 Server port 4000'));
}

startServer();