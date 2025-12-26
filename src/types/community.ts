export interface Community {
  id: number; // or string, depending on DB. Flask usually sends int IDs unless using UUIDs.
  name: string;
  slug: string;
  description: string;
  created_at: string;
  // We will assume the backend might eventually send these, or we calculate them
  member_count?: number; 
  is_member?: boolean;
}

export interface CreateCommunityPayload {
  name: string;
  description: string;
}