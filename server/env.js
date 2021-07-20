import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// define our own versions of these since they don't exist in ES6 module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// configure dotenv to always look for `.env` relative to this file, regardless
// of where `node` is run from
dotenv.config({
    path: `${__dirname}/.env`,
});

export default dotenv;