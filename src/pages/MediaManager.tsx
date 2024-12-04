import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { getFiles, updateFile } from "../api/File";
import { File } from "../interfaces/Files";
import toast from "react-hot-toast";
import { ClipboardIcon } from "@heroicons/react/24/outline";

type EditingTags = {
  [fileId: string]: string;
};

type InitialTags = {
  [fileId: string]: string[];
};

const MediaManager = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [editingTags, setEditingTags] = useState<EditingTags>({});
  const [initialTags, setInitialTags] = useState<InitialTags>({});

  const baseURL = import.meta.env.VITE_API_BACKEND_URL as string;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fetchedFiles = (await getFiles()).files;

        // Sort files by order in ascending order
        const sortedFiles = fetchedFiles.sort((a, b) => a.order - b.order);

        setFiles(sortedFiles);

        const tagsMap: InitialTags = fetchedFiles.reduce((acc: InitialTags, file) => {
          acc[file._id] = file.tags;
          return acc;
        }, {});
        setInitialTags(tagsMap);
      } catch (error: any) {
        console.error("Error fetching files:", error.message);
      }
    };
    fetchFiles();
  }, []);

  const handleCopyLink = (sharedLink: string) => {
    const sharingLink = baseURL + '/files/view/' + sharedLink;
    navigator.clipboard.writeText(sharingLink).then(
      () => toast.success("Link copied to clipboard!"),
      (err) => toast.error("Failed to copy link:", err)
    );
  };

  const handleTagChange = (fileId: string, newTags: string) => {
    setEditingTags((prev) => ({ ...prev, [fileId]: newTags }));
  };

  const handleTagBlur = async (fileId: string) => {
    const rawTags = editingTags[fileId] || "";
    const normalizedTags = rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const initialFileTags = initialTags[fileId] || [];

    if (
      normalizedTags.length === initialFileTags.length &&
      normalizedTags.every((tag, index) => tag === initialFileTags[index])
    ) {
      return;
    }

    try {
      await updateFile(fileId, { tags: normalizedTags });
      const updatedFiles = files.map((file) =>
        file._id === fileId ? { ...file, tags: normalizedTags } : file
      );
      setFiles(updatedFiles);

      setEditingTags((prev) => {
        const { [fileId]: _, ...rest } = prev;
        return rest;
      });

      setInitialTags((prev) => ({
        ...prev,
        [fileId]: normalizedTags,
      }));

      toast.success("Tags updated successfully!");
    } catch (error: any) {
      console.error("Error updating tags:", error.message);
      toast.error("Failed to update tags.");
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, fileId: string) => {
    e.dataTransfer.setData("fileId", fileId);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetFileId: string) => {
    e.preventDefault();
    const draggedFileId = e.dataTransfer.getData("fileId");

    if (draggedFileId && targetFileId && draggedFileId !== targetFileId) {
      const draggedFileIndex = files.findIndex((file) => file._id === draggedFileId);
      const targetFileIndex = files.findIndex((file) => file._id === targetFileId);

      if (draggedFileIndex !== targetFileIndex) {
        const updatedFiles = [...files];
        // Swap the positions of the dragged file and target file
        [updatedFiles[draggedFileIndex], updatedFiles[targetFileIndex]] = [
          updatedFiles[targetFileIndex],
          updatedFiles[draggedFileIndex],
        ];

        // Update the order based on the new positions
        updatedFiles.forEach((file, index) => {
          if (file.order !== index) {
            file.order = index;
            updateFile(file._id, { order: index }); // Update order in the backend
          }
        });

        setFiles(updatedFiles);

        toast.success("File arrangement updated successfully!");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Images and Videos</h1>
            <p className="mt-2 text-sm text-gray-700">
              Below is the list of files you have uploaded.
            </p>
          </div>
        </div>

        <ul
          role="list"
          className="absolute grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6 xl:gap-x-8 mt-10"
        >
          {files.map((file) => (
            <li
              key={file._id}
              className="relative"
              draggable
              onDragStart={(e) => handleDragStart(e, file._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, file._id)}
              data-fileid={file._id}
            >
              <div className="group overflow-hidden rounded-lg bg-gray-100 relative w-full aspect-w-16 aspect-h-9 border-2 border-gray-300">
                {file.type.startsWith("image") ? (
                  <img
                    alt={file.name}
                    src={file.url}
                    className="object-contain h-48 w-96" // Ensures the image covers the container and excess is cropped
                  />
                ) : file.type.startsWith("video") ? (
                  <video controls className="object-cover w-full h-full">
                    <source src={file.url} type={file.type} />
                  </video>
                ) : null}
              </div>

              <div className="mt-2">
                <textarea
                  value={editingTags[file._id] || file.tags.join(", ")}
                  onChange={(e) => handleTagChange(file._id, e.target.value)}
                  onBlur={() => handleTagBlur(file._id)}
                  rows={2}
                  className="w-full p-2 border rounded-md text-sm text-gray-900"
                  placeholder="Add tags, separated by commas"
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="block text-sm font-medium text-gray-500">{file.views} views</p>
                <button
                  onClick={() => handleCopyLink(file.sharedLink || "")}
                  className="inline-flex items-center rounded-md p-2 border-2 border-black text-black hover:text-gray-500 hover:border-gray-500 shadow-sm"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default MediaManager;