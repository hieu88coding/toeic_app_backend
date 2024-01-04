const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require('./config/connectDB.js');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs/index.js');
const userRouter = require('./routes/users.js');
const testRouter = require('./routes/mockTests.js')
const listeningRouter = require('./routes/listenings.js')
const readingRouter = require('./routes/readings.js')



const dotenv = require('dotenv')
dotenv.config()
let app = express();


app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use('/mockTests', testRouter)
app.use('/listenings', listeningRouter)
app.use('/readings', readingRouter)
app.use('/mockTests', testRouter)
app.use('/users', userRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));
connectDB();





let port = process.env.PORT || 6969
app.listen(port, () => {
    console.log("backend is gud on port: " + port);
});