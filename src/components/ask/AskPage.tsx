"use client";

import { Key, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { ArrowRight, Loader2, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea2";

import MarkdownComponent from "../MarkdownComponent";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const AskPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleTextareaChange(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const [question, setQuestion] = useState<string>(
    searchParams.get("q")?.toString()!
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>([]);

  const fetchAnswer = async (question: string) => {
    handleTextareaChange(question);

    setResponse([]);
    setLoading(true);
    axios
      .post("https://paperbrain-00fdfdd50196.herokuapp.com/ask-arxiv", {
        question,
      })
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const handleAskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (question) {
      fetchAnswer(question);
    }
  };

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (question) {
        fetchAnswer(question);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pb-3 pt-5 text-2xl font-semibold tracking-tighter text-transparent">
          Explore the scientific literature with PaperPod.
        </h1>

        <form className="relative" onSubmit={handleAskSubmit}>
          <Textarea
            className="h-[25vh] w-[60vw] resize-none p-4 text-base shadow-xl dark:shadow dark:shadow-primary/20"
            placeholder="Ask a research question..."
            value={question}
            onKeyDown={handleTextareaKeyDown}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            className="absolute bottom-5 right-5 h-auto rounded-full p-2 shadow-lg"
            type="submit"
            disabled={!question || loading}
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ArrowRight className="size-5" />
            )}
          </Button>
        </form>
        {loading && (
          <div className="w-[60vw] py-3">
            <div className="flex flex-row items-center">
              <span className="relative m-3 flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-primary/70"></span>
              </span>
              <span className="text-primary/80">
                Searching all the arXiv papers
              </span>
            </div>
          </div>
        )}

        {response.length !== 0 && (
          <div className="w-[60vw] py-3">
            <h1 className="self-start pb-3 pt-4 text-lg font-medium">
              Answer:
            </h1>
            <h1 className="text-pretty text-[15px] text-primary/90">
              <MarkdownComponent content={response?.answer} />
            </h1>
            <h1 className="self-start pt-5 text-lg font-medium">References:</h1>
            <div className="space-y-4 py-4">
              {response?.citation?.map((reference: any, index: Key) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {reference?.title}
                    </CardTitle>
                    <div className="flex flex-row space-x-4 text-sm/relaxed text-muted-foreground">
                      <UsersRound className="size-5 shrink-0" />
                      <ScrollArea>
                        <div className="flex w-max space-x-5 pb-2">
                          {reference?.authors?.map(
                            (author: any, index: Key) => (
                              <span key={index}>{author?.name} </span>
                            )
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  </CardHeader>
                  <CardContent className="text-justify text-sm">
                    <MarkdownComponent content={reference?.abstract} />
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={reference?.pdfurl}
                      className={cn(buttonVariants(), "h-9 rounded-full")}
                    >
                      View PDF
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* <Button
        className="fixed bottom-5 right-9 h-auto rounded-full p-2 shadow-lg"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUp className="size-5" />
      </Button> */}
    </div>
  );
};

export default AskPage;
