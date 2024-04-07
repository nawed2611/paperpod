import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export default function HandleSearchMethod() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearchMethod(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("method", term);
    } else {
      params.delete("method");
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="flex h-12 w-full flex-row items-center justify-evenly gap-x-1 rounded-full bg-muted p-1 text-muted-foreground">
      <button
        className={cn(
          "h-10 w-[50%] items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-semibold ring-offset-background transition-all duration-300 ease-in-out hover:bg-background/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
          searchParams.get("method")?.toString() !== "semantic" &&
          "bg-background text-foreground shadow-sm"
        )}
        onClick={() => {
          handleSearchMethod("");
        }}
        disabled={searchParams.get("method")?.toString() !== "semantic"}
      >
        Keyword Search
      </button>
      <button
        className={cn(
          "h-10 w-[50%] items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-semibold ring-offset-background transition-all duration-300 ease-in-out hover:bg-background/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
          searchParams.get("method")?.toString() === "semantic" &&
          "bg-background text-foreground shadow-sm"
        )}
        onClick={() => {
          handleSearchMethod("semantic");
        }}
        disabled={searchParams.get("method")?.toString() === "semantic"}
      >
        Semantic Search
      </button>
    </div>
  );
}
