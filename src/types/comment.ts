export interface Comment {
  id: string;
  content: string;
  author: string;
  post_id: string;
  parent_id?: string | null; 
  created_at: string;
  replies?: Comment[]; 
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: string | null;
}