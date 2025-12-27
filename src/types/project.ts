export type ProjectStatus = 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';

export interface Project {
  id: number;
  title: string;
  problem_statement: string;
  proposed_solution: string;
  sector: string;
  status: ProjectStatus;
  vote_score: number;
  proposal_deadline: string; 
  created_at: string;
  
  owner: string | {
    id: number;
    username: string;
  };
  
  community: string | {
    id: number;
    name: string;
    slug?: string;
  };

  user_vote?: number; 
}

export interface CreateProjectPayload {
  title: string;
  problem_statement: string;
  proposed_solution: string;
  sector: string;
  proposal_deadline: string;
  community_id: number | string; 
}

export interface UpdateProjectPayload {
  title?: string;
  problem_statement?: string;
  proposed_solution?: string;
  sector?: string;
  proposal_deadline?: string;
}

export interface ProjectFilters {
  sector?: string;
  status?: ProjectStatus;
  community_id?: number;
}