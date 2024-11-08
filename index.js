const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoute = require("./routes/admin");
const teamRoute = require("./routes/teams");
const bodyParser = require("body-parser");
const path = require("node:path");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

require("dotenv").config();

const app = express();
const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3001",
//       "http://localhost:3000",
//     ],
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Attach io to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json()); // for parsing application/json

//ROUTE use
app.use("/admin", adminRoute);
app.use("/teams", teamRoute);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "./public")));

// Connect Socket.IO to your Express server
io.on("connection", (socket) => {
  console.log("Client connected");
});

//Mongoose Setup
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "SARGALAYAM-2024",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
