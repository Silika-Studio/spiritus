import express = require('express');
import cors = require('cors');

import { collectionsRouter } from './routes';
import { loadConfig } from './utils';


// ------------- SERVER STUFF ----------------
// set port to default https
const API_PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

loadConfig();



app.use('/', router);
app.use('/', collectionsRouter);

// launch our backend into a port
const port = process.env.PORT || API_PORT;

app.listen(port, async () => {
    console.log(`LISTENING ON PORT ${port}`);
});
