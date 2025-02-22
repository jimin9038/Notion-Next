"use client";

import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { Session } from "next-auth";
import ProfileImage from "./profileImage";

export default function Menu({
  pageIDs,
  titles,
  nowId,
  setNowId,
  addPage,
  session,
  switchPin,
  deletePage,
  pins,
}: {
  pageIDs: number[];
  titles: Record<number, string>;
  pins: Record<number, boolean>;
  nowId: number;
  setNowId: (id: number) => void;
  addPage: () => void;
  deletePage: (id: number) => void;
  session: Session | null;
  switchPin: (id: number) => void;
}) {
  const handlePageSelect = (
    id: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setNowId(id);
  };

  const pinnedPages = pageIDs.filter((id) => pins[id]);
  const unpinnedPages = pageIDs.filter((id) => !pins[id]);

  return (
    <div className="w-60 min-h-screen p-2">
      <div className="mb-4">
        <div className="flex items-center gap-2 h-10 text-sm font-medium px-4 py-2">
          <ProfileImage id={session?.user?.id} />
          <div>{session?.user?.username}</div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {session?.user?.username} / Id: {session?.user.id}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-8">
        {[...pinnedPages, ...unpinnedPages].map((id: number) => (
          <div
            key={id}
            className={`flex justify-between items-center h-8 text-sm font-semibold cursor-pointer transition-[background-color] duration-[0.3s] px-4 py-1.5 hover:bg-[#ddd] dark:hover:bg-slate-950 ${
              id === nowId
                ? "bg-[#ddd] dark:bg-slate-950 text-[#007bff] dark:text-sky-400"
                : ""
            }`}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              handlePageSelect(id, e)
            }
          >
            <button onClick={() => switchPin(id)}>
              {pins[id] ? (
                <FaStar className="text-yellow-400 hover:opacity-50" />
              ) : (
                <FaStar className="text-transparent hover:text-yellow-400" />
              )}
            </button>
            <div className="ml-1 w-full overflow-hidden">
              {titles[id] || "Untitled"}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal size="15" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Page Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deletePage(id)}
                  className="text-red-400"
                >
                  delete page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        <button
          className="flex items-center h-8 text-sm font-semibold text-[#888888] cursor-pointer transition-[background-color] duration-[0.3s] px-4 py-1.5 dark:hover:bg-slate-950"
          onClick={addPage}
        >
          New Page
        </button>
      </div>
    </div>
  );
}
