import express, { Request, Response } from "express";
import http from "http";
import WebSocket from "ws";
import bodyParser from "body-parser";
import cors from "cors";
import GlobalStore from "../../shared/globalStore";
import EventBus from "../../shared/eventBus";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

const globalStore = GlobalStore.getInstance(); // Singleton instance of the global store
const eventBus = EventBus.getInstance(); // Singleton instance of the event bus

app.get("/", (req: Request, res: Response) => {
  res.json("nothing to see here homie");
});

app.get("/data", (req: Request, res: Response) => {
  res.json(globalStore.getState());
});

app.post("/data/items", (req: Request, res: Response) => {
  const { key, value } = req.body;

  if (key !== "items") {
    res.sendStatus(400);
    return;
  }

  globalStore.setState({
    [key]: [...globalStore.getState().items, value],
  });

  // Emit an event for subscribers
  eventBus.emit("dataUpdated", globalStore.getState());

  // Broadcast the updated data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(globalStore.getState()));
    }
  });

  res.sendStatus(204);
});

// Handle WebSocket connections
wss.on("connection", (ws) => {
  ws.send(JSON.stringify(globalStore.getState()));
});

// Example of listening for events from the event bus
//TODO: Just for testing purposes, remove this in production
eventBus.on("dataUpdated", (newState) => {
  console.log("Data updated:", newState);
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
