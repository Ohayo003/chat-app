import Express from 'express';
import cors from 'cors';
import  http  from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authLogin from './Route/authLogin.js';
import RegisterRoute from './Route/RegisterRoute.js'
import ConversationRoute from './Route/ConversationRoute.js';
import connectDB from './dbConnection.js';
import users from './Route/usersRoute.js'
import messagesRoute from './Route/MessageRoute.js';
import session from 'express-session';

const listOfUsers = {};

const app = Express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);



app.use(Express.json());    
app.use(
    cors(
        {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST","PUT","DELETE"],
        credentials: true,
    }
    )
  );
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 30 * 30 * 2
    }
}))

//DB Config
// db.connect();
connectDB();


// API ENDPoints
app.get('/api', (req,res) => {
    res.send('Server is up and Running!!');   
});

app.use("/api/login",authLogin);
app.use("/api/register",RegisterRoute);
app.use("/api/chat",ConversationRoute);
app.use("/api/chat/users", users);
app.use("/api/chat",messagesRoute);


server.listen(port, () => console.log(`server is up and running on port ${port}`));