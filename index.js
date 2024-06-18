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
const vocabRouter = require('./routes/vocabs.js')
const loginRouter = require('./routes/login.js')
const resultRouter = require('./routes/results.js')
const userLevelRouter = require('./routes/userLevels.js')
const speechRouter = require('./routes/speech-to-text.js')
const speakingRouter = require('./routes/speakings.js')
const writtingRouter = require('./routes/writtings.js')
const grammarRouter = require('./routes/grammars.js')
const blogRouter = require('./routes/blogs.js')
const { configGoogle } = require('./controller/googleController.js')
const { configFacebook } = require('./controller/facebookController.js')

const configPassport = require('./controller/passportController.js')
const cookieParser = require('cookie-parser');
const session = require('express-session');



const dotenv = require('dotenv')
dotenv.config()
let app = express();
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(cookieParser('secret'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use('/mockTests', testRouter)
app.use('/listenings', listeningRouter)
app.use('/readings', readingRouter)
app.use('/users', userRouter);
app.use('/vocabularys', vocabRouter);
app.use('/login', loginRouter);
app.use('/results', resultRouter);
app.use('/userLevels', userLevelRouter);
app.use('/transcribe', speechRouter);
app.use('/speakings', speakingRouter)
app.use('/writtings', writtingRouter)
app.use('/grammars', grammarRouter)
app.use('/blogs', blogRouter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));
connectDB();
configPassport();
configGoogle();
configFacebook();





let port = process.env.PORT || 6969
app.listen(port, () => {
    console.log("backend is gud on port: " + port);
});