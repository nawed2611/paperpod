import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ChevronLeftCircle, File } from "lucide-react";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import PdfRenderer from "@/components/PdfRenderer";
import ChatWrapper from "@/components/chat/ChatWrapper";
import PaperSummary from "@/components/upload/PaperSummary";
import UploadedPapers from "@/components/upload/UploadedPapers";

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=upload/${fileid}`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();

  const plan = await getUserSubscriptionPlan();

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="flex flex-col">
          <div className="flex h-16 w-full px-2">
            <Link href="/upload" className="relative left-1 flex items-center">
              <ChevronLeftCircle className="size-5 shrink-0 hover:fill-primary hover:text-primary-foreground" />
            </Link>

            <div className="flex w-[calc(100%-1.75rem)] flex-row items-center justify-center px-2 font-semibold">
              <File className="mr-1 size-[1.125rem] shrink-0" />
              <span className="truncate text-lg">
                {file.name?.replace(".pdf", "")}
              </span>
            </div>
          </div>

          <Separator />

          <PaperSummary fileId={fileid} />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="flex h-full flex-col items-center">
          {fileid && <PdfRenderer url={file.url} feature="upload" />}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={35} minSize={25}>
        <ChatWrapper fileId={fileid} isSubscribed={plan.isSubscribed} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
