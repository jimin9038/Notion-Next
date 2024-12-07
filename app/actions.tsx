"use server";

import db from "@/app/db";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function createPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/signIn");
  }

  return await db.page.create({
    data: {
      title: "Untitled",
      content: "",
      userId: Number(session.user.id),
    },
  });
}

export async function getPage(id: number) {
  const session = await auth();
  console.log(session);
  if (!session || !session.user || !session.user.id) {
    console.log("Not authenticated in getPage");
    redirect("/signIn");
  }
  return await db.page.findUnique({
    where: { id },
  });
}

export async function getPages() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    console.log("Not authenticated in getPage");
    redirect("/signIn");
  }
  return await db.page.findMany();
}

export async function updatePage(
  id: number,
  title: string,
  content: string,
  pin: boolean
) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return await db.page.update({
    where: { id },
    data: {
      title,
      content,
      pin,
    },
  });
}

export async function deletePage(id: number) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return await db.page.delete({
    where: { id },
  });
}

export async function createComment(pageId: number, content: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/signIn");
  }

  try {
    if (!pageId) {
      
    }
    return await db.comment.create({
      data: {
        content,
        pageId,
        userId: Number(session.user.id),
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}

export async function getComments(pageId: number) {
  try {
    return await db.comment.findMany({
      where: { pageId },
      include: {
        user: { select: { username: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export async function updateComment(commentId: number, content: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/signIn");
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== Number(session.user.id)) {
      throw new Error("Not authorized to update this comment");
    }

    return await db.comment.update({
      where: { id: commentId },
      data: { content },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
}

export async function deleteComment(commentId: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/signIn");
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== Number(session.user.id)) {
      throw new Error("Not authorized to delete this comment");
    }

    return await db.comment.delete({
      where: { id: commentId },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
}
