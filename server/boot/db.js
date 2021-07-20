import mongoose from 'mongoose';

const db = mongoose.connect(process.env.MONGODB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export default db;