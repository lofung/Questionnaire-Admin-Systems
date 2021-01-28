const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors'); //colors in the console
const morgan = require('morgan'); //require pings and req in the console
const path = require('path'); //for connecting paths


//https://www.youtube.com/watch?v=KyWaXA_NvT0&t=5s
//Node.js & Express API | Expense Tracker - Part 2 (MERN)

//stuff you do not want to show up on github
//but it is okay for me this time
dotenv.config({ path: './config/config.env' });

//export all the messy routes to the router
const routers = require('./routes/routes');

const app = express();

//you need this to parse URL and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    //log all the inc traffic logs when in development
}

//for tall the messy api's
app.use('/api/v1/', routers)

//to serve different static file to multiple react models
//https://stackoverflow.com/questions/52452541/why-does-react-routes-doesnt-work-on-server-properly?rq=1

//currently not the best way to list all the app.use at the front page. Will figure out how to organize later.

//for loading admin backend landing page
app.use('/bd/admin-config/', express.static('back-client/')) //this line makes sure that the static files gets loaded, or not if not exists.
//the path in app.use before express.static MUST MATCH
app.get('/bd/admin-config/', (req, res) => res.sendFile(path.resolve(__dirname, 'back-client', 'index.html')));

//for loading questionnaire viewer
app.use('/bd/admin-config/view-q', express.static('back-client/questionnaire-summary-viewer/build')) //this line makes sure that the static files gets loaded, or not if not exists.
app.get('/bd/admin-config/vieq-q', (req, res) => res.sendFile(path.resolve(__dirname, 'back-client', 'questionnaire-summary-viewer', 'build', 'index.html')));

//for loading result viewer
app.use('/bd/admin-config/view-result', express.static('back-client/result-viewer/build')) //this line makes sure that the static files gets loaded, or not if not exists.
app.get('/bd/admin-config/view-result/:token', (req, res) => res.sendFile(path.resolve(__dirname, 'back-client', 'result-viewer', 'build', 'index.html')));



//for loading admin panels to admins
app.use('/bd/admin-config/build-edit', express.static('back-client/builder/build')) //this line makes sure that the static files gets loaded, or not if not exists.
app.get('/bd/admin-config/build-edit', (req, res) => res.sendFile(path.resolve(__dirname, 'back-client', 'builder', 'build', 'index.html')));

//for loading questionnaire to students
app.use('/front', express.static('front-client/questionnaire-reader/build')) //this line makes sure that the static files gets loaded, or not if not exists.
app.get('/front', (req, res) => res.sendFile(path.resolve(__dirname, 'front-client', 'questionnaire-reader', 'build', 'index.html')));
app.get('/front/:token', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'front-client', 'questionnaire-reader', 'build', 'index.html'))
});


//for QR code
app.use('/front/QR', express.static('front-client/QR-code')) //this line makes sure that the static files gets loaded, or not if not exists.
app.get('/front/QR/:token', (req, res) => res.sendFile(path.resolve(__dirname, 'front-client', 'QR-code', 'QR.html')));

//landing page for students
app.use('/', express.static('front-client/landing-page')) //this line makes sure that the static files gets loaded, or not if not exists.
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'front-client', 'landing-page', 'index.html')));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
