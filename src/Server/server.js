// import { createServer } from "http";
// import { Server } from "socket.io";
// const http = createServer();
// const io = new Server(http, { cors: { origin: "*" } });
// let board = [];

// io.on("connection", (socket) => {
//   socket.emit("init", board);
//   socket.on("column:add", (col) => {
//     board.push(col);
//     io.emit("column:add", col);
//   });
//   socket.on("card:add", ({ columnId, card }) => {
//     board = board.map((c) =>
//       c.id === columnId ? { ...c, cards: [...c.cards, card] } : c
//     );
//     io.emit("card:add", { columnId, card });
//   });
//   socket.on("card:update", ({ columnId, cardId, changes }) => {
//     board = board.map((c) =>
//       c.id === columnId
//         ? {
//             ...c,
//             cards: c.cards.map((card) =>
//               card.id === cardId ? { ...card, ...changes } : card
//             ),
//           }
//         : c
//     );
//     io.emit("card:update", { columnId, cardId, changes });
//   });
//   socket.on("card:move", (payload) => {
//     const { sourceCol, destCol, sourceIdx, destIdx } = payload;
//     const sourceColumn = board.find((c) => c.id === sourceCol);
//     const [moved] = sourceColumn.cards.splice(sourceIdx, 1);
//     const destColumn = board.find((c) => c.id === destCol);
//     destColumn.cards.splice(destIdx, 0, moved);
//     io.emit("card:move", payload);
//   });
//   socket.on("column:move", ({ sourceIdx, destIdx }) => {
//     const [moved] = board.splice(sourceIdx, 1);
//     board.splice(destIdx, 0, moved);
//     io.emit("column:move", { sourceIdx, destIdx });
//   });
// });
// http.listen(4000, () => console.log("socket.io on 4000"));

import { createServer } from "http";
import { Server } from "socket.io";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.resolve("board.json");

const http = createServer();
const io = new Server(http, { cors: { origin: "*" } });

let board = [];
let clientCount = 0;

async function loadBoard() {
  try {
    const json = await fs.readFile(DATA_FILE, { encoding: "utf8" });
    board = JSON.parse(json);
    console.log("Board loaded from file");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No existing board.json, starting empty");
    } else {
      console.error("Failed to load board:", err);
    }
    board = [];
  }
}

async function saveBoard() {
  try {
    await fs.writeFile(DATA_FILE + ".tmp", JSON.stringify(board, null, 2));
    await fs.rename(DATA_FILE + ".tmp", DATA_FILE); // atomic swap
  } catch (err) {
    console.error("Failed to save board:", err);
  }
}

const mutateBoard = (fn) => {
  board = fn(board);
  console.log("board", board);
  io.emit("board:update", { board, clientCount });
  saveBoard();
};

io.on("connection", (socket) => {
  clientCount++;
  io.emit("client:count", clientCount);
  console.log(`Client connected (${clientCount} online)`);
  socket.emit("board:update", { board, clientCount }); // full state on join

  socket.on("disconnect", () => {
    clientCount--;
    io.emit("client:count", clientCount);
    socket.emit("board:update", { board, clientCount });
    console.log(`Client disconnected (${clientCount} online)`);
  });

  /* ---------- columns ---------- */
  socket.on("column:add", (col, ack) => {
    mutateBoard((b) => [...b, col]);

    // tell every *other* client what happened
    // socket.broadcast.emit("column:add", col);
    ack?.({ ok: true });
  });

  socket.on("column:move", ({ sourceIdx, destIdx }) => {
    mutateBoard((b) => {
      const copy = [...b];
      const [moved] = copy.splice(sourceIdx, 1);
      copy.splice(destIdx, 0, moved);
      return copy;
    });
    // socket.broadcast.emit("column:move", { sourceIdx, destIdx });
  });

  /* ---------- cards ---------- */
  socket.on("card:add", ({ columnId, card }) => {
    mutateBoard((b) =>
      b.map((c) =>
        c.id === columnId ? { ...c, cards: [...c.cards, card] } : c
      )
    );
    // socket.broadcast.emit("card:add", { columnId, card });
  });

  socket.on("card:update", ({ columnId, cardId, changes }) => {
    mutateBoard((b) =>
      b.map((c) =>
        c.id === columnId
          ? {
              ...c,
              cards: c.cards.map((card) =>
                card.id === cardId ? { ...card, ...changes } : card
              ),
            }
          : c
      )
    );
    // socket.broadcast.emit("card:update", { columnId, cardId, changes });
  });

  socket.on("card:move", ({ sourceCol, destCol, sourceIdx, destIdx }) => {
    mutateBoard((b) => {
      const copy = structuredClone(b); // deep copy
      const source = copy.find((c) => c.id === sourceCol);
      const [moved] = source.cards.splice(sourceIdx, 1);
      const dest = copy.find((c) => c.id === destCol);
      dest.cards.splice(destIdx, 0, moved);
      return copy;
    });
    // socket.broadcast.emit("card:move", {
    //   sourceCol,
    //   destCol,
    //   sourceIdx,
    //   destIdx,
    // });
  });
});

await loadBoard();
http.listen(4000, () => console.log("Socket.IO on 4000"));
