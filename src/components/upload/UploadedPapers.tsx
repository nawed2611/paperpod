"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { File, Ghost, Loader2, Plus, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/app/_trpc/client";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const UploadedPapers = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      {files && files?.length !== 0 ? (
        <ul>
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li key={file.id} className="w-full text-sm">
                <div className="flex flex-row items-center justify-between">
                  <Link
                    href={`/upload/${file.id}`}
                    className="flex w-full flex-col space-y-2 border-r-[1.5px] border-primary/40 p-3 hover:bg-accent"
                  >
                    <div className="inline-flex items-center gap-x-3 pl-2">
                      <File className="size-4" />
                      <h3 className="max-w-40 truncate font-medium">
                        {file.name?.replace(".pdf", "")}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-x-3 pl-2 text-xs text-muted-foreground">
                      <Plus className="size-4" />{" "}
                      {format(new Date(file.createdAt), "dd MMM yyyy")}
                    </div>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex h-[4.25rem] w-16 cursor-pointer items-center justify-center text-destructive hover:bg-destructive hover:text-secondary">
                        <Trash className="size-6" />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your paper and remove your chats from our
                          server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteFile({ id: file.id })}
                        >
                          {currentlyDeletingFile === file.id ? (
                            <span className="inline-flex items-center">
                              <Loader2 className="size-5 animate-spin" />
                              Deleting...
                            </span>
                          ) : (
                            <span className="inline-flex items-center">
                              Delete
                              <Trash className="ml-2 size-4 text-red-500" />
                            </span>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Separator />
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton className="my-2" />
      ) : (
        <div className="mx-auto mt-16 flex flex-col items-center gap-2">
          <Ghost className="size-8" />
          <h3 className="text-lg font-semibold">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </ScrollArea>
  );
};

export default UploadedPapers;
