// import dotenv to run once and be available to all further imported modules as
// suggested [here](https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import)
import './env.js';
import express from 'express';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3001;

import './boot/db.js';

const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const EpisodeSchema = mongoose.Schema({
    episodenumber: Number,
    url: String,
    image: String,
    title: String,
    tracklist: Array
});

var Episode = mongoose.model('Episode', EpisodeSchema);

const app = express();

app.param('episode', (req, res, next, eNum) => {
    Episode.findOne({episodenumber: eNum})
        .then(result => {
            res.episode = result;
            next();
        });
});

app.get('/api/episodes/:episode', (req, res) => {
    res.json(res.episode);
});

app.listen(PORT, () => {
    console.log(`Express listening on ${PORT}`);
});
