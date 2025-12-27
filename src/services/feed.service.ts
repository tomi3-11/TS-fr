import { api } from "@/lib/api";
import { FeedResponse, TimeRange } from "@/types/feed";
import { Post } from "@/types/post";

// Helper to normalize backend data
function normalizePost(post: any): Post {
  let communityObj = post.community;

  // Fix community string to object
  if (typeof post.community === "string") {
    const rawSlug = post.community.replace(/^t\//, ""); 
    communityObj = {
      id: "temp-id",
      name: rawSlug, 
      slug: rawSlug,
      description: "",
      created_at: new Date().toISOString(),
      is_member: false,
      total_members: 0,
    };
  }

  // Fix author object/string
  const authorName = typeof post.author === "object" ? post.author.username : post.author;

  return {
    ...post,
    author: authorName,
    community: communityObj,
  };
}

export const FeedService = {
  // GET /api/v1/feeds/latest/
  async getLatest(page = 1, perPage = 20) {
    const { data } = await api.get<any>( // Use <any> temporarily to handle 'results' vs 'items' mismatch
      `/api/v1/feeds/latest/?page=${page}&per_page=${perPage}`
    );
    
    // CRITICAL FIX: The API returns 'results', but our UI expects 'items'.
    // We map 'results' to 'items' here.
    const rawItems = data.results || data.items || [];

    return {
      page: data.page,
      per_page: data.per_page,
      total: data.total,
      items: rawItems.map(normalizePost),
    };
  },

  // GET /api/v1/feeds/top/
  async getTop(timeRange: TimeRange = "all", page = 1, perPage = 20) {
    const { data } = await api.get<any>(
      `/api/v1/feeds/top/?time_range=${timeRange}&page=${page}&per_page=${perPage}`
    );

    const rawItems = data.results || data.items || [];

    return {
      page: data.page,
      per_page: data.per_page,
      total: data.total,
      items: rawItems.map(normalizePost),
    };
  },
};