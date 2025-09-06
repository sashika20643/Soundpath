import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useChat } from "@/hooks/use-chat";
import ReactMarkdown from "react-markdown";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-100 md:w-96">
          <Card className="shadow-xl border border-border/10 bg-background/95 backdrop-blur-lg">
            {/* Header */}
            <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      Music Travel Assistant
                    </h3>
                    <p className="text-xs opacity-80">
                      {isLoading ? "Typing..." : "Online now"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-background/20 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {/* Render Markdown safely */}
                      <div
                        className={`prose prose-sm max-w-none break-words ${
                          message.isUser ? "prose-invert" : ""
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p {...props} className="mb-2" />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul {...props} className="list-disc pl-5 mb-2" />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                {...props}
                                className="list-decimal pl-5 mb-2"
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li {...props} className="mb-1" />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  {...props}
                                  className="bg-gray-200 px-1 rounded"
                                />
                              ) : (
                                <pre className="bg-gray-900 text-gray-100 p-2 rounded-lg overflow-x-auto">
                                  <code {...props} />
                                </pre>
                              ),
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>

                      <p
                        className={`text-xs mt-1 ${
                          message.isUser ? "text-primary-foreground/70" : "text-muted-foreground/70"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
