import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { ChevronDown, Loader2, SearchIcon, Triangle } from "lucide-react";
import { useTheme } from "next-themes";
import makeAnimated from "react-select/animated";

import { PaperProps } from "@/types/paper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import MarkdownComponent from "../MarkdownComponent";
import { categoryOptions, yearOptions } from "./search-items";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface SearchQueryProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleClick: (paper: PaperProps) => void;
  paperSelected: PaperProps | null;
}

const SemanticSearchQuery = ({
  query,
  setQuery,
  handleClick,
  paperSelected,
}: SearchQueryProps) => {
  const [response, setResponse] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedYears, setSelectedYears] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const animatedComponents = makeAnimated();

  const { theme } = useTheme();

  const handleShowFilter = (e: any) => {
    e.preventDefault();
    setShowFilter(!showFilter);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setResponse([]);
    setLoading(true);

    const categories = selectedCategories.join(" ");

    const years = selectedYears.join(" ");

    axios
      .post("/api/semantic-search", { query, categories, years })
      .then((res) => {
        setResponse(res.data);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col items-start">
      <div
        className={cn(
          "w-full p-2",
          showFilter ? "h-[11.75rem]" : "h-[6.25rem]"
        )}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-2">
            <div className="inline-flex w-full gap-x-1 rounded-md border border-accent shadow-md">
              <Button
                disabled
                variant="ghost"
                className="pl-2.5 pr-1 hover:bg-inherit"
              >
                <SearchIcon width={15} height={15} />
              </Button>
              <input
                type="text"
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a query"
                className="w-full rounded-r-md bg-inherit px-1 text-sm outline-none"
              />
            </div>

            <div
              className={cn(
                "flex flex-col space-y-0.5 px-1 transition-all ease-in-out",
                !showFilter && "hidden"
              )}
            >
              <Select
                isMulti
                isClearable={false}
                name="categories"
                placeholder="Category"
                options={categoryOptions}
                onChange={(categories: any) =>
                  setSelectedCategories(
                    categories.map((category: any) => category.value)
                  )
                }
                components={animatedComponents}
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                closeMenuOnSelect={false}
              />

              <Select
                isMulti
                isClearable={false}
                name="years"
                placeholder="Year"
                options={yearOptions}
                onChange={(years: any) =>
                  setSelectedYears(years.map((year: any) => year.value))
                }
                components={animatedComponents}
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                closeMenuOnSelect={false}
              />
            </div>

            <div className="mx-auto flex flex-row space-x-4">
              <Button
                size="sm"
                className="h-8"
                disabled={!query || loading}
                type="submit"
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className="h-8"
                onClick={handleShowFilter}
              >
                Filter
                <ChevronDown
                  className={cn(
                    "ml-1 size-4 transition-transform duration-300",
                    showFilter && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Separator />
      <ScrollArea
        className={cn(
          "w-full",
          showFilter ? "h-[calc(100vh-11.75rem)]" : "h-[calc(100vh-6.25rem)]"
        )}
      >
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
                <div className="flex flex-row items-center justify-between p-3">
                  <div className="flex flex-col space-y-1">
                    <h1 className="text-sm">
                      <MarkdownComponent content={paper.title} />
                    </h1>
                    <h3 className="text-[13px] text-muted-foreground">
                      {paper.date}
                    </h3>
                  </div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <h3 className="text-[13px] text-muted-foreground">
                          <Triangle
                            className="size-5"
                            fill={theme === "light" ? "black" : "white"}
                            stroke="none"
                          />
                          {paper.similarity_score}
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Similarity Score</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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

export default SemanticSearchQuery;
