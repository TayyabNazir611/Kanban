/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import { useSocket } from "../hooks/useSocket";

export type CardType = { id: string; title: string; description: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };
export type BoardState = ColumnType[];

interface Ctx {
  board: BoardState;
  addColumn: (title: string) => void;
  addCard: (columnId: string, card: Omit<CardType, "id">) => void;
  updateCard: (
    columnId: string,
    cardId: string,
    changes: Partial<Omit<CardType, "id">>
  ) => void;
  moveCard: (
    sourceCol: string,
    destCol: string,
    sourceIdx: number,
    destIdx: number
  ) => void;
  moveColumn: (sourceIdx: number, destIdx: number) => void;
}

const BoardContext = createContext<Ctx | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket("ws://localhost:4000");

  const [board, setBoard] = useState<BoardState>([
    { id: uuid(), title: "To Do", cards: [] },
  ]);
  const [connected, setConnected] = useState(0);

  console.log(connected);
  // ---------------- socket listeners ----------------
  useEffect(() => {
    if (!socket) return;
    const onSnapshot = (data: BoardState, online: number) => {
      console.log("[Board] Received board:update", data, online);
      setBoard(data);
      setConnected(online);
    };
    const onColAdd = (col: ColumnType) => setBoard((prev) => [...prev, col]);
    const onCardAdd = ({
      columnId,
      card,
    }: {
      columnId: string;
      card: CardType;
    }) =>
      setBoard((prev) =>
        prev.map((c) =>
          c.id === columnId ? { ...c, cards: [...c.cards, card] } : c
        )
      );
    const onCardUpdate = ({ columnId, cardId, changes }: any) =>
      setBoard((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((card) =>
                  card.id === cardId ? { ...card, ...changes } : card
                ),
              }
            : col
        )
      );
    const onMoveCard = (payload: any) => {
      const { sourceCol, destCol, sourceIdx, destIdx } = payload;
      setBoard((prev) => {
        const next = structuredClone(prev) as BoardState;
        const sourceColumn = next.find((c) => c.id === sourceCol)!;
        const [moved] = sourceColumn.cards.splice(sourceIdx, 1);
        const destColumn = next.find((c) => c.id === destCol)!;
        destColumn.cards.splice(destIdx, 0, moved);
        return next;
      });
    };
    const onMoveColumn = ({ sourceIdx, destIdx }: any) =>
      setBoard((prev) => {
        const next = structuredClone(prev) as BoardState;
        const [moved] = next.splice(sourceIdx, 1);
        next.splice(destIdx, 0, moved);
        return next;
      });

    // socket.on("init", init);
    socket.on("board:update", onSnapshot);
    socket.on("column:add", onColAdd);
    socket.on("card:add", onCardAdd);
    socket.on("card:update", onCardUpdate);
    socket.on("card:move", onMoveCard);
    socket.on("column:move", onMoveColumn);
    return () => {
      // socket.off("init", init);
      socket.off("board:update", onSnapshot);
      socket.off("column:add", onColAdd);
      socket.off("card:add", onCardAdd);
      socket.off("card:update", onCardUpdate);
      socket.off("card:move", onMoveCard);
      socket.off("column:move", onMoveColumn);
    };
  }, [socket]);

  // ---------------- helpers ----------------
  const addColumn = useCallback(
    (title: string) => {
      const newCol: ColumnType = { id: uuid(), title, cards: [] };
      setBoard((prev) => [...prev, newCol]);
      socket?.emit("column:add", newCol);
    },
    [socket]
  );

  const addCard = useCallback(
    (columnId: string, card: Omit<CardType, "id">) => {
      const newCard: CardType = { id: uuid(), ...card };
      setBoard((prev) =>
        prev.map((c) =>
          c.id === columnId ? { ...c, cards: [...c.cards, newCard] } : c
        )
      );
      socket?.emit("card:add", { columnId, card: newCard });
    },
    [socket]
  );

  const updateCard = useCallback(
    (columnId: string, cardId: string, changes: any) => {
      setBoard((prev) =>
        prev.map((c) =>
          c.id === columnId
            ? {
                ...c,
                cards: c.cards.map((cd) =>
                  cd.id === cardId ? { ...cd, ...changes } : cd
                ),
              }
            : c
        )
      );
      socket?.emit("card:update", { columnId, cardId, changes });
    },
    [socket]
  );

  const moveCard = useCallback(
    (
      sourceCol: string,
      destCol: string,
      sourceIdx: number,
      destIdx: number
    ) => {
      setBoard((prev) => {
        const next = structuredClone(prev) as BoardState;
        const sourceColumn = next.find((c) => c.id === sourceCol)!;
        const [moved] = sourceColumn.cards.splice(sourceIdx, 1);
        const destColumn = next.find((c) => c.id === destCol)!;
        destColumn.cards.splice(destIdx, 0, moved);
        return next;
      });
      socket?.emit("card:move", { sourceCol, destCol, sourceIdx, destIdx });
    },
    [socket]
  );

  const moveColumn = useCallback(
    (sourceIdx: number, destIdx: number) => {
      setBoard((prev) => {
        const next = structuredClone(prev) as BoardState;
        const [moved] = next.splice(sourceIdx, 1);
        next.splice(destIdx, 0, moved);
        return next;
      });
      socket?.emit("column:move", { sourceIdx, destIdx });
    },
    [socket]
  );

  const value: Ctx = {
    board,
    addColumn,
    addCard,
    updateCard,
    moveCard,
    moveColumn,
  };
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within BoardProvider");
  return ctx;
}
