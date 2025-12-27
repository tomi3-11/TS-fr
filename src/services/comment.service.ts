import { api } from "@/lib/api";
import { Community, CreateCommunityPayload, JoinResponse } from "@/types/community";

export const CommunityService = {
  // GET /api/v1/communities/
  async getAll() {
    const { data } = await api.get<Community[]>("/api/v1/communities/");
    return data;
  },

  // GET /api/v1/communities/:slug/
  async getOne(slug: string) {
    const { data } = await api.get<Community>(`/api/v1/communities/${slug}/`);
    return data;
  },

  // POST /api/v1/communities/
  async create(payload: CreateCommunityPayload) {
    const { data } = await api.post<{ message: string; slug: string }>("/api/v1/communities/", payload);
    return data;
  },

  // POST /api/v1/communities/:slug/join/
  async join(slug: string) {
    const { data } = await api.post<JoinResponse>(`/api/v1/communities/${slug}/join/`, {});
    return data;
  },

  // POST /api/v1/communities/:slug/leave/
  async leave(slug: string) {
    const { data } = await api.post<{ message: string }>(`/api/v1/communities/${slug}/leave/`, {});
    return data;
  }
};