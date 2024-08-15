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
    res.render("index.ejs")
})

app.get('/About', (req, res) => {
    res.render("About.ejs")
})

app.post('/getAge', (req, res) => {
    console.log(req.body)
    console.log(req.headers)
    // function calculateAge(dob) {
    //     let birthDate = new Date(dob);
    //     let today = new Date();
    
    //     let age = today.getFullYear() - birthDate.getFullYear();
    
    //     let monthDifference = today.getMonth() - birthDate.getMonth();
    //     if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    //         age--;
    //     }
    
    //     return age;
    // }
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
    
    res.send({
        age: calculateAge(req.body.date)
    })
    // const Age = null;
    // res.render('getAge.html', {
    //  age: Age
    // })
});

app.listen(port, function() {
    console.log('listening on port ' + port);
});