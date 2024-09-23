const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

// load config
dotenv.config({ path: "./config/config.env" });

// passport config
// all connected up in passport config file
require("./config/passport")(passport);

// db connection
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override middleware
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// logging in dev env only
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// handlebars helpers
const { formatDate, truncate, editIcon } = require("./helpers/hbs");

// handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, truncate, editIcon },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // false means session wont be saved unless its modified
    saveUninitialized: false, // false means a session won't be created until something is stored
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global passport variable to access
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/backpacks", require("./routes/backpacks"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
