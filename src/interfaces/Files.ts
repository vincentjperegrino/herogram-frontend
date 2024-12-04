export interface File {
  _id: string;
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  isShared: boolean;
  sharedLink: string;
  views: number;
  order: number;
  __v: number;
}

export interface UpdateFileRequest {
  tags?: string[];
  views?: number;
  isShared?: boolean;
  order?: number;
}

export interface FileResponse {
  files: File[];
}

export interface UpdateFileResponse {
    file: File;
}