import { api } from "@/lib/api";
import { Comment, CreateCommentPayload } from "@/types/comment";

export const CommentService = {
  // GET /api/v1/posts/{postId}/comments/
  async getByPost(postId: string) {
    const response = await api.get<Comment[]>(`/api/v1/posts/${postId}/comments/`);
    return response.data;
  },

  // POST /api/v1/posts/{postId}/comments/
  async create(postId: string, data: CreateCommentPayload) {
    const response = await api.post<Comment>(`/api/v1/posts/${postId}/comments/`, data);
    return response.data;
  }
};