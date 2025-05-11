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
