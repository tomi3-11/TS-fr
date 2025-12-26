export interface Post {
  id: string; // UUID
  title: string;
  content: string;
  post_type: "proposal" | "discussion" | "announcement";
  author: string; // username
  community: string; // slug
  score: number; // votes
  created_at: string;
  vote_status?: number; // 1 (up), -1 (down), 0 (none) - usually handled by separate state or joined data
}

export interface CreatePostPayload {
  title: string;
  content: string;
  post_type: "proposal" | "discussion";
}