export interface FileManager {
  url?: string;
  health: boolean;
}

export interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
  size?: number;
  lastModified?: Date;
}

export interface File {
  value: string | ArrayBuffer;
  type: ContentType;
}

export interface CreateItemRequest {
  path: string;
  isDir: boolean;
  content?: string;
}

export type ContentType = "image" | "text" | "video";
