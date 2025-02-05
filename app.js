// server.js
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { engine } = require("express-handlebars");

// handlebars
app.engine(
  "hbs",
  engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: path.join(__dirname, "views/partials"),
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

// Middleware to parse JSON requests
app.use(express.json());

// Client-side files
app.use(express.static("public"));

// Routes
app.use("/", require("./routes/index")); // main landing page

// Start the server
app.listen(port, () => {
  console.log(`The app is listening at http://localhost:${port}`);
});
