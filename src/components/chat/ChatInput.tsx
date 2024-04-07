import { useContext, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { Grid } from "react-loader-spinner";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea2";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative bottom-1 flex w-full items-center justify-center space-x-2">
      <Textarea
        rows={2}
        ref={textareaRef}
        // maxRows={2}
        autoFocus
        onChange={handleInputChange}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (message) addMessage();

            textareaRef.current?.focus();
          }
        }}
        placeholder="Enter your question..."
        className="scrollbar-thumb-blue scrollbar-track-blue-lighter scrolling-touch resize-none text-base scrollbar-thumb-rounded scrollbar-w-2"
      />

      <Button
        disabled={isLoading || isDisabled || !message}
        aria-label="send message"
        onClick={() => {
          addMessage();

          textareaRef.current?.focus();
        }}
        className="items-center justify-center bg-green-600 px-2.5 text-zinc-200"
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <Send className="size-5" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
