import * as Dialog from "@radix-ui/react-dialog";
import React, { useState, useEffect } from "react";
import "../Style.css";
import frameImg from "../assets/images/Frame-03.png";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // const initialMsgs = ["Hi", "Have any questions? Ask away!"];

  // useEffect(() => {
  //   if (open) {
  //     const timer = setTimeout(() => {
  //       setIsLoading(false);
  //       // setMsg(initialMsgs);
  //     }, 2500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [open, hasOpened]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMsg(initialMsgs);
  //   }, 3600);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleInputMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMsg(e.target.value);
  };

  const sendMessage = async () => {
    if (!inputMsg.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMsg.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg("");
    setIsLoading(true);

    try {
      // Use Vite proxy in development, direct API in production
      const apiUrl = import.meta.env.DEV
        ? "/api"
        : "https://chatwithproperties-gubv3xkt6q-uc.a.run.app/";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      console.log("API Response:", data); // For debugging

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          data.reply ||
          data.message ||
          data.response ||
          "Sorry, I could not process your request.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          style={{
            backgroundImage: `url(${frameImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="fixed bottom-6 text-md font-semibold  w-[200px] right-6 z-50 rounded-lg p-3 text-black shadow-lg transition-transform hover:scale-105 outline-none"
        >
          Talk with our Agent
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed outline-none bottom-6 right-6 z-50 h-[450px] w-[350px] animate-fade-in-up-custom rounded-lg bg-white shadow-xl">
          <div className="flex h-full flex-col">
            <div
              style={{
                backgroundImage: `url(${frameImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className="flex items-center justify-between rounded-t-lg bg-gray-800 p-4 text-white"
            >
              <h2 className="text-lg font-bold">Send us a message</h2>
              <Dialog.Close asChild>
                <button
                  className="rounded-full outline-none p-1 transition-colors hover:scale-110"
                  aria-label="Close"
                >
                  <p className="h-4 w-4 text-sm flex items-center justify-center">
                    X
                  </p>
                </button>
              </Dialog.Close>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-200 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg p-3 rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* New location for the typing indicator */}
            {/* {isLoading && (
              <div className="p-4">
                <div className="typing-indicator p-3 mb-[-20px] rounded-lg w-fit">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )} */}

            <div className="flex items-center border-t border-gray-200 p-4">
              <input
                value={inputMsg}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    sendMessage();
                  }
                }}
                onChange={handleInputMsg}
                type="text"
                placeholder="Type here"
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-yellow-900 focus:outline-none disabled:opacity-50"
              />
              <button
                className="ml-2 rounded-full bg-blue-600 p-2 text-white disabled:opacity-50"
                onClick={sendMessage}
                disabled={isLoading || !inputMsg.trim()}
                style={{
                  backgroundImage: `url(${frameImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 rotate-90"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l4.538-1.815a1 1 0 01.832-.086l7.85-2.355a1 1 0 00.33-1.638l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChatWidget;
