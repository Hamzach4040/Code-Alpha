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
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Azmahnama",
    database: "ToDoList"
});
db.connect();
// home route
app.get('/', async (req, res) => {
    // finding current date
    let date = new Date().toISOString().split('T')[0];
    // finding tasks for current date
    let tasks = await db.query('SELECT * FROM tasks WHERE taskdate = $1', [date]);
    // rendering home page
    res.render("index.ejs", {
        // tasks: tasks.rows
    })
})

app.post('/addTask', async (req, res) => {
    res.redirect('/');
})


// server listening on port 3000
app.listen(port, (req, res) => {
    console.log("listening on port " + port);
});