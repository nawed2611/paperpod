"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BookOpen, Loader2, Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Textarea } from "../ui/textarea2";

interface Message {
  content: string;
  role: string;
}

interface ChatProps {
  paperId: string;
  setRefPageNum: React.Dispatch<React.SetStateAction<number>>;
}

export default function Chatbot({ paperId, setRefPageNum }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const scrollAreaRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (paperId == "") {
      setMessages([]);
    }
  }, [paperId]);

  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);

    setLoading(true);
    setInput("");

    axios
      .post("https://paperbrain.onrender.com/explain-new", {
        message: input,
        paper_id: paperId,
      })
      .then((res) => {
        // console.log("res: ", res);
        const answer = res.data.answer;

        // const pages = res.data.page_no;

        // const combinedContent = `${answer}\n\nPages: ${pages.join(", ")}`;

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "paperbrain", content: answer },
        ]);

        setLoading(false);

        textareaRef.current?.focus();
      })
      .catch((err) => {
        console.error(err);

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "paperbrain",
            content:
              "Sorry, There seems to be an error. We know its not ideal.",
          },
        ]);

        setLoading(false);
        textareaRef.current?.focus();
      });
  };

  const handleSimplification = async (output: string) => {
    setLoading(true);

    const convo = `The user uploaded a pdf and asked a question about it and got the response. Here is the response:\n${output}\nNow the response is difficult for the user to understand. So the user wants to simplify the response to get a better understandin. Simplify the response.`;

    const response = await fetch("/api/simplify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation: convo }),
    });

    const data = response.body;
    setLoading(false);

    if (!data) {
      console.log("No data");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "paperbrain",
          content: "Sorry, There seems to be an error. We know its not ideal.",
        },
      ]);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let newChatOutput = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      newChatOutput = newChatOutput + chunkValue;
      setMessages([
        ...messages,
        { role: "paperbrain", content: newChatOutput },
      ]);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="">
      <CardHeader className="flex h-16 flex-row justify-between pt-4">
        <CardTitle className="text-lg"><h1 className="flex items-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 text-center font-sans text-xl font-semibold tracking-tighter text-transparent">
        PaperPod Assistant
        </h1>
          <p className="text-sm font-light text-muted-foreground">
            Chat with your research paper
          </p>
        </CardTitle>
        {paperId && messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => setMessages([])}
          >
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4">
        <div
          ref={scrollAreaRef}
          className="flex h-[calc(100vh-11rem)] w-full flex-1 flex-col gap-4 overflow-y-auto pr-4 scrollbar-thin"
        >
          <>
            {messages.map((message, index) => {
              const isUserMessage = message.role === "user";

              return (
                <div
                  key={index}
                  className={cn("flex items-end", {
                    "justify-end": isUserMessage,
                  })}
                >
                  <div
                    className={cn(
                      "relative flex aspect-square size-6 items-center justify-center",
                      {
                        "order-2 bg-green-600 rounded-sm": isUserMessage,
                        "order-1 bg-zinc-800 rounded-sm": !isUserMessage,
                      }
                    )}
                  >
                    {isUserMessage ? (
                      <User className="size-3/4 fill-zinc-200 text-zinc-200" />
                    ) : (
                      <BookOpen className="size-3/4 fill-zinc-300" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "mx-2 flex max-w-md flex-col space-y-2 text-base",
                      {
                        "order-1 items-end": isUserMessage,
                        "order-2 items-start": !isUserMessage,
                      }
                    )}
                  >
                    <div
                      className={cn(
                        "relative inline-block rounded-lg px-3 py-1",
                        {
                          "bg-green-600 text-white rounded-br-none":
                            isUserMessage,
                          "bg-gray-200 text-gray-900 pr-6 rounded-bl-none":
                            !isUserMessage,
                        }
                      )}
                    >
                      {typeof message.content === "string" ? (
                        <ReactMarkdown
                          className={cn("prose text-[14px]", {
                            "text-zinc-50": isUserMessage,
                          })}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}

                      {/* {typeof message.content === "string" ? (
                        <div>
                          <ReactMarkdown
                            className={cn("prose text-[14px]", {
                              "text-zinc-50": isUserMessage,
                            })}
                          >
                            {message.content.split("\n")[0]}
                          </ReactMarkdown>
                          {!isUserMessage &&
                            message.content.includes("Pages:") && (
                              <div className="space-x-1 py-1">
                                {message.content
                                  .split("Pages:")[1]
                                  .split(",")
                                  .map((page, pageIndex) => (
                                    <button
                                      key={pageIndex}
                                      className="min-h-6 min-w-6 items-center justify-center rounded-full bg-zinc-800 p-1 text-xs text-zinc-200 hover:bg-zinc-700"
                                      onClick={() => {
                                        // handlePageClick(page.trim())
                                        console.log(
                                          "Page: ",
                                          parseInt(page.trim(), 10)
                                        );
                                        setRefPageNum(
                                          parseInt(page.trim(), 10)
                                        );
                                      }}
                                    >
                                      {page.trim()}
                                    </button>
                                  ))}
                              </div>
                            )}
                        </div>
                      ) : (
                        message.content
                      )} */}

                      {!isUserMessage && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="absolute bottom-2 right-2 rounded-full bg-green-700 p-1 text-zinc-200 hover:bg-green-600"
                                onClick={() =>
                                  handleSimplification(message.content)
                                }
                              >
                                <Sparkles className="size-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Simplify</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex items-end">
                <div className="relative flex aspect-square size-6 items-center justify-center rounded-sm bg-zinc-800">
                  <BookOpen className="size-3/4 fill-zinc-300" />
                </div>

                <div className="mx-2 flex max-w-md flex-col items-start space-y-2 text-base">
                  <div className="inline-block rounded-lg rounded-bl-none bg-gray-200 px-3 py-1 text-gray-900">
                    <span className="flex h-full items-center justify-center">
                      <Loader2 className="size-4 animate-spin" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </CardContent>
      <CardFooter className="pb-0">
        <form
          className="relative bottom-1 flex w-full items-center justify-center space-x-2"
          onSubmit={handleSubmit}
        >
          <Textarea
            rows={2}
            ref={textareaRef}
            // maxRows={2}
            autoFocus
            disabled={!paperId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (input) handleSubmit(e);

                textareaRef.current?.focus();
              }
            }}
            placeholder="Enter your question..."
            className="resize-none text-base scrollbar-thin"
          />

          <Button
            disabled={loading || !input || !paperId}
            aria-label="send message"
            className="items-center justify-center bg-green-600 px-2.5 text-zinc-200"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <Send className="size-5" />
              </>
            )}
          </Button>
        </form>
      </CardFooter>
    </div>
  );
}
