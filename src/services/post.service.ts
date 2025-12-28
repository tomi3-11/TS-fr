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
  const items = data?.results ?? data?.items ?? data?.posts ?? [];
  return Array.isArray(items) ? (items as Post[]) : [];
}

type CreatePostOptions = { communityId?: string | number };

function createPost(communitySlug: string, payload: CreatePostPayload, options?: CreatePostOptions): Promise<CreatePostResponse>;
function createPost(payload: LegacyCreatePostPayload): Promise<Post>;
async function createPost(
  communityOrPayload: string | LegacyCreatePostPayload,
  maybePayload?: CreatePostPayload,
  options?: CreatePostOptions
): Promise<CreatePostResponse | Post> {
  if (typeof communityOrPayload === "string") {
    const slug = communityOrPayload;
    if (!maybePayload) throw new Error("PostService.create(slug, payload) missing payload");

    try {
      const { data } = await api.post<any>(`/api/v1/posts/communities/${slug}/posts/`, maybePayload);
      if (data && typeof data === "object") {
        if (typeof data.post_id === "string") return data as CreatePostResponse;
        if (typeof data.id === "string") return { message: data.message ?? "Post created", post_id: data.id };
      }
      throw new Error("Unexpected create-post response from server");
    } catch (err: any) {
      const status = err?.response?.status;
      const canFallback = options?.communityId !== undefined;
      if (!canFallback || (status && status !== 400 && status !== 404)) {
        throw err;
      }

      const { data } = await api.post<Post>("/api/v1/posts/", {
        ...maybePayload,
        community_id: options?.communityId,
      });
      if (data && typeof data === "object" && typeof (data as any).id === "string") {
        const anyData = data as any;
        return { message: typeof anyData.message === "string" ? anyData.message : "Post created", post_id: anyData.id };
      }
      return { message: "Post created", post_id: "" } as CreatePostResponse;
    }
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
    try {
      const { data } = await api.get<any>(`/api/v1/posts/communities/${slug}/posts/`, {
        params: postType ? { type: postType } : undefined,
      });
      return normalizeList(data);
    } catch (err: any) {
      // Fallback 1: older community endpoint
      try {
        const { data } = await api.get<any>(`/api/v1/communities/${slug}/posts/`, {
          params: postType ? { post_type: postType } : undefined,
        });
        return normalizeList(data);
      } catch (err2: any) {
        // Fallback 2: generic posts endpoint with community filter
        const { data } = await api.get<any>(`/api/v1/posts/`, {
          params: {
            ...(postType ? { post_type: postType, type: postType } : {}),
            community_slug: slug,
          },
        });
        return normalizeList(data);
      }
    }
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