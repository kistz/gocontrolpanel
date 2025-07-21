import clsx from "clsx";
import { Search } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (query: string) => void;
  onValueChange?: (value: string) => void;
  searchResults: { label: string; value: string }[];
  loading?: boolean;
  noResults?: boolean;
  className?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      onValueChange,
      searchResults,
      loading = false,
      noResults = false,
      className,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch(inputValue.trim());
        setIsDropdownOpen(true);
      }
    };

    return (
      <div className="relative w-full">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div className={"relative w-full"}>
              <input
                ref={ref}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onKeyDown={handleEnterKey}
                placeholder={placeholder || "Search..."}
                className={clsx("w-full pr-10", className)}
                {...props}
              />
              <Search
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-full p-0 z-[9999] bg-white shadow-md rounded-md"
            align="start"
          >
            {loading ? (
              <div className="p-2 text-sm text-gray-500">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No results found</div>
            ) : (
              searchResults.map((result) => (
                <DropdownMenuItem
                  key={result.value}
                  onSelect={() => {
                    setInputValue(result.label);
                    setIsDropdownOpen(false);
                    onValueChange?.(result.value);
                  }}
                  className="cursor-pointer"
                >
                  {result.label}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
