"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Menu({
  pageIDs,
  titles,
  nowId,
  setNowId,
  addPage,
}: {
  pageIDs: number[];
  titles: Record<number, string>;
  nowId: number;
  setNowId: (id: number) => void;
  addPage: () => void;
}) {
  const handlePageSelect = (id: number) => {
    setNowId(id);
  };
  const { data } = useSession();
  console.log(data);

  return (
    <div className="w-60 min-h-screen bg-[rgb(247,247,245)] p-2">
      <div className="mb-4">
        <div className="flex items-center gap-2 h-10 text-sm font-medium px-4 py-2">
          <Image
            alt="Profile Pic"
            width={40}
            height={40}
            loading="lazy"
            className="h-full w-auto object-contain rounded"
            src="/profile.jpg"
          />
          <div>{data?.user?.name}</div>
        </div>
      </div>
      <div className="mb-8">
        {pageIDs.map((id: number) => (
          <div
            key={id}
            className={`flex items-center h-8 text-sm font-semibold text-[#888888] cursor-pointer transition-[background-color] duration-[0.3s] px-4 py-1.5 hover:bg-[#ddd] ${
              id === nowId ? "bg-[#ddd] text-[#007bff]" : ""
            }`}
            onClick={() => handlePageSelect(id)}
          >
            {titles[id] || "Untitled"}
          </div>
        ))}
        <button
          className={`flex items-center h-8 text-sm font-semibold text-[#888888] cursor-pointer transition-[background-color] duration-[0.3s] px-4 py-1.5 hover:bg-[#ddd]`}
          onClick={addPage}
        >
          New Page
        </button>
      </div>
    </div>
  );
}
