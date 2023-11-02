const connectToMongo = require('./db');
const express = require('express');
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')

connectToMongo();

const app = express();
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

const port = 5000;
app.listen(port, () => {
    console.log(`MERN-estate app listening on port ${port}`)
});

