import { api } from "@/lib/api";
import { Community, CreateCommunityPayload } from "@/types/community";

export const CommunityService = {
  async getAll() {
    const response = await api.get<Community[]>("/api/v1/communities/");
    return response.data;
  },

  async getOne(slug: string) {
    const response = await api.get<Community>(`/api/v1/communities/${slug}/`);
    return response.data;
  },

  async create(data: CreateCommunityPayload) {
    const response = await api.post<Community>("/api/v1/communities/", data);
    return response.data;
  },

  async join(slug: string) {
    const response = await api.post<{ message: string }>(`/api/v1/communities/${slug}/join/`);
    return response.data;
  },

  async leave(slug: string) {
    const response = await api.post<{ message: string }>(`/api/v1/communities/${slug}/leave/`);
    return response.data;
  }
};