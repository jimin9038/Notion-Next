"use client";

import { Suspense, useEffect, useState } from "react";
import Menu from "./_components/menu";
import { getPages, createPage, updatePage, deletePage } from "./actions";
import { useSession } from "next-auth/react";
import Comment from "@/app/_components/Comment";
import Setting from "./_components/Setting";
import dynamic from "next/dynamic";
import { marked } from "marked";
import { DotIcon } from "lucide-react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import he from "he";

const EditorComp = dynamic(() => import("@/app/_components/MarkdownEditor"), {
  ssr: false,
});

interface Heading {
  level: number;
  text: string;
}
export default function Home() {
  const [pages, setPages] = useState<
    Record<number, { title: string; content: string; pin: boolean }>
  >({});
  const [nowId, setNowId] = useState<number>(0);
  const [nowTitle, setNowTitle] = useState<string>("");
  const [nowContent, setNowContent] = useState<string>("");
  const [nowPin, setNowPin] = useState<boolean>(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showTableOfContents, setShowTableOfContents] =
    useState<boolean>(false);
  const [showComment, setShowComment] = useState<boolean>(false);

  const [font, setFont] = useState<string>("sans");

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

        const firstPage = res[0];
        setNowId(firstPage.id);
        setNowTitle(firstPage.title);
        setNowContent(firstPage.content);
        setNowPin(firstPage.pin);
      }
    };
    initializePages();
  }, []);

  useEffect(() => {
    const extractHeadings = (markdown: string) => {
      const tokens = marked.lexer(markdown);
      return tokens
        .filter((token) => token.type === "heading")
        .map((token) => ({
          level: token.depth,
          text: he.decode(token.text).trim(), // 디코딩 후 공백 제거
        }));
    };

    const newHeadings = extractHeadings(nowContent);
    setHeadings(newHeadings);
  }, [nowContent]);

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
    setNowPin(false);
  };

  const handleDeletePage = async (id: number) => {
    await deletePage(id);
    console.log("wefwefwefwef");
    setPages((prevPages) => {
      const updatedPages = { ...prevPages };
      console.log(updatedPages);
      delete updatedPages[id];
      return updatedPages;
    });
    const remainingPages = Object.keys(pages)
      .filter((key) => key !== id.toString())
      .map(Number);
    if (remainingPages.length > 0) {
      const firstPageId = remainingPages[0];
      selectPage(firstPageId);
    } else {
      setNowId(0);
      setNowTitle("");
      setNowContent("");
      setNowPin(false);
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
          <div className="w-3/5 max-w-screen-lg py-20">
            <input
              className="outline-none text-4xl font-extrabold block mb-4 border-[none] w-full dark:bg-slate-800 dark:text-white"
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
      <div className="border-l border-gray-300 p-4 ">
        <div className="border-b border-gray-300 mb-7 pb-7 w-80">
          <div className="flex">
            <button
              className="mr-2"
              onClick={() => setShowTableOfContents(!showTableOfContents)}
            >
              <TbTriangleInvertedFilled />
            </button>
            <h3 className="text-xl w-full font-semibold">Table of Contents</h3>
          </div>
          {showTableOfContents && (
            <ul>
              <div className="font-bold text-lg my-2 overflow-hidden text-ellipsis w-80">
                {nowTitle}
              </div>
              {headings.map((heading, index) => {
                if (heading.level === 1) {
                  return (
                    <li key={index} className={`mb-2`}>
                      <DotIcon className="inline" />
                      {heading.text}
                    </li>
                  );
                } else if (heading.level === 2) {
                  return (
                    <li key={index} className={`pl-4 mb-2`}>
                      <DotIcon className="inline" />
                      {heading.text}
                    </li>
                  );
                } else if (heading.level === 3) {
                  return (
                    <li key={index} className={`pl-8 mb-2`}>
                      <DotIcon className="inline" />
                      {heading.text}
                    </li>
                  );
                }
              })}
            </ul>
          )}
        </div>
        <div className="flex">
          <button className="mr-2" onClick={() => setShowComment(!showComment)}>
            <TbTriangleInvertedFilled />
          </button>
          <h3 className="text-xl w-full font-semibold">Comments</h3>
        </div>
        {showComment && <Comment pageId={nowId} />}
      </div>
    </div>
  );
}
