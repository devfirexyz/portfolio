// Shared types used by both server and client code

export interface ChatThread {
  clientThreadId: string;
  title: string;
  promptCount: number;
  lastPreview: string;
  createdAt: number;
  updatedAt: number;
}
