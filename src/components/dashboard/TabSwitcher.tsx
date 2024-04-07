"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const tabs = ["Uploaded Papers", "Viewed Papers", "Starred Papers"];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TabSwitcherProps extends PopoverTriggerProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function TabSwitcher({
  className,
  selectedTab,
  setSelectedTab,
}: TabSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showNewTabDialog, setShowNewTabDialog] = useState(false);

  return (
    <Dialog open={showNewTabDialog} onOpenChange={setShowNewTabDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a tab"
            className={cn("w-[220px] justify-between", className)}
          >
            <Avatar className="mr-3 size-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTab}.png`}
                alt={selectedTab}
              />
            </Avatar>
            {selectedTab}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandList>
              {tabs.map((tab) => (
                <CommandGroup>
                  <CommandItem
                    key={tab}
                    onSelect={() => {
                      setSelectedTab(tab);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    {tab}
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        selectedTab === tab ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
