"use client";
import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();
  return (
    <form className="w-full h-full">
      <input
        placeholder="Search Pets"
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none placeholder:text-white/50 transition focus:bg-white/50 hover:bg-white/30"
        value={searchQuery}
        onChange={(e) => handleChangeSearchQuery(e.target.value)}
        type="search"
      />
    </form>
  );
}
