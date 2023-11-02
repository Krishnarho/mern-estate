const connectToMongo = require('./db');
const express = require('express');
const userRouter = require('./routes/user.routes.js')

connectToMongo();
const app = express();
const port = 5000;

app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`MERN-estate app listening on port ${port}`)
});

