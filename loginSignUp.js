// Import required modules
const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: "supersecretkey", // Set a secret key for session management
    resave: false,
    saveUninitialized: true,
  })
);

// Set up the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // Using EJS as a template engine (you can change it as per your preference)

// MySQL connection details
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "asdfghjkl",
  database: "rarepull_1",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Function to recommend the genre of NFT to the user
const getRecommendation = (username, callback) => {
  const query = `SELECT * FROM \`${username}\``;
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    // Logic to find the genre with the highest `numberLiked`
    let maxGenre = { genre: "None", numberLiked: 0 };
    results.forEach(({ genre, numberLiked }) => {
      if (numberLiked > maxGenre.numberLiked) {
        maxGenre = { genre, numberLiked };
      }
    });
    callback(null, maxGenre);
  });
};

// Function to sign up a new user
const signUp = (username, password, callback) => {
  const checkUserQuery = `SHOW TABLES LIKE '${username}'`;
  db.query(checkUserQuery, (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      return callback(new Error(`Username '${username}' already exists.`));
    } else {
      const insertUserQuery =
        "INSERT INTO userdetails (username, password) VALUES (?, ?)";
      db.query(insertUserQuery, [username, password], (err) => {
        if (err) return callback(err);

        const NftOwnedTable = username + "NFT'S OWNED";
        const createTableQuery = `CREATE TABLE \`${username}\` (genre VARCHAR(255), numberLiked INT)`; //to store the number liked for the recommendations

        db.query(createTableQuery, (err) => {
          if (err) return callback(err);

          // const createNftTable = `CREATE TABLE \`${NftOwnedTable}\` (name VARCHAR(255), ipfsHash VARCHAR(255))`; // table to store all the nfts owned by the user
          // db.query(createNftTable, (err) => {
          //   if (err) return callback(err);
          //   callback(null, true); // Call once at the end
          // });
        });
      });
    }
  });
};

// Function to log in a user
const login = (username, password, callback) => {
  const query = "SELECT password FROM userdetails WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) return callback(err);

    if (results.length && results[0].password === password) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  signUp(username, password, (err, success) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/signup");
    }
    req.session.username = username;
    res.redirect("/rec");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  login(username, password, (err, success) => {
    if (err) {
      req.flash("error", "Login failed.");
      return res.redirect("/login");
    }
    if (success) {
      req.session.username = username;
      res.redirect("/rec");
    } else {
      req.flash("error", "Incorrect username or password.");
      res.redirect("/login");
    }
  });
});

app.get("/rec", (req, res) => {
  const username = req.session.username;
  if (!username) {
    req.flash("error", "Please log in to see your recommendations.");
    return res.redirect("/login");
  }

  getRecommendation(username, (err, topGenre) => {
    if (err) {
      req.flash("error", "Error fetching recommendations.");
      return res.redirect("/login");
    }
    res.render("rec", { topGenre });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
