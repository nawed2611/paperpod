"use client";

import Link from "next/link";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

import { PLANS } from "@/config/stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/app/_trpc/client";

import { Button, buttonVariants } from "../ui/button";
import ChatUI from "../upload/ChatUI";
import { ChatContextProvider } from "./ChatContext";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

interface ChatWrapperProps {
  fileId: string;
  isSubscribed: boolean;
}

const ChatWrapper = ({ fileId, isSubscribed }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading)
    return (
      <ChatUI>
        <div className="flex flex-col items-center gap-2 pt-12">
          <Loader2 className="size-6 animate-spin" />
          <h3 className="text-xl font-medium">Loading...</h3>
          <p className="text-sm text-zinc-500">
            We&apos;re preparing your PDF.
          </p>
        </div>
      </ChatUI>
    );

  if (data?.status === "PROCESSING")
    return (
      <ChatUI>
        <div className="flex flex-col items-center gap-2 pt-12">
          <Loader2 className="size-6 animate-spin" />
          <h3 className="text-xl font-medium">Processing PDF...</h3>
          <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
        </div>
      </ChatUI>
    );

  if (data?.status === "FAILED")
    return (
      <ChatUI>
        <div className="flex flex-col items-center gap-2 pt-12">
          <XCircle className="size-6 text-red-500" />
          <h3 className="text-xl font-medium">Too many pages in PDF</h3>
          <p className="text-sm text-zinc-500">
            Your{" "}
            <span className="font-medium">{isSubscribed ? "Pro" : "Free"}</span>{" "}
            plan supports up to{" "}
            {isSubscribed
              ? PLANS.find((p) => p.name === "Pro")?.pagesPerPdf
              : PLANS.find((p) => p.name === "Free")?.pagesPerPdf}{" "}
            pages per PDF.
          </p>
        </div>
      </ChatUI>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="size-full">
        <CardHeader className="h-16 pt-4">
          <CardTitle className="text-lg"><h1 className="flex items-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 text-center font-sans text-xl font-semibold tracking-tighter text-transparent">
            PaperPod Assistant
          </h1>
            <p className="text-sm font-light text-muted-foreground">
              Chat with your research paper
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <Messages fileId={fileId} />
        </CardContent>
        <CardFooter>
          <ChatInput />
        </CardFooter>
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
