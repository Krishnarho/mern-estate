const connectToMongo = require('./db');
const express = require('express');
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
const listingRouter = require('./routes/listing.route.js')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

connectToMongo();
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

const port = 5000;
app.listen(port, () => {
    console.log(`MERN-estate app listening on port ${port}`)
});

// Creating a middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

