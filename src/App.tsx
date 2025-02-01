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
  text: any;
  sender: "user" | "other";
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();

        reader.onload = () => {
          setMessages(prevMessages => [...prevMessages, {text: reader.result, sender: "other"}]);
        };

        reader.readAsText(event.data);
    } 
      
    }

    return () => {
      ws.current?.close();
    }
  }, [])

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(inputMessage);
      setMessages([...messages, {text: inputMessage, sender: "user"}])
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
            {messages.map((message, idx) => (
              <div
                key={idx}
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
