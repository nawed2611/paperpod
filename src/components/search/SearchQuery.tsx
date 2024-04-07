import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

import { PaperProps } from "@/types/paper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import MarkdownComponent from "../MarkdownComponent";

interface SearchQueryProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleClick: (paper: PaperProps) => void;
  paperSelected: PaperProps | null;
}

const SearchQuery = ({
  input,
  setInput,
  handleClick,
  paperSelected,
}: SearchQueryProps) => {
  const [response, setResponse] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState<string>("relevance");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);

      if (input.length == 0) {
        setResponse([]);
        setLoading(false);
        return;
      }

      fetch("/api/arxiv-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setResponse(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Fetch error:", error);
        });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  const handlePaperSorting = (sortBy: string) => {
    setLoading(true);
    setActive(sortBy);
    fetch("/api/arxiv-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input, sortBy }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Fetch error:", error);
      });
  };

  return (
    <div className="flex flex-col items-start">
      <div className="h-[5.5rem] w-full p-2">
        <div className="inline-flex w-full gap-x-1 rounded-md border border-accent shadow-md dark:shadow-md dark:shadow-muted">
          <Button
            disabled
            variant="ghost"
            className="pl-2.5 pr-1 hover:bg-inherit"
          >
            <SearchIcon width={15} height={15} />
          </Button>
          <input
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search papers"
            className="w-full rounded-r-md bg-inherit px-1 text-sm outline-none"
          />
          {loading && (
            <div className="flex items-center justify-center px-2 text-emerald-600">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="size-5 animate-spin"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
              </svg>
            </div>
          )}
        </div>
        {response.length > 0 && (
          <div className="flex flex-row justify-between px-2.5 pt-2.5 text-xs">
            <div className="py-0.5">Sort By</div>
            <div className="inline-flex gap-x-1">
              <button
                className={`${
                  active == "relevance"
                    ? "bg-zinc-200 dark:bg-zinc-500"
                    : "hover:text-muted-foreground"
                } rounded-full px-2 py-0.5`}
                onClick={() => handlePaperSorting("relevance")}
                disabled={active == "relevance"}
              >
                Relevance
              </button>
              <button
                className={`${
                  active == "lastUpdatedDate"
                    ? "bg-zinc-200 dark:bg-zinc-500"
                    : "hover:text-muted-foreground"
                } rounded-full px-2 py-0.5`}
                onClick={() => handlePaperSorting("lastUpdatedDate")}
                disabled={active == "lastUpdatedDate"}
              >
                Most Recent
              </button>
            </div>
          </div>
        )}
      </div>
      {response.length > 0 && <Separator />}
      <ScrollArea className={cn("h-[calc(100vh-5.5rem)] w-full")}>
        {response && response.length !== 0 && (
          <ul>
            {response.map((paper) => (
              <li
                key={paper.id}
                onClick={() => handleClick(paper)}
                className={cn(
                  "w-full cursor-pointer text-sm hover:bg-accent",
                  paperSelected == paper &&
                    "border-r-2 border-sky-500 bg-accent"
                )}
              >
                <div className="flex flex-col space-y-1 p-3">
                  <h1 className="text-sm">
                    <MarkdownComponent content={paper.title} />
                  </h1>
                  <h3 className="text-[13px] text-muted-foreground">
                    {paper.date}
                  </h3>
                </div>
                <Separator />
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default SearchQuery;
