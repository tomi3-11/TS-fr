import { api } from "@/lib/api";
import { 
  Project, 
  CreateProjectPayload, 
  UpdateProjectPayload, 
  ProjectFilters,
  ProjectStatus 
} from "@/types/project";

const BASE_URL = "/api/v1/projects/";


// Define the shape of your new Backend Response
interface VoteResponse {
  message: string;
  new_score: number;
  user_vote: number | null;
}

export const ProjectService = {
  // 1. LIST PROJECTS
  // GET /api/v1/projects/?sector=health&status=PROPOSED
  async getAll(filters?: ProjectFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.sector) params.append("sector", filters.sector);
      if (filters.status) params.append("status", filters.status);
      if (filters.community_id) params.append("community_id", filters.community_id.toString());
    }
    
    // The query string is constructed automatically
    const { data } = await api.get<Project[]>(`${BASE_URL}?${params.toString()}`);
    return data;
  },

  // 2. GET SINGLE PROJECT
  // GET /api/v1/projects/{id}/
  async getById(id: number) {
    const { data } = await api.get<Project>(`${BASE_URL}${id}/`);
    return data;
  },

  // 3. CREATE PROJECT
  // POST /api/v1/projects/
  async create(payload: CreateProjectPayload) {
    const { data } = await api.post<Project>(BASE_URL, payload);
    return data;
  },

  // 4. UPDATE PROJECT (Owner Only)
  // PUT /api/v1/projects/{id}/
  async update(id: number, payload: UpdateProjectPayload) {
    const { data } = await api.put<Project>(`${BASE_URL}${id}/`, payload);
    return data;
  },

  // 5. WITHDRAW/DELETE PROJECT
  // DELETE /api/v1/projects/{id}/
  async delete(id: number) {
    const { data } = await api.delete(`${BASE_URL}${id}/`);
    return data;
  },

  // 6. VOTE ON PROJECT
  // POST /api/v1/projects/{id}/vote/
  async vote(id: number, value: 1 | -1) {
    const { data } = await api.post<VoteResponse>(
      `${BASE_URL}${id}/vote/`, 
      { value }
    );
    return data;
  },

  // 7. TRANSITION STATUS
  // POST /api/v1/projects/{id}/transition/
  // Transitions: PROPOSED -> APPROVED -> ACTIVE -> COMPLETED
  async transition(id: number, status: ProjectStatus) {
    const { data } = await api.post<Project>(
      `${BASE_URL}${id}/transition/`, 
      { status }
    );
    return data;
  }
};