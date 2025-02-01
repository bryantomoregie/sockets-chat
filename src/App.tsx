import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      console.log( event.data.toString())
      setMessages(prevMessages => [...prevMessages, event.data.toString()]);
    }

    return () => {
      ws.current?.close();
    }
  }, [])

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(inputMessage);
      setInputMessage("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chat App</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] p-4 rounded-md border">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-full space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
