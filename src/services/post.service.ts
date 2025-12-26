import { api } from "@/lib/api";
import { Post, CreatePostPayload } from "@/types/post";

export const PostService = {
  // Get posts for a specific community
  async getByCommunity(slug: string, filter?: string) {
    // Backend: GET /api/v1/posts/communities/{slug}/posts/?type={filter}
    const url = `/api/v1/posts/communities/${slug}/posts/${filter ? `?type=${filter}` : ""}`;
    const response = await api.get<Post[]>(url);
    return response.data;
  },

  // Create a new post
  async create(slug: string, data: CreatePostPayload) {
    // Backend: POST /api/v1/posts/communities/{slug}/posts/
    const response = await api.post<Post>(`/api/v1/posts/communities/${slug}/posts/`, data);
    return response.data;
  },

  // Vote on a post
  async vote(postId: string, value: 1 | -1) {
    // Backend: POST /api/v1/votes/posts/{postId}/vote/
    const response = await api.post(`/api/v1/votes/posts/${postId}/vote/`, { value });
    return response.data;
  }
};