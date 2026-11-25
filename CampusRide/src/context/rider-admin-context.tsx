import React, { createContext, useContext, useReducer } from 'react';
import {
  RiderAdminAction,
  RiderAdminState,
  initialRiderAdminState,
  riderAdminReducer,
} from './rider-admin-reducer';
import { IncidentReport, VehicleRegistration } from '../data/rider-admin';

interface RiderAdminContextValue {
  state: RiderAdminState;
  dispatch: React.Dispatch<RiderAdminAction>;
  toggleOnline: () => void;
  registerVehicle: (data: VehicleRegistration) => Promise<boolean>;
  updateVerification: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  submitReport: (report: IncidentReport) => Promise<boolean>;
}

const RiderAdminContext = createContext<RiderAdminContextValue | null>(null);

export function RiderAdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(riderAdminReducer, initialRiderAdminState);

  const toggleOnline = () => {
    dispatch({ type: 'TOGGLE_ONLINE_STATUS' });
  };

  const registerVehicle = async (data: VehicleRegistration): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({ type: 'REGISTER_VEHICLE', payload: data });
        resolve(true);
      }, 1000);
    });
  };

  const updateVerification = (id: string, status: 'APPROVED' | 'REJECTED') => {
    dispatch({
      type: 'UPDATE_VERIFICATION_STATUS',
      payload: { id, status },
    });
  };

  const submitReport = async (report: IncidentReport): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({ type: 'SUBMIT_INCIDENT_REPORT', payload: report });
        resolve(true);
      }, 800);
    });
  };

  return (
    <RiderAdminContext.Provider
      value={{
        state,
        dispatch,
        toggleOnline,
        registerVehicle,
        updateVerification,
        submitReport,
      }}
    >
      {children}
    </RiderAdminContext.Provider>
  );
}

export function useRiderAdmin(): RiderAdminContextValue {
  const ctx = useContext(RiderAdminContext);
  if (!ctx) {
    throw new Error('useRiderAdmin must be used inside RiderAdminProvider');
  }
  return ctx;
}
