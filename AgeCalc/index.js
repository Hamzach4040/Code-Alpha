import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

const port = 3000;
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP address. Please try again later.'
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

app.get('/', (req, res) => {
    res.render("index.html")
})

app.post('/getAge', (req, res) => {
    const Age = null;
    res.render('getAge.html', {
        age: Age
    })
});

app.listen(port, function() {
    console.log('listening on port ' + port);
});