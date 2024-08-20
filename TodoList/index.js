import pg from 'pg';
import bodyParser from 'body-parser';
import express from 'express';
// app init
const port = 3000;
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
// database init
const db = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Azmahnama'
});
db.connect();
// home route
app.get('/', (req, res) => {})




// server listening on port 3000
app.listen(port, (req, res) => {
    console.log("listening on port" + port);
});