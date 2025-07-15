import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);
  const sockRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sockRef.current) {
      const socketInstance = io(url, { transports: ["websocket"] });
      sockRef.current = socketInstance;
      setSocket(socketInstance);
      console.log("[Socket] Connecting to", url);
    }

    return () => {
      sockRef.current?.disconnect();
      sockRef.current = null;
      setSocket(null);
      console.log("[Socket] Disconnected");
    };
  }, [url]);

  return socket;
}
