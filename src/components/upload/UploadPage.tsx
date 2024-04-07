"use client";

import { ChevronDownCircle } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";

import ChatUI from "./ChatUI";
import UploadButton from "./UploadButton";
import UploadedPapers from "./UploadedPapers";

interface Props {
  isSubscribed: boolean;
}

const UploadPage = ({ isSubscribed }: Props) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="flex flex-col">
          <div className="flex h-16 flex-row items-center justify-center px-1 font-semibold">
            <span className="text-lg">Uploaded Papers</span>
            <ChevronDownCircle className="ml-2 size-5" />
          </div>

          <Separator />

          <UploadedPapers />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="flex flex-col items-center px-4 pt-6">
          <div>
            <div className="mx-12">
              <UploadButton isSubscribed={isSubscribed} />
            </div>
            <div className="px-4 py-6">
              <h1 className="self-start bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text py-4 font-semibold text-transparent">
                An interface to upload pdfs and research papers.
              </h1>
              <p>
                People publish a lot of fascinating research out to the world,
                yet the tools to consume this research are quite primitive. This
                is an interface optimized for exploration: please wander about
                topics and papers to your brain&apos;s content.
              </p>
            </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={35} minSize={25}>
        <ChatUI>
          <></>
        </ChatUI>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default UploadPage;
