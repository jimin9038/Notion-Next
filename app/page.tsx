"use client";

import { useEffect, useState } from "react";
import Menu from "./components/menu";
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
} from "./actions";
import { useSession } from "next-auth/react";

export default function Home() {
  const [pages, setPages] = useState<
    Record<number, { title: string; content: string; pin: boolean }>
  >({});
  const [nowId, setNowId] = useState<number>(0);
  const [nowTitle, setNowTitle] = useState<string>("");
  const [nowContent, setNowContent] = useState<string>("");
  const [nowPin, setNowPin] = useState<boolean>(false);

  useEffect(() => {
    const getPagesAndSet = async (id: number) => {
      const res = await getPages();
      if (res) {
        const newPages = Object.fromEntries(
          res.map(({ id, title, content, pin }) => [
            id,
            { title, content, pin },
          ])
        );
        setPages(newPages);
        const nowPage = await getPage(id);
        if (nowPage) {
          setNowTitle(nowPage.title);
          setNowContent(nowPage.content);
          setNowPin(nowPage.pin);
        }
      }
    };
    getPagesAndSet(nowId);
  }, [nowId]);

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

  async function handleContentChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    if (!nowId) {
      window.alert("Please select a page first!");
      return;
    }
    const newContent = e.target.value;
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

  async function handleContentBlur(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!nowId) {
      return;
    }
    const newContent = e.target.value;
    setNowContent(newContent);
    await updatePage(nowId, nowTitle, newContent, nowPin);
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
  };
  const selectPage = (id: number) => {
    setNowId(id);
    setNowTitle(pages[id]?.title || "");
    setNowContent(pages[id]?.content || "");
  };
  const updatePin = async (id: number) => {
    const newPin = !pages[id].pin;
    await updatePage(id, pages[id].title, pages[id].content, newPin);
    setPages((prevPages) => ({
      ...prevPages,
      [id]: { title: pages[id].title, content: pages[id].content, pin: newPin },
    }));
  };
  const { data } = useSession();
  return (
    <div className="flex">
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

      <div className="flex justify-center w-full">
        <div className="w-3/5 max-w-screen-lg py-32">
          <input
            className="text-4xl font-bold block mb-4 border-[none] w-full"
            placeholder="제목"
            value={nowTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
          />
          <textarea
            className="text-lg leading-7 block px-0 py-2 border-[none] w-full min-h-96"
            placeholder="Start with typing your text! "
            value={nowContent}
            onChange={handleContentChange}
            onBlur={handleContentBlur}
          />
        </div>
      </div>
    </div>
  );
}
