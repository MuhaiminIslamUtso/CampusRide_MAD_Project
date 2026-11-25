import React, { createContext, useContext, useReducer } from 'react';
import { AuthAction, AuthState, authReducer, initialAuthState } from './auth-reducer';
import { User } from './auth-reducer';

interface AuthContextValue {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  selectUniversity: (universityId: string, universityName: string) => void;
  submitVerification: (studentId: string, department: string, idCardUrl: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate API Network call
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyUser: User = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: email.split('@')[0] || 'Junayed Rashid',
          email,
          studentId: '22-47399-2',
          universityId: 'aiub',
          universityName: 'American International University-Bangladesh',
          role: 'passenger',
          verificationStatus: 'VERIFIED',
          department: 'Computer Science',
          phone: '+880 1712-345678',
        };
        dispatch({
          type: 'LOGIN',
          payload: { user: dummyUser, token: 'jwt-auth-token-' + Date.now() },
        });
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const selectUniversity = (universityId: string, universityName: string) => {
    dispatch({
      type: 'SET_UNIVERSITY',
      payload: { universityId, universityName },
    });
  };

  const submitVerification = async (
    studentId: string,
    department: string,
    idCardUrl: string
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({
          type: 'SUBMIT_VERIFICATION',
          payload: { studentId, department, idCardUrl },
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        resolve(true);
      }, 1200);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        selectUniversity,
        submitVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
