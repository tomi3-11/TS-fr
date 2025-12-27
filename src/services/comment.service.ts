import { api } from "@/lib/api";
import { Comment, CreateCommentPayload } from "@/types/comment";

export const CommentService = {
  // GET /api/v1/comments/post/{post_id}
  async getByPost(postId: string) {
    const { data } = await api.get<Comment[]>(`/api/v1/comments/post/${postId}/`);
    return data;
  },

  // POST /api/v1/comments/post/{post_id}
  async create(postId: string, payload: CreateCommentPayload) {
    const { data } = await api.post<Comment>(`/api/v1/comments/post/${postId}/`, payload);
    return data;
  },

  // POST /api/v1/comments/{comment_id}/replies
  async reply(commentId: number, payload: CreateCommentPayload) {
    const { data } = await api.post<Comment>(`/api/v1/comments/${commentId}/replies/`, payload);
    return data;
  },

  // DELETE /api/v1/comments/{comment_id}
  async delete(commentId: number) {
    const { data } = await api.delete<{ message: string }>(`/api/v1/comments/${commentId}/`);
    return data;
  }
};