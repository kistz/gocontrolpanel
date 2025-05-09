export interface FileManager {
  host?: string;
  port?: number;
  health: boolean;
}

export interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
  size?: number;
}