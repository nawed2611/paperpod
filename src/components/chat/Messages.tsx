import { useContext, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { Loader2, MessageSquare, User } from "lucide-react";

import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/app/_trpc/client";

import { ChatContext } from "./ChatContext";
import Message from "./Message";

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="flex h-[calc(100vh-11rem)] w-full flex-1 flex-col-reverse gap-4 overflow-y-auto pr-4 scrollbar-thin">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                key={message.id}
              />
            );
          } else
            return (
              <Message
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                key={message.id}
              />
            );
        })
      ) : isLoading ? (
        <>
          <div className="flex items-end justify-end">
            <Skeleton className="order-2 size-6" />

            <div className="order-1 mx-2 flex max-w-md flex-col items-end">
              <Skeleton className="h-10 w-[250px]" />
            </div>
          </div>
          <div className="flex items-end">
            <Skeleton className="order-1 size-6" />

            <div className="order-2 mx-2 flex max-w-md flex-col items-start">
              <Skeleton className="h-10 w-[250px]" />
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Skeleton className="order-2 size-6" />

            <div className="order-1 mx-2 flex max-w-md flex-col items-end">
              <Skeleton className="h-10 w-[250px]" />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageSquare className="size-8 text-green-500" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
