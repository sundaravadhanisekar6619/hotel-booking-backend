require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo");

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/booking');
const reviewRoutes = require('./routes/review');
const offerRoutes = require('./routes/offer');
const paymentRoutes = require('./routes/payment');
const notificationRoutes = require('./routes/notification');

const authApiRoutes = require("./routes/authApi");
const userApiRoutes = require("./routes/userApi");
const roomApiRoutes = require("./routes/roomApi");
const bookingApiRoutes = require("./routes/bookingApi");
const reviewApiRoutes = require("./routes/reviewApi");
const offerApiRoutes = require("./routes/offerApi");
const paymentApiRoutes = require("./routes/paymentApi");
const notificationApiRoutes = require("./routes/notificationApi");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));

  app.use(
  session({
    secret: "hotel booking",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false, // set true only if using HTTPS
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
})

app.use((req, res, next) => {
  if (!req.session.user){
     return next();
  }
  
  User.findById(req.session.user.id)
  .then( user => {
      if (!user){
        return next();
      }
      req.user = user;
      next();
  })
  .catch(err => {
     next(new Error(err));
  });
})  

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  })

app.use(authRoutes);
app.use(userRoutes);
app.use(roomRoutes);
app.use(bookingRoutes);
app.use(reviewRoutes);
app.use(offerRoutes);
app.use(paymentRoutes);
app.use(notificationRoutes);

app.use("/api/auth", authApiRoutes);
app.use("/api/users", userApiRoutes);
app.use("/api/rooms", roomApiRoutes);
app.use("/api/bookings", bookingApiRoutes);
app.use("/api/reviews", reviewApiRoutes);
app.use("/api/offers", offerApiRoutes);
app.use("/api/payments", paymentApiRoutes);
app.use("/api/notifications", notificationApiRoutes);

// mongoose.connect('mongodb://localhost:27017/hotel_booking?retryWrites=true&w=majority&appName=Cluster0')
mongoose.connect(process.env.MONGO_URI, {
  tls: true
})
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

