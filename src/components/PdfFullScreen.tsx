import { useState } from "react";
import { Expand, Loader2 } from "lucide-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface PdfFullscreenProps {
  fileUrl: string;
}

const PdfFullScreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          aria-label="fullscreen"
        >
          <Expand className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[95%] w-full max-w-[95%] flex-1 scrollbar-thin scrollbar-track-inherit scrollbar-thumb-accent scrollbar-corner-accent scrollbar-thumb-rounded">
        <div ref={ref} className="h-full overflow-auto">
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 size-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast("Error loading PDF. Please try again later");
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            file={fileUrl}
            className="max-h-full"
          >
            {new Array(numPages).fill(0).map((_, i) => (
              <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
            ))}
          </Document>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
