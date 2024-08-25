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
    let tasks = await db.query('SELECT * FROM tasks where taskdate = $1', [date]);
    console.log(tasks.rows.filter(t => t.done == false));
    // rendering home page
    res.render("index.ejs", {
        dueTasks: tasks.rows.filter(t => t.done === false),
        completedTasks: tasks.rows.filter(t => t.done === true),
        homeActive: true,
        scheduledActive: false
    });
})
// scheduled tasks route
app.get('/scheduled', async (req, res) => {
    let result = await db.query("SELECT * FROM tasks WHERE done = false ORDER BY taskdate ASC");
    console.log(result.rows);
    res.sendStatus(200);
})



app.post('/addTask', async (req, res) => {
    if (req.body.dueTime === '') req.body.dueTime = null;
    await db.query('INSERT INTO tasks (taskcontent, tasktime, taskdate, done) VALUES ($1, $2, $3)', [req.body.task, req.body.dueTime, req.body.dueDate, false]);
    res.redirect('/');
})
// Route to check the status of the task if done.
app.post('/Done', async (req, res) => {
    await db.query('UPDATE tasks SET done = true WHERE id = $1', [req.body.id]);
    res.redirect('/');
})
// server listening on port 3000
app.listen(port, (req, res) => {
    console.log("listening on port " + port);
});