"use client";

import { Suspense, useEffect, useState } from "react";
import Menu from "./_components/menu";
import { getPages, createPage, updatePage, deletePage } from "./actions";
import { useSession } from "next-auth/react";
import Comment from "@/app/_components/Comment";
import Setting from "./_components/Setting";
import dynamic from "next/dynamic";

const EditorComp = dynamic(() => import("@/app/_components/MarkdownEditor"), {
  ssr: false,
});

export default function Home() {
  const [pages, setPages] = useState<
    Record<number, { title: string; content: string; pin: boolean }>
  >({});
  const [nowId, setNowId] = useState<number>(0);
  const [nowTitle, setNowTitle] = useState<string>("");
  const [nowContent, setNowContent] = useState<string>("");
  const [nowPin, setNowPin] = useState<boolean>(false);

  const [font, setFont] = useState<string>("serif");

  // 페이지 데이터를 가져오고 첫 번째 페이지를 초기화
  useEffect(() => {
    const initializePages = async () => {
      const res = await getPages();
      if (res && res.length > 0) {
        const newPages = Object.fromEntries(
          res.map(({ id, title, content, pin }) => [
            id,
            { title, content, pin },
          ])
        );
        setPages(newPages);

        // 첫 번째 페이지 자동 선택
        const firstPage = res[0];
        setNowId(firstPage.id);
        setNowTitle(firstPage.title);
        setNowContent(firstPage.content);
        setNowPin(firstPage.pin);
      }
    };
    initializePages();
  }, []);

  async function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!nowId) {
      window.alert("Please select a page first!");
      return;
    }
    const newTitle = e.target.value;
    setNowTitle(newTitle);

    setPages((prevPages) => ({
      ...prevPages,
      [nowId]: { title: newTitle, content: nowContent, pin: nowPin },
    }));
  }

  async function handleContentChange(newContent: string) {
    if (!nowId) {
      window.alert("Please select a page first!");
      return;
    }
    setNowContent(newContent);
  }

  async function handleTitleBlur(e: React.ChangeEvent<HTMLInputElement>) {
    if (!nowId) {
      return;
    }
    const newTitle = e.target.value;
    setNowTitle(newTitle);
    await updatePage(nowId, newTitle, nowContent, nowPin);
    setPages((prevPages) => ({
      ...prevPages,
      [nowId]: { title: newTitle, content: nowContent, pin: nowPin },
    }));
  }

  async function handleContentBlur() {
    if (!nowId) {
      return;
    }
    setNowContent(nowContent);
    await updatePage(nowId, nowTitle, nowContent, nowPin);
  }

  const addPage = async () => {
    const res = await createPage();
    setPages((prevPages) => ({
      ...prevPages,
      [res.id]: { title: res.title, content: "", pin: false },
    }));
    setNowId(res.id);
    setNowTitle(res.title);
    setNowContent(res.content);
  };

  const handleDeletePage = async (id: number) => {
    await deletePage(id);
    setPages((prevPages) => ({
      ...Object.fromEntries(
        Object.entries(prevPages).filter(([key]) => key !== id.toString())
      ),
    }));
    // 삭제 후 첫 번째 페이지를 자동으로 선택
    const remainingPages = Object.keys(pages)
      .filter((key) => key !== id.toString())
      .map(Number);
    if (remainingPages.length > 0) {
      const firstPageId = remainingPages[0];
      selectPage(firstPageId);
    } else {
      // 페이지가 없으면 초기화
      setNowId(0);
      setNowTitle("");
      setNowContent("");
    }
  };

  const selectPage = async (id: number) => {
    const updatedPage = await getPages().then((res) =>
      res.find((page) => page.id === id)
    );

    if (updatedPage) {
      setNowId(updatedPage.id);
      setNowTitle(updatedPage.title);
      setNowContent(updatedPage.content);
      setNowPin(updatedPage.pin);
    }
  };

  const updatePin = async (id: number) => {
    const newPin = !pages[id].pin;
    await updatePage(id, pages[id].title, pages[id].content, newPin);
    if (id === nowId) {
      setNowPin(newPin);
    }
    setPages((prevPages) => ({
      ...prevPages,
      [id]: { title: pages[id].title, content: pages[id].content, pin: newPin },
    }));
  };

  const { data } = useSession();

  return (
    <div className={"flex dark:bg-slate-800 dark:text-white" + " font-" + font}>
      <Menu
        pageIDs={Object.keys(pages).map(Number)}
        titles={Object.fromEntries(
          Object.entries(pages).map(([id, { title }]) => [id, title])
        )}
        nowId={nowId}
        setNowId={selectPage}
        addPage={addPage}
        session={data}
        deletePage={handleDeletePage}
        pins={Object.fromEntries(
          Object.entries(pages).map(([id, { pin }]) => [id, pin])
        )}
        switchPin={updatePin}
      />

      <div className="w-full">
        <div className="flex justify-end">
          <Setting font={font} setFont={setFont} />
        </div>
        <div className="flex justify-center w-full">
          <div className="w-3/5 max-w-screen-lg py-32">
            <input
              className="outline-none text-4xl font-bold block mb-4 border-[none] w-full dark:bg-slate-800 dark:text-white"
              placeholder="제목"
              value={nowTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
            />
            <Suspense fallback={<p>Loading editor...</p>}>
              <div className="mdx-editor-container">
                <EditorComp
                  markdown={nowContent}
                  onChange={handleContentChange}
                  onBlur={handleContentBlur}
                  id={nowId}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
      <div className="w-1/4 border-l border-gray-300 p-4">
        <h3 className="text-xl font-semibold mb-4">Table of Contents</h3>
        
        <Comment pageId={nowId} />
      </div>
    </div>
  );
}
