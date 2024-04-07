"use client";

import { ScrollArea } from "../ui/scroll-area";

interface PaperSummaryProps {
  fileId: string;
}

const PaperSummary = ({ fileId }: PaperSummaryProps) => {
  return (
    <div>
      <ScrollArea className="h-[calc(100vh-4rem)] w-full p-2">
        {/* <Button
          onClick={() => getSummary("Give a detailed summary of the paper.")}
        >
          Summary
        </Button>
        {summary} */}
        {/* {summary} */}
      </ScrollArea>
    </div>
  );
};

export default PaperSummary;
