import { api } from "@/lib/api";
import { Post } from "@/types/post";

// Define the new response shape based on your blueprint
interface VoteResponse {
  message: string;
  new_score: number;
  user_vote: number; // 1, -1, or 0
}

export const PostService = {
  async getAll() {
    const { data } = await api.get<Post[]>("/api/v1/posts/");
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<Post>(`/api/v1/posts/${id}/`);
    return data;
  },

  async create(payload: { title: string; content: string; community_id: number; post_type: string }) {
    const { data } = await api.post<Post>("/api/v1/posts/", payload);
    return data;
  },

  // UPDATED: Now returns the exact server state
  async vote(postId: string, value: 1 | -1) {
    const { data } = await api.post<VoteResponse>(`/api/v1/votes/posts/${postId}/vote/`, { value });
    return data;
  }
};