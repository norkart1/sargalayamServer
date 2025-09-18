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

// Landing page for root path
app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>College Rank List API</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .endpoint { background: #f4f4f4; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .method { color: #007acc; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏆 College Rank List API</h1>
        <p>Welcome to the College Ranking Management System API. This backend provides endpoints for managing college teams, programs, and administrative functions.</p>
        
        <h2>📚 Available Endpoints:</h2>
        
        <h3>Admin Routes:</h3>
        <div class="endpoint"><span class="method">POST</span> /admin/login - Admin login</div>
        <div class="endpoint"><span class="method">POST</span> /admin/logout - Admin logout</div>
        
        <h3>Teams & Programs:</h3>
        <div class="endpoint"><span class="method">GET</span> /teams/getAllteams - Get all teams</div>
        <div class="endpoint"><span class="method">GET</span> /teams/getAllPrograms - Get all programs</div>
        <div class="endpoint"><span class="method">POST</span> /teams/addteam - Add new team</div>
        <div class="endpoint"><span class="method">POST</span> /teams/createProgram - Create new program</div>
        
        <h2>🔐 Authentication:</h2>
        <p>To access protected endpoints, first login through <code>POST /admin/login</code> with your credentials to receive a JWT token.</p>
        
        <h2>💡 Server Status:</h2>
        <p>Server is running on port 5000 with Socket.IO support for real-time features.</p>
        <p><a href="/health">Check server health</a></p>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: "connected"
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "./public")));

// Connect Socket.IO to your Express server
io.on("connection", (socket) => {
  console.log("Client connected");
});

//Mongoose Setup
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "SARGALAYAM-2024",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, "0.0.0.0", () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
