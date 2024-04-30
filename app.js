const express = require('express');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 3000;
const allRoutes = require('./routes/routes');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require('cors');
const database = require('./database');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(csurf({ cookie: true }));
const os = require('os');

app.use(session({
    secret: 'thisismysecretkey',
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    if (!req.csrfToken() || req.csrfTokenExpired) {
        // Generate and set a new CSRF token
        res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
});


app.get('/csrf_token', (req, res) => {
    // return res.status(200).json({message:'here'})
    console.log('token created: ', req.csrfToken());
    const csrfToken = req.csrfToken();
    req.session.csrfToken = csrfToken;
    return res.status(200).json({ csrfToken });
});

app.use('/', allRoutes);

app.listen(port, () => {
    console.log(`Port Number: ${port}`);
})