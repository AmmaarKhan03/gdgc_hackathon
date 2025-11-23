import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../../../../../Downloads/peerpath_patch/client_snippets/src/lib/api";

type Message = {
  id?: number;
  room?: string;
  body: string;
  createdAt: string;
  sender: { fullName: string; email: string };
};

export function useChat(room: string, me: { name: string; email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket: Socket = useMemo(() => io(import.meta.env.VITE_API_URL || "http://localhost:4000"), []);

  useEffect(() => {
    socket.emit("joinRoom", room);
    api.get<Message[]>("/messages", { params: { room } }).then((res) => setMessages(res.data));
    socket.on("receiveMessage", (m: Message) => {
      if ((m as any).room === room) setMessages((prev) => [...prev, m]);
    });
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [room]);

  const send = (body: string) => {
    socket.emit("sendMessage", { room, body, senderEmail: me.email, senderName: me.name });
  };

  return { messages, send };
}
