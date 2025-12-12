export interface TeamMember {
  name: string;
  email: string;
  role: string;
}

export interface TeamRegistration {
  teamId: string;
  teamName: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamMembers: TeamMember[];
  idCardPath: string | null;
  idCardVerified: boolean;
  createdAt: string;
}
