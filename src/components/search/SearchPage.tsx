"use client";

import { Key, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BookOpen, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { PaperProps } from "@/types/paper";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chatbot from "@/components/search/Chatbot";
import SearchQuery from "@/components/search/SearchQuery";

import MarkdownComponent from "../MarkdownComponent";
import PdfRenderer from "../PdfRenderer";
import { Button } from "../ui/button";
import SemanticSearchQuery from "./SemanticSearchQuery";
import HandleSearchMethod from "./handle-search-method";
import { inspirations, semanticQueries } from "./search-items";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearchMethod(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("method", term);
    } else {
      params.delete("method");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const [input, setInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const [activePaper, setActivePaper] = useState<boolean>(false);
  const [paperSelected, setPaperSelected] = useState<PaperProps | null>(null);
  const [isFirstClick, setIsFirstClick] = useState<boolean>(false);

  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [paperID, setPaperID] = useState<string>("");
  const [paperURL, setPaperURL] = useState<string>("");

  const [showInspiration, setShowInspiration] = useState<boolean>(false);

  const [activeInspiration, setActiveInspiration] = useState<any>({
    topic: "",
    subtopics: [],
  });

  const [activeSubtopic, setActiveSubtopic] = useState<string>("");

  const [refPageNum, setRefPageNum] = useState<number>(0);

  const handleClick = (paper: PaperProps) => {
    setOpenPDF(false);
    setPaperID("");
    setPaperURL("");
    setActivePaper(true);
    setPaperSelected(paper);
    setIsFirstClick(true);
  };

  const viewPDF = () => {
    setOpenPDF(true);

    let id = paperSelected?.id.split("/").pop();

    setPaperURL(`https://export.arxiv.org/pdf/${id}.pdf`);

    axios
      .post("https://paperbrain.onrender.com/indexpaper", {
        paperurl: `https://arxiv.org/pdf/${id}.pdf`,
      })
      .then((res) => {
        setPaperID(res.data.paper_id);
        if (isFirstClick) {
          toast.success("Research Paper indexed successfully!");
          setIsFirstClick(false);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Research paper could not be indexed!");
      });
  };

  const handlePDFClose = () => {
    setOpenPDF(false);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={20}>
        {searchParams.get("method")?.toString() === "semantic" ? (
          <SemanticSearchQuery
            query={query}
            setQuery={setQuery}
            handleClick={handleClick}
            paperSelected={paperSelected}
          />
        ) : (
          <SearchQuery
            input={input}
            setInput={setInput}
            handleClick={handleClick}
            paperSelected={paperSelected}
          />
        )}
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={45} minSize={30}>
        <div className="flex flex-col items-center">
          {paperSelected && activePaper && !openPDF && (
            <div className="px-4 pb-2 pt-4">
              <div className="flex flex-row justify-between">
                <Button
                  onClick={viewPDF}
                  variant="secondary"
                  className="mx-4 h-8"
                >
                  View PDF <BookOpen className="ml-2 size-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-6 px-1"
                  variant="ghost"
                  onClick={() => {
                    setPaperSelected(null);
                    setActivePaper(false);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <ScrollArea className="my-2 h-[calc(100vh-5rem)] overflow-auto px-4">
                <h1 className="self-start pb-2 text-justify text-[16px] font-semibold">
                  <MarkdownComponent content={paperSelected?.title} />
                </h1>

                <div className="pb-2 text-[13px]">
                  <span className="text-sm font-medium underline">
                    Categories:
                  </span>
                  <br />

                  {paperSelected?.categories.map(
                    (category: string, index: Key) => (
                      <div key={index} className="inline-flex py-2">
                        <div className="mr-2 rounded-3xl bg-accent px-3 py-1">
                          {category}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <p className="text-[13px]">
                  <span className="text-sm font-medium underline">
                    Authors:
                  </span>
                  <br />
                  {paperSelected?.authors}
                </p>
                <div className="pt-2 text-[13px]">
                  <span className="text-sm font-medium underline">
                    Abstract:
                  </span>
                  <br />
                  <MarkdownComponent content={paperSelected?.summary} />
                </div>
              </ScrollArea>
            </div>
          )}
          {openPDF && (
            <PdfRenderer
              url={paperURL}
              handlePDFClose={handlePDFClose}
              feature="search"
              refPageNum={refPageNum}
            />
          )}
          {!activePaper && !openPDF && (
            <div className="px-4 pt-3">
              <HandleSearchMethod />

              <div className="px-2">
                <h1 className="self-start bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 font-semibold text-transparent">
                  An interface to explore research.
                </h1>

                <div className="py-2">
                  {searchParams.get("method")?.toString() === "semantic" ? (
                    <div className="flex flex-col space-y-2 py-2">
                      <h1 className="font-medium">Search semantically</h1>
                      <p className="text-justify text-sm text-muted-foreground">
                        Enter query in layman terms and find the most relevant
                        research papers.
                      </p>

                      <p className="text-justify text-sm text-muted-foreground">
                        Apply filters by categories and years for precision.
                      </p>

                      <div className="space-x-2 space-y-2 py-2 text-center">
                        {semanticQueries.map((semanticQuery, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="rounded-3xl"
                            onClick={() => setQuery(semanticQuery)}
                          >
                            {semanticQuery}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 py-2">
                      <p className="text-pretty pb-2 text-sm">
                        People publish a lot of fascinating research out to the
                        world, yet the tools to consume this research are quite
                        primitive. This is an interface optimized for
                        exploration: please wander about topics and papers to
                        your brain&apos;s content.
                      </p>
                      {showInspiration ? (
                        <div className="flex flex-row space-x-4">
                          <div>
                            <h1 className="px-2 text-sm text-primary/70">
                              Select a topic...
                            </h1>
                            <ul className="w-44 py-2">
                              {inspirations?.map((inspiration, index) => (
                                <li
                                  key={index}
                                  className={cn(
                                    "cursor-pointer rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/60",
                                    activeInspiration.topic ===
                                    `${inspiration.topic}` &&
                                    "bg-accent text-primary/75 hover:bg-accent"
                                  )}
                                  onClick={() =>
                                    setActiveInspiration(inspiration)
                                  }
                                >
                                  {inspiration.topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {activeInspiration.topic && (
                            <div>
                              <h1 className="px-2 pb-2 text-sm text-primary/70">
                                A tiny subset of topics:
                              </h1>
                              <ScrollArea className="h-[calc(100vh-18rem)] overflow-y-auto">
                                <ul className="w-[13.5rem] pr-4">
                                  {activeInspiration.subtopics?.map(
                                    (subtopic: string, subIndex: Key) => (
                                      <li
                                        key={subIndex}
                                        className={cn(
                                          "cursor-pointer rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/60",
                                          activeSubtopic === `${subtopic}` &&
                                          "bg-accent text-primary/75 hover:bg-accent"
                                        )}
                                        onClick={() => {
                                          setInput(subtopic);
                                          setActiveSubtopic(subtopic);
                                        }}
                                      >
                                        {subtopic}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </ScrollArea>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="inline-flex cursor-pointer items-center space-x-2 text-sm text-muted-foreground hover:text-[#03E429]"
                          onClick={() => setShowInspiration(true)}
                        >
                          <Sparkles className="size-4" />

                          <h1>Need some inspiration?</h1>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={30} minSize={20}>
        <Chatbot paperId={paperID} setRefPageNum={setRefPageNum} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SearchPage;
