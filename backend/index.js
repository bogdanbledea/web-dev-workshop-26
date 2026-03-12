import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import apiKeyAuth from "./middleware/auth.js";

app.use(cors());

const app = express();
const server = http.createServer(app);
const port = 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.use(express.json());

app.use("/api", apiKeyAuth);

let shows = [
  { id: 1, name: "Breaking Bad", votes: 0 },
  { id: 2, name: "Game of Thrones", votes: 0 },
  { id: 3, name: "Stranger Things", votes: 0 },
];

app.get("/api/shows", (req, res) => {
  res.json(shows);
});

app.post("/api/shows", (req, res) => {
  const { name } = req.body;
  if (name) {
    const newShow = { id: shows.length + 1, name, votes: 0 };
    shows.push(newShow);
    console.log(`Added new show: ${name}`);
    io.emit("new-show", { shows });
    res.json({ success: true, show: newShow });
  } else {
    res.status(400).json({ success: false, message: "Name is required" });
  }
});

app.post("/api/vote", (req, res) => {
  const { id } = req.body;
  const show = shows.find((s) => s.id === id);
  if (show) {
    show.votes += 1;
    console.log(`Received vote for show with id: ${id}`);
    io.emit("vote", { shows });
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Show not found" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`web dev app listening on port ${port}`);
});
