import { MongoClient } from 'mongodb';

// Folosim adresa IP directă pentru a evita problemele de DNS
const uri = "mongodb://127.0.0.1:27017";

// Am eliminat 'keepAlive' care cauza eroarea. 
// Am păstrat doar opțiunile esențiale compatibile cu driverul nou.
const client = new MongoClient(uri, {
    connectTimeoutMS: 30000,
    family: 4 // Forțează IPv4 pentru stabilitate
});

let db;

export const connectMongo = async () => {
    try {
        await client.connect();
        db = client.db('CrewzyDb');
        console.log('🟢 Connected to LOCAL MongoDB (Chat DB)');
    } catch (error) {
        console.error('🔴 MongoDB connection error:', error);
        console.info('💡 Sfat: Asigură-te că ai instalat MongoDB Community Server și că serviciul este pornit.');
    }
};

export const getDb = () => db;