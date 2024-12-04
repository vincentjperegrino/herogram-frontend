import { AxiosResponse } from "axios";
import api from "./Axios";
import {
  FileResponse,
  UpdateFileRequest,
  UpdateFileResponse,
} from "../interfaces/Files";

export const uploadFiles = async (files: { file: File; tags: string[] }[]): Promise<void> => {
  try {
    const formData = new FormData();
    
    files.forEach((fileData) => {
      // Append file and tags together
      formData.append("files", fileData.file);
      formData.append("tags", JSON.stringify(fileData.tags)); // Add tags as a JSON string
    });

    // Sending the formData including the files and tags
    await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    throw new Error("Error uploading files: " + error.message);
  }
};

// Fetch all files
export const getFiles = async (): Promise<FileResponse> => {
  try {
    const response: AxiosResponse<FileResponse> = await api.get<FileResponse>(
      "/files"
    );
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching files: " + error.message);
  }
};

// Update a file's metadata, including tags
export const updateFile = async (
  fileId: string,
  updateData: UpdateFileRequest
): Promise<UpdateFileResponse> => {
  try {
    const response: AxiosResponse<UpdateFileResponse> =
      await api.put<UpdateFileResponse>(`/files/update/${fileId}`, updateData);
    return response.data;
  } catch (error: any) {
    throw new Error("Error updating file: " + error.message);
  }
};