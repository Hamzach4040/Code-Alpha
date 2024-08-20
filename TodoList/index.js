import pg from 'pg';
import bodyParser from 'body-parser';
import express from 'express';
import "dotenv/config.js";
// app init
const port = 3000;
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
// database init
const db = new pg.Client({
    host: process.env["HOST"],
    port: process.env["PORT"],
    user: process.env["USER"],
    password: process.env["PASSWORD"]
});
db.connect();
// home route
app.get('/', (req, res) => {})




// server listening on port 3000
app.listen(port, (req, res) => {
    console.log("listening on port" + port);
});