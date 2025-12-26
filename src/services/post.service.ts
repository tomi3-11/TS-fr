import { api } from "@/lib/api";
import { Post, CreatePostPayload } from "@/types/post";

export const PostService = {
  // GET /api/v1/posts/communities/{slug}/posts/?type={filter}
  async getByCommunity(slug: string, filter?: "proposal" | "discussion") {
    const query = filter ? `?type=${filter}` : "";
    const response = await api.get<Post[]>(`/api/v1/posts/communities/${slug}/posts/${query}`);
    return response.data;
  },

  // GET /api/v1/posts/{postId}/
  async getById(postId: string) {
    const response = await api.get<Post>(`/api/v1/posts/${postId}/`);
    return response.data;
  },

  // POST /api/v1/posts/communities/{slug}/posts/
  async create(slug: string, data: CreatePostPayload) {
    const response = await api.post<Post>(`/api/v1/posts/communities/${slug}/posts/`, data);
    return response.data;
  },

  // POST /api/v1/votes/posts/{postId}/vote/
  async vote(postId: string, value: 1 | -1) {
    const response = await api.post(`/api/v1/votes/posts/${postId}/vote/`, { value: Number(value) });
    return response.data;
  }
};