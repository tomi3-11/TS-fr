export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  is_member: boolean;      
  total_members: number;   
}

export interface CreateCommunityPayload {
  name: string;
  description: string;
}

export interface JoinResponse {
  message: string;
}