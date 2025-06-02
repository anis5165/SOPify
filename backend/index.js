require('dotenv').config();
const express = require('express');
const UserRouter = require('./routers/userRouter');
const SopRouter = require('./routers/sopRouter');
const FeedbackRouter =require('./routers/feedbackRouter');
const ContactRouter =require('./routers/contactRouter');

const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;

// Set payload size limits - increase these values for handling large images

// middleware
app.use(cors({origin: "*"}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/user', UserRouter);
app.use('/sops', SopRouter);
app.use('/feedback', FeedbackRouter);
app.use('/contact',ContactRouter);


//endpoint or route
app.get('/', (req, res) => {
    res.send('response from express');
});

app.get('/add', (req, res) => {
    res.send('response from add');
});

//getall
app.get('/getall', (req, res) => {
    res.send('response from getall');
});

//delete
app.get('/delete', (req, res) => {
    res.send('response from delete');
});

app.listen(port, () => {
    console.log('server started on port', port);
});
