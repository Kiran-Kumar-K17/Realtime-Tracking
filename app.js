import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT | 3000;


const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
  });
  console.log("a user connected", socket.id);
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
