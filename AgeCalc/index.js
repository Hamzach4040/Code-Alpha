import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
// app initialization
const port = 3000;
const app = express();
// limiter setup 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP address. Please try again later.'
});
// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // to parse form data
app.use(bodyParser.json()); // to parse json data
app.use(limiter);
// function to calculate age
function calculateAge(dob) {
    let birthDate = new Date(dob);
    let today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust months and years if necessary
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }

    if (days < 0) {
        months--;
        let lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    return { years, months, days };
}  

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/About', (req, res) => {
    res.render("About.ejs")
})

app.post('/getAge', (req, res) => {
    res.render("getAge.ejs", {
        age: calculateAge(req.body.date)
    })
});

app.get('/Api', (req, res) => {
    res.render('api.ejs');
})

app.post('/Api/getAge', (req, res) => {
    res.json({
        age: calculateAge(req.body.date)
    });
})

app.listen(port, function() {
    console.log('listening on port ' + port);
});