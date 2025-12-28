import { api } from "@/lib/api";
import { CreatePostPayload, CreatePostResponse, Post } from "@/types/post";

// Define the new response shape based on your blueprint
interface VoteResponse {
  message: string;
  new_score: number;
  user_vote: number; // 1, -1, or 0
}

type LegacyCreatePostPayload = {
  title: string;
  content: string;
  community_id: number;
  post_type: string;
};

function isLegacyCreatePostPayload(value: unknown): value is LegacyCreatePostPayload {
  return (
    !!value &&
    typeof value === "object" &&
    "community_id" in value &&
    typeof (value as any).community_id === "number"
  );
}

function normalizeList(data: any): Post[] {
  if (Array.isArray(data)) return data as Post[];
  const items = data?.results ?? data?.items ?? [];
  return Array.isArray(items) ? (items as Post[]) : [];
}

function createPost(communitySlug: string, payload: CreatePostPayload): Promise<CreatePostResponse>;
function createPost(payload: LegacyCreatePostPayload): Promise<Post>;
async function createPost(
  communityOrPayload: string | LegacyCreatePostPayload,
  maybePayload?: CreatePostPayload
): Promise<CreatePostResponse | Post> {
  if (typeof communityOrPayload === "string") {
    const slug = communityOrPayload;
    if (!maybePayload) throw new Error("PostService.create(slug, payload) missing payload");

    const { data } = await api.post<any>(`/api/v1/communities/${slug}/posts/`, maybePayload);
    if (data && typeof data === "object") {
      if (typeof data.post_id === "string") return data as CreatePostResponse;
      if (typeof data.id === "string") return { message: data.message ?? "Post created", post_id: data.id };
    }
    throw new Error("Unexpected create-post response from server");
  }

  if (!isLegacyCreatePostPayload(communityOrPayload)) {
    throw new Error("PostService.create(payload) received invalid legacy payload");
  }
  const { data } = await api.post<Post>("/api/v1/posts/", communityOrPayload);
  return data;
}

export const PostService = {
  async getAll() {
    const { data } = await api.get<Post[]>("/api/v1/posts/");
    return data;
  },

  async getByCommunity(slug: string, postType?: "proposal" | "discussion") {
    const { data } = await api.get<any>(`/api/v1/communities/${slug}/posts/`, {
      params: postType ? { post_type: postType } : undefined,
    });
    return normalizeList(data);
  },

  async getById(id: string) {
    const { data } = await api.get<Post>(`/api/v1/posts/${id}/`);
    return data;
  },

  create: createPost,

  // UPDATED: Now returns the exact server state
  async vote(postId: string, value: 1 | -1) {
    const { data } = await api.post<VoteResponse>(`/api/v1/votes/posts/${postId}/vote/`, { value });
    return data;
  }
};