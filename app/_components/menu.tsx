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
import { deletePage } from "../actions";
import ProfileImage from "./profileImage";

export default function Menu({
  pageIDs,
  titles,
  nowId,
  setNowId,
  addPage,
  session,
  switchPin,
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
  const handlePageSelect = (id: number) => {
    setNowId(id);
  };

  const pinnedPages = pageIDs.filter((id) => pins[id]);
  const unpinnedPages = pageIDs.filter((id) => !pins[id]);

  return (
    <div className="w-60 min-h-screen bg-[rgb(247,247,245)] p-2">
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
            className={`flex justify-between items-center h-8 text-sm font-semibold text-[#888888] cursor-pointer transition-[background-color] duration-[0.3s] px-4 py-1.5 hover:bg-[#ddd] ${
              id === nowId ? "bg-[#ddd] text-[#007bff]" : ""
            }`}
            onClick={() => handlePageSelect(id)}
          >
            <button onClick={() => switchPin(id)}>
              {pins[id] ? (
                <FaStar className="text-yellow-400 hover:opacity-50" />
              ) : (
                <FaStar className="text-transparent hover:text-yellow-400" />
              )}
            </button>
            {titles[id] || "Untitled"}
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
          className="flex items-center h-8 text-sm font-semibold text-[#888888] cursor-pointer transition-[background-color] duration-[0.3s] px-4 py-1.5 hover:bg-[#ddd]"
          onClick={addPage}
        >
          New Page
        </button>
      </div>
    </div>
  );
}
