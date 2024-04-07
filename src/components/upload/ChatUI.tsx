"use client";

import { ReactNode } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea2";

export default function ChatUI({ children }: { children: ReactNode }) {
  return (
    <div className="size-full">
      <CardHeader className="h-16 pt-4">
        <CardTitle className="text-lg"><h1 className="m-4 flex items-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 text-center font-sans text-xl font-semibold tracking-tighter text-transparent">
        PaperPod Assistant
        </h1></CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="h-[calc(100vh-11rem)]">{children}</div>
      </CardContent>
      <CardFooter>
        <div className="relative bottom-1 flex w-full items-center justify-center space-x-2">
          <Textarea
            rows={2}
            placeholder="Enter your question..."
            className="resize-none text-base scrollbar-thin"
            disabled
          />

          <Button
            disabled
            aria-label="send message"
            className="items-center justify-center bg-green-600 px-2.5 text-zinc-200"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </CardFooter>
    </div>
  );
}
