"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProfileImage({ id }: { id?: string }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 사용자 프로필 이미지 로드
  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const response = await fetch(`/api/profile-image/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPreviewImage(data.image || "/profile.jpg");
        } else {
          throw new Error("Failed to fetch profile image.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setPreviewImage("/profile.jpg");
      }
    }

    fetchProfileImage();
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`/api/upload/profile/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload profile image.");
      }

      const data = await response.json();
      if (data.success) {
        alert("Profile image uploaded successfully!");
        setPreviewImage(`/api/profile-image/${id}`);
      } else {
        throw new Error(data.error || "Failed to upload profile image.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading the profile image.");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Image
            alt="Profile Pic"
            width={40}
            height={40}
            loading="lazy"
            className="h-full w-auto object-contain rounded cursor-pointer"
            src={previewImage || "/profile.jpg"}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Image</DialogTitle>
            <DialogDescription>
              You can change your profile image by uploading a new image below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Image
              alt="Profile Preview"
              width={100}
              height={100}
              className="h-24 w-24 object-cover rounded-full"
              src={previewImage || "/profile.jpg"}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
