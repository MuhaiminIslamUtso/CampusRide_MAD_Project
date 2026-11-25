import {
  IncidentReport,
  MOCK_INCIDENT_REPORTS,
  MOCK_VERIFICATION_REQUESTS,
  VehicleRegistration,
  VerificationRequest,
} from '../data/rider-admin';

export interface RiderAdminState {
  isOnline: boolean;
  activeVehicle: VehicleRegistration | null;
  verificationRequests: VerificationRequest[];
  incidentReports: IncidentReport[];
  totalEarningsToday: number;
  completedRidesCount: number;
}

export const initialRiderAdminState: RiderAdminState = {
  isOnline: true,
  activeVehicle: {
    vehicleType: 'bike',
    vehicleModel: 'Yamaha MT-15 (Black)',
    vehiclePlate: 'DHAKA METRO HA-7721',
    drivingLicenseNo: 'DL-DH-2024-88419',
    documentsUploaded: true,
    approvalStatus: 'APPROVED',
  },
  verificationRequests: MOCK_VERIFICATION_REQUESTS,
  incidentReports: MOCK_INCIDENT_REPORTS,
  totalEarningsToday: 320,
  completedRidesCount: 4,
};

export type RiderAdminAction =
  | { type: 'TOGGLE_ONLINE_STATUS' }
  | { type: 'REGISTER_VEHICLE'; payload: VehicleRegistration }
  | {
      type: 'UPDATE_VERIFICATION_STATUS';
      payload: { id: string; status: 'APPROVED' | 'REJECTED' };
    }
  | { type: 'SUBMIT_INCIDENT_REPORT'; payload: IncidentReport };

export function riderAdminReducer(
  state: RiderAdminState,
  action: RiderAdminAction
): RiderAdminState {
  switch (action.type) {
    case 'TOGGLE_ONLINE_STATUS':
      return {
        ...state,
        isOnline: !state.isOnline,
      };

    case 'REGISTER_VEHICLE':
      return {
        ...state,
        activeVehicle: action.payload,
      };

    case 'UPDATE_VERIFICATION_STATUS':
      return {
        ...state,
        verificationRequests: state.verificationRequests.map((req) =>
          req.id === action.payload.id ? { ...req, status: action.payload.status } : req
        ),
      };

    case 'SUBMIT_INCIDENT_REPORT':
      return {
        ...state,
        incidentReports: [action.payload, ...state.incidentReports],
      };

    default:
      return state;
  }
}
