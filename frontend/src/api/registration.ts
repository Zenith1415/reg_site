import axios from 'axios';
import { RegistrationFormData, TeamRegistrationData, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function registerTeam(formData: RegistrationFormData): Promise<ApiResponse<TeamRegistrationData>> {
  try {
    const data = new FormData();
    data.append('teamName', formData.teamName);
    data.append('teamLeaderName', formData.teamLeaderName);
    data.append('teamLeaderEmail', formData.teamLeaderEmail);
    data.append('teamMembers', JSON.stringify(formData.teamMembers.filter(m => m.name && m.email)));
    data.append('recaptchaToken', formData.recaptchaToken);
    
    if (formData.idCardFile) {
      data.append('idCard', formData.idCardFile);
    }

    const response = await axios.post<ApiResponse<TeamRegistrationData>>(
      `${API_BASE_URL}/register`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<TeamRegistrationData>;
    }
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
}

export async function verifyRecaptcha(token: string): Promise<ApiResponse<{ verified: boolean }>> {
  try {
    const response = await axios.post<ApiResponse<{ verified: boolean }>>(
      `${API_BASE_URL}/verify-recaptcha`,
      { token }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify reCAPTCHA',
    };
  }
}
