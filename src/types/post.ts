export interface Post {
  id: string;
  title: string;
  content?: string; 
  post_type: "proposal" | "discussion";
  score: number;
  author: string;
  community: string; 
  created_at: string;
  user_vote?: number | null;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  post_type: "proposal" | "discussion";
}

export interface CreatePostResponse {
  message: string;
  post_id: string;
}