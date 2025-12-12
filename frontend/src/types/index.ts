export interface TeamMember {
  name: string;
  email: string;
  role: string;
}

export interface TeamRegistrationData {
  teamId: string;
  teamName: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamMembers: TeamMember[];
  idCardFile?: File;
  createdAt: string;
}

export interface RegistrationFormData {
  teamName: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamMembers: TeamMember[];
  idCardFile: File | null;
  recaptchaToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
