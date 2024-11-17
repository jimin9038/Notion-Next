"use server";

import db from "@/app/db";

export async function createPage() {
  return await db.page.create({
    data: {
      title: "Untitled",
      content: "",
    },
  });
}

export async function getPage(id: number) {
  return await db.page.findUnique({
    where: { id },
  });
}
export async function getPages() {
  return await db.page.findMany();
}

export async function updatePage(id: number, title: string, content: string) {
  return await db.page.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
}
