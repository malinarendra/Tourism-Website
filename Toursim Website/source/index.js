// requiring express module
const express = require('express')

//creating app
const app = express();

//requiring path module
const path = require('path')

//requiring bodyParser
const bodyParser = require('body-parser')

//requiring session module for logout
// const session = require('express-session')
// app.use(session({
//     secret: 'weblesson',
//     resave: true,
//     saveUninitialized: true
// }))


// requiring mysql
var mysql = require('mysql');
// const { query } = require('express');

//creating mysql connection
var con = mysql.createConnection({
    host: 'localhost',
    // database: 'signup',
    user: 'root',
    password: 'Talmala@222'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


//form data getting
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//setting the template engine
app.set('view engine', 'hbs')

//setting up the views directory
app.set('views', path.join(__dirname, '../views'))

// setting up the static files directory
const staticPath = path.join(__dirname, '../public')
app.use(express.static(staticPath))






// default page routing
app.get('/', (req, res, next) => {
    res.render('index.hbs', { session: req.session })
})

//index page routing
app.get('/index.hbs', (req, res) => {
    res.render('index.hbs')
})

//login page routing
app.get('/login.hbs', (req, res) => {
    res.render('login.hbs')
})



// log in
app.post('/login', (req, res) => {
    const Name = req.body.lname.toUpperCase()
    const lName = Name
    const lPass = req.body.lpass
    con.query(`SELECT * FROM SIGNUP.INFO WHERE NAME='${lName}'`, function (err, result, fields) {
        if (err) {
            throw err
        }
        else {
            if (result.length > 0) {
                res.render('aindex', { Name: `${lName}` })
            }
            else {
                res.send("Name or Password is invalid.")
            }
        }
        // console.log(result)
    })

})



// sign up
app.post('/signup', (req, res) => {
    //getting the date from from
    const Name = req.body.Name.toUpperCase()
    const email = req.body.email
    const pass = req.body.pass

    con.query(`INSERT INTO SIGNUP.info (NAME, EMAIL, PASSWORD) VALUES ('${Name}','${email}','${pass}')`, function (err, result, fields) {
        if (err) {
            res.send("Name already exist choose another name.")
        }
        else {
            console.log("One Record Inserted")
            res.render('aindex', { Name: `${Name}` })
        }
    });
})


// logout
app.get('/logout', (req, res) => {
    res.render('index')
})

//making connection for book trip
var book = mysql.createConnection({
    host: 'localhost',
    // database: 'booktrip',
    user: 'root',
    password: 'Talmala@222'
});

book.connect((err) => {
    if (err) {
        throw err
    }
    else {
        console.log("Connected to book my trip")
    }
})

// book trip
app.get('/book', (req, res) => {
    res.render('booktrip')
})


//book trip data
app.post('/booktrip', (req, res) => {
    const name = req.body.visitor_name.toUpperCase()
    const email = req.body.visitor_email
    const phone = req.body.visitor_phone
    const adults = req.body.total_adults
    const children = req.body.total_children
    const tour = req.body.tour_pack
    const message = req.body.visitor_message
    // console.log(name)
    // console.log(email)
    // console.log(phone)
    // console.log(adults)
    // console.log(children)
    // console.log(tour)
    // console.log(message)
    book.query(`INSERT INTO BOOKTRIP.book (NAME, EMAIL, PHONE, ADULTS, CHILDRENS, TOUR, MESSAGE) VALUES ('${name}','${email}','${phone}','${adults}','${children}','${tour}','${message}')`, (err, result) => {
        if (err) {
            throw err
        }
        else {
            res.render('aindex')
        }
    })

})

//making connection for feedback
var mes = mysql.createConnection({
    host: 'localhost',
    // database: 'query',
    user: 'root',
    password: 'Talmala@222'
});

//queries
mes.connect((err) => {
    if (err) {
        throw err
    }
    else {
        console.log("bhayo connected.")
    }
})



// admin page routing
app.get('/admin-login', (req, res) => {
    res.render('admin')
})

app.post('/alogin', (req, res) => {
    const username = req.body.username.toUpperCase()
    const password = req.body.password

    if (username == "NARENDRA" & password == "1234") {

        book.query("SELECT * FROM BOOKTRIP.BOOK", (err, result,fields) => {
            if (err) throw err
            else {
                const data = result
                // const fback = result[1]
                res.render('admin-page',{data})
            }
        })
    }
    else {
        res.send("Invalid credintials.")
    }
})

app.get('/alogin', (req, res) => {
        book.query("SELECT * FROM BOOKTRIP.BOOK", (err, result,fields) => {
            if (err) throw err
            else {
                const data = result
                // const fback = result[1]
                res.render('admin-page',{data})
            }
        })
})

app.get('/aquery', (req, res) => {
    book.query("SELECT * FROM QUERY.FEEDBACK", (err, result,fields) => {
        if (err) throw err
        else {
            const fback = result
            // const fback = result[1]
            res.render('aquery',{fback})
        }
    })
})

app.get('/alogout',(req,res)=>{
    res.render('admin')
})






app.post('/queries', (req, res) => {
    const fname = req.body.fname.toUpperCase()
    const lname = req.body.lname.toUpperCase()
    const email = req.body.email
    const message = req.body.message.toUpperCase()
    mes.query(`INSERT INTO QUERY.feedback (FIRSTNAME, LASTNAME, EMAIL, MESSAGE) VALUES ('${fname}','${lname}','${email}','${message}')`, (err, result, fields) => {
        if (err) {
            throw err
        }
        else {
            res.render('aindex', { Name: `${fname}` })
        }

    })
})


//server listen
app.listen(80, () => {
    console.log('app launched successfully.')
})