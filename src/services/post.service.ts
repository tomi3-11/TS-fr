import { api } from "@/lib/api";
import { Post, CreatePostPayload, CreatePostResponse } from "@/types/post";

export const PostService = {
  // GET /api/v1/posts/communities/:slug/posts/?type=...
  async getByCommunity(slug: string, type?: "proposal" | "discussion") {
    if (!slug) throw new Error("Community slug is missing"); // Safety check
    
    const query = type ? `?type=${type}` : "";
    const { data } = await api.get<Post[]>(`/api/v1/posts/communities/${slug}/posts/${query}`);
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<Post>(`/api/v1/posts/${id}/`);
    return data;
  },

  async create(slug: string, payload: CreatePostPayload) {
    const { data } = await api.post<CreatePostResponse>(`/api/v1/posts/communities/${slug}/posts/`, payload);
    return data;
  },

  async vote(id: string, value: 1 | -1) {
    const { data } = await api.post(`/api/v1/votes/posts/${id}/vote/`, { value });
    return data;
  }
};