import { Post } from "./post";

export interface FeedResponse {
  page: number;
  per_page: number;
  total: number;
  items: Post[]; // The Service guarantees this field now exists
}

export type FeedType = "latest" | "top";
export type TimeRange = "day" | "week" | "month" | "all";