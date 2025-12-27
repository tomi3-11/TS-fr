export interface Comment {
  id: number;
  content: string;
  author: string; // The username (e.g., "alice")
  post_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at?: string;
  replies: Comment[]; // Recursive structure
}

export interface CreateCommentPayload {
  content: string;
}