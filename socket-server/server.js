import { createServer } from "http";
import { Server } from "socket.io";
import { promises as fs } from "fs";
import path from "path";

const http = createServer();
const io = new Server(http, { cors: { origin: "*" } });

const ROOMS_DIR = path.resolve("../boards");

async function loadBoard(roomId) {
  try {
    const data = await fs.readFile(
      path.join(ROOMS_DIR, `${roomId}.json`),
      "utf8"
    );
    return JSON.parse(data);
  } catch (err) {
    return []; // if not found, return empty board
  }
}

async function saveBoard(roomId, board) {
  const filePath = path.join(ROOMS_DIR, `${roomId}.json`);
  const tempPath = filePath + ".tmp";
  await fs.writeFile(tempPath, JSON.stringify(board, null, 2));
  await fs.rename(tempPath, filePath);
}

let rooms = {}; // { roomId: { title: string, board: [] } }

// Load existing room list and boards on startup
async function loadRooms() {
  try {
    await fs.mkdir(ROOMS_DIR, { recursive: true });
    const files = await fs.readdir(ROOMS_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const roomId = file.replace(".json", "");
      const board = await loadBoard(roomId);
      rooms[roomId] = { title: `Room ${roomId}`, board };
    }
  } catch (err) {
    console.error("Failed to load rooms:", err);
  }
}

io.on("connection", (socket) => {
  // clientCount++;

  socket.emit("room:list", getRoomList());
  socket.emit("server:status", "online");
  socket.on("room:create", async ({ id, title }, ack) => {
    if (rooms[id]) return ack?.({ ok: false, error: "Room already exists" });

    const board = [];
    rooms[id] = { title, board };
    await saveBoard(id, board);
    io.emit("room:list", getRoomList());
    ack?.({ ok: true });
  });

  socket.on("room:list", () => {
    socket.emit("room:list", getRoomList());
  });

  socket.on("room:join", async ({ id }, ack) => {
    if (!rooms[id]) return ack?.({ ok: false, error: "Room not found" });

    socket.join(id);
    socket.data.roomId = id;
    const board = rooms[id].board;
    socket.emit("board:update", { board });
    ack?.({ ok: true });
  });

  // === Board Actions per Room ===

  socket.on("column:add", (col) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const board = rooms[roomId].board;
    board.push(col);
    saveBoard(roomId, board);
    io.to(roomId).emit("board:update", { board });
  });

  socket.on("column:move", ({ sourceIdx, destIdx }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const board = rooms[roomId].board;
    const [moved] = board.splice(sourceIdx, 1);
    board.splice(destIdx, 0, moved);
    saveBoard(roomId, board);
    io.to(roomId).emit("board:update", { board });
  });

  socket.on("card:add", ({ columnId, card }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const board = rooms[roomId].board;
    const column = board.find((c) => c.id === columnId);
    column.cards.push({ ...card, createdAt: new Date().toISOString() });
    saveBoard(roomId, board);
    io.to(roomId).emit("board:update", { board });
  });

  socket.on("card:update", ({ columnId, cardId, changes }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const board = rooms[roomId].board;
    const column = board.find((c) => c.id === columnId);
    column.cards = column.cards.map((card) =>
      card.id === cardId ? { ...card, ...changes } : card
    );
    saveBoard(roomId, board);
    io.to(roomId).emit("board:update", { board });
  });

  socket.on("card:delete", ({ columnId, cardId }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const board = rooms[roomId].board;
    const column = board.find((c) => c.id === columnId);
    column.cards = column.cards.filter((card) => card.id !== cardId);
    saveBoard(roomId, board);
    io.to(roomId).emit("board:update", { board });
  });

  socket.on("card:move", ({ sourceCol, destCol, sourceIdx, destIdx }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const board = rooms[roomId].board;
    const source = board.find((c) => c.id === sourceCol);
    const [moved] = source.cards.splice(sourceIdx, 1);
    const dest = board.find((c) => c.id === destCol);
    dest.cards.splice(destIdx, 0, moved);
    saveBoard(roomId, board);
    io.to(roomId).emit("board:update", { board });
  });
});

function getRoomList() {
  return Object.entries(rooms).map(([id, { title }]) => ({ id, title }));
}

loadRooms().then(() => {
  http.listen(4000, () => console.log("Socket.IO with rooms running on 4000"));
});
