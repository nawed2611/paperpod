"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import PdfFullScreen from "@/components/PdfFullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
  feature: "search" | "upload";
  refPageNum?: number;
  handlePDFClose?: () => void;
}

const PdfRenderer = ({
  url,
  feature,
  refPageNum,
  handlePDFClose,
}: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const [searchText, setSearchText] = useState<string>("");

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  // console.log(errors)

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  function highlightPattern(text: string, pattern: string): string {
    const regex = new RegExp(pattern, "gi");
    return text.replace(regex, (value) => `<mark>${value}</mark>`);
  }

  const textRenderer = useCallback(
    (textItem: { str: string }) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  return (
    <div className="flex w-full flex-col items-center rounded-md shadow-xl">
      <div className="flex h-12 w-full items-center justify-end border px-2 shadow-xl">
        {/* <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
              setValue("page", String(currPage - 1))
            }}
            variant="ghost"
            size="sm"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "h-6 w-12",
                errors.page
                  ? "focus-visible:ring-red-500"
                  : "focus-visible:ring-muted-foreground"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)()
                }
              }}
            />
            <p className="space-x-1 text-sm text-muted-foreground">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              )
              setValue("page", String(currPage + 1))
            }}
            variant="ghost"
            size="sm"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div> */}

        <div className="flex flex-row items-center space-x-2">
          <Input
            type="search"
            id="search"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            className="h-8"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-1.5"
                aria-label="zoom"
                variant="ghost"
                size="sm"
              >
                <Search className="size-4" />
                {scale * 100}%
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            size="sm"
            aria-label="rotate 90 degrees"
          >
            <RotateCw className="size-4" />
          </Button>

          <PdfFullScreen fileUrl={url} />

          {feature === "search" && (
            <Button variant="ghost" size="sm" onClick={handlePDFClose}>
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="size-full flex-1">
        <div ref={ref}>
          <Document
            className="h-[calc(100vh-3rem)] overflow-auto"
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 size-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast.error("Error loading PDF. Please try again later");
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            file={url}
          >
            {isLoading && renderedScale ? (
              <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + renderedScale}
              />
            ) : null}

            {/* <Page
              className={cn(isLoading ? "hidden" : "")}
              width={width ? width : 1}
              pageNumber={currPage}
              scale={scale}
              rotate={rotation}
              key={"@" + scale}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onRenderSuccess={() => setRenderedScale(scale)}
            /> */}

            {new Array(numPages).fill(0).map((_, i) => (
              <Page
                className={cn(isLoading ? "hidden" : "")}
                key={i}
                width={width ? width : 1}
                // pageNumber={refPageNum === i + 1 ? refPageNum : i + 1}
                pageNumber={i + 1}
                scale={scale}
                rotate={rotation}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 size-6 animate-spin" />
                  </div>
                }
                customTextRenderer={textRenderer}
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
