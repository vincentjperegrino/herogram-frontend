import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Layout from "../layout/Layout";
import { uploadFiles } from "../api/File";
import toast from "react-hot-toast";

const Upload = () => {
  const [files, setFiles] = useState<{ file: File; tags: string[] }[]>([]);

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({ file, tags: [] })), // Properly structure files
    ]);
  };

  // Handle file removal
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle tag change for each file
  const handleTagChange = (index: number, tag: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].tags = tag.split(",").map((tag) => tag.trim());
      return updatedFiles;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("No files to upload!");
      return;
    }

    try {
      // Upload files with their tags
      const filesToUpload = files.map((fileData) => ({
        file: fileData.file, // Pass the file object correctly
        tags: fileData.tags,  // Include the tags for each file
      }));

      await uploadFiles(filesToUpload);
      toast.success("Files uploaded successfully!");
      setFiles([]); // Clear the file list after successful upload
    } catch (error: any) {
      toast.error("Error uploading files: " + error.message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <Layout>
      <div className="flex flex-col gap-4 p-4 h-full">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`flex flex-grow items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer h-full ${
            isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-lg text-blue-500">Drop the files here...</p>
          ) : (
            <p className="text-lg text-gray-500">
              Drag and drop files here, or click to select files
            </p>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Files to Upload:</h2>
            <ul className="space-y-2">
              {files.map((fileData, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2">
                  <span>{fileData.file.name}</span>

                  {/* Tag input and Remove button in the same row */}
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={fileData.tags.join(", ")}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="border rounded-md p-2 text-sm w-48"
                      placeholder="Add tags (comma separated)"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Upload Files
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;