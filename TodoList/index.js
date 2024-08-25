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
    host: process.env["HOST"] || "localhost",
    port: process.env["PORT"] || 5432,
    user: process.env["USER"],
    password: process.env["PASSWORD"],
    database: process.env["DB_NAME"],
});
db.connect();
// home route
app.get('/', async (req, res) => {
    // finding current date
    let date = new Date().toISOString().split('T')[0];
    // finding tasks for current date
    let tasks = await db.query('SELECT * FROM tasks where taskdate = $1', [date]);
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
    // getting tasks sorted by date
    let result = await db.query("SELECT * FROM tasks WHERE done = false ORDER BY taskdate ASC");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // days by name
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // months by name

    for (let row of result.rows) {
        // creating a full date value for each task
        let date = new Date(row.taskdate);
        row["fullDate"] = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    }
    // using the reduce function to map tasks by their date onto an object 
    let object = result.rows.reduce((obj, row) => {
        const taskDate = row.fullDate;
        if (!obj[taskDate]) {
            obj[taskDate] = [];
        }
        obj[taskDate].push(row);
        return obj;
    }, {});

    // rendering the page
    res.render('Scheduled.ejs', {
        tasks: object,
        homeActive: false,
        scheduledActive: true,
    })
})

app.post('/addTask', async (req, res) => {
    // setting the due time value to be acceptable for the db 
    if (req.body.dueTime === '') req.body.dueTime = null;
    // query for inserting the date to the db
    await db.query('INSERT INTO tasks (taskcontent, tasktime, taskdate, done) VALUES ($1, $2, $3, $4)', [req.body.task, req.body.dueTime, req.body.dueDate, false]);
    // redirecting user back to home
    res.redirect('/');
})
// Route to check the status of the task if done.
app.post('/Done', async (req, res) => {
    // query to change the status of the task
    await db.query('UPDATE tasks SET done = true WHERE id = $1', [req.body.id]);
    // redirecting user back to the page they came from 
    res.redirect(req.headers.referer);
})
// server listening on port 3000
app.listen(port, (req, res) => {
    console.log("listening on port " + port);
});