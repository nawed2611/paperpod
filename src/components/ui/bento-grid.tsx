"use client";

import { BookOpen, CircleStopIcon, Loader2, LucideStopCircle, MonitorStop, PlayCircle, PlayIcon, StopCircleIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import AudioPlayer from "../podcast/AudioPlayer";
import MarkdownComponent from "../MarkdownComponent";
import { useState } from "react";
import ReactHowler from "react-howler";
import { StopIcon } from "@radix-ui/react-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  header,
  date,
  description,
  isPlaying,
  setIsPlaying,
  podcastUrl,
  sample = false,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  date?: string;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  podcastUrl?: string;
  sample?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [audioId, setAudioId] = useState<number | null>(null); // Individual audioId state for each BentoGridItem

  const handlePlay = () => {
    if (audioId !== id) {
      // Stop the currently playing podcast, if any
      if (audioId !== null) {
        setIsPlaying(false);
        setAudioId(null); // Clear the audioId to indicate no podcast is playing
      }
      // Start the clicked podcast
      setAudioId(id);
      setIsPlaying(true);
    } else {
      // Toggle play/pause if clicking the same podcast
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <div
      className={cn(
        'group/bento row-span-2 flex  flex-col justify-between space-y-4 text-sm shadow-input transition duration-500',
        {
          'size-72': sample,
        },
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4 rounded-xl">
        <div className="transition duration-200 ">
          <div className="my-2 font-serif text-xl text-primary/80">
            <MarkdownComponent content={title as string} />
          </div>
        </div>
      </div>
      <p className="italic text-muted-foreground">{header}, {date}</p>

      {sample && (
        <div className="relative">
          <Button
            onClick={handlePlay}
            className={cn("absolute bottom-2 right-2 items-center gap-2 rounded-full bg-accent text-sm text-muted-foreground transition-all duration-500 hover:bg-gradient-to-r hover:from-green-400 hover:to-green-100 hover:text-green-600",
              {
                'hidden': !isHovered,
              }
            )}
          >
            {!isPlaying || audioId !== id ? (
              <PlayIcon className="size-4 transition-all duration-500 hover:scale-110" strokeWidth={1.5} />
            ) : (
              <StopIcon className="size-4 transition-all duration-500 hover:scale-110" strokeWidth={1.5} />
            )}
          </Button>
        </div>
      )}

      {
        isPlaying && audioId === id && (
          <ReactHowler
            playing={isPlaying}
            onLoad={() => { }}
            onEnd={() => {
              setIsPlaying(false);
              setAudioId(null);
            }}
            onPause={() => setIsPlaying(false)}
            src={podcastUrl as string}
          />
        )
      }
    </div >
  );
};
