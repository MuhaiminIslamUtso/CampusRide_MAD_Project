export type UserRole = 'passenger' | 'rider' | 'admin';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  universityId: string;
  universityName: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  idCardUrl?: string;
  department: string;
  phone: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  user: {
    id: 'usr-junayed',
    name: 'Junayed Rashid',
    email: '22-47399-2@student.aiub.edu',
    studentId: '22-47399-2',
    universityId: 'aiub',
    universityName: 'American International University-Bangladesh',
    role: 'passenger',
    verificationStatus: 'VERIFIED',
    department: 'Computer Science',
    phone: '+880 1712-345678',
  },
  token: 'mock-jwt-token-campusride-2026',
  isAuthenticated: true,
  isLoading: false,
};

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_UNIVERSITY'; payload: { universityId: string; universityName: string } }
  | { type: 'SUBMIT_VERIFICATION'; payload: { studentId: string; department: string; idCardUrl: string } }
  | { type: 'SET_LOADING'; payload: boolean };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'SET_UNIVERSITY':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          universityId: action.payload.universityId,
          universityName: action.payload.universityName,
        },
      };

    case 'SUBMIT_VERIFICATION':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          studentId: action.payload.studentId,
          department: action.payload.department,
          idCardUrl: action.payload.idCardUrl,
          verificationStatus: 'PENDING',
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}
