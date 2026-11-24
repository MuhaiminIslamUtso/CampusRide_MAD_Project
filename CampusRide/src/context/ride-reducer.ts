import { MOCK_RIDE_HISTORY } from '../data/mock-rides';
import { RideRequest, RideStatus, Rider } from '../data/rides';

export interface RideState {
    currentRide: RideRequest | null;
    history: RideRequest[];
    isSearching: boolean;
}

export const initialRideState: RideState = {
    currentRide: null,
    history: MOCK_RIDE_HISTORY,
    isSearching: false,
};

export type RideAction =
    | { type: 'REQUEST_RIDE'; payload: RideRequest }
    | { type: 'RIDER_ASSIGNED'; payload: Rider }
    | { type: 'UPDATE_STATUS'; payload: RideStatus }
    | { type: 'CANCEL_RIDE' }
    | { type: 'COMPLETE_RIDE' }
    | { type: 'RESET_CURRENT_RIDE' };

export function rideReducer(state: RideState, action: RideAction): RideState {
    switch (action.type) {
        case 'REQUEST_RIDE':
            return {
                ...state,
                currentRide: action.payload,
                isSearching: true,
            };

        case 'RIDER_ASSIGNED':
            if (!state.currentRide) return state;
            return {
                ...state,
                isSearching: false,
                currentRide: {
                    ...state.currentRide,
                    status: 'ACCEPTED',
                    rider: action.payload,
                },
            };

        case 'UPDATE_STATUS':
            if (!state.currentRide) return state;
            return {
                ...state,
                currentRide: {
                    ...state.currentRide,
                    status: action.payload,
                },
            };

        case 'CANCEL_RIDE':
            if (!state.currentRide) return state;
            const cancelledRide: RideRequest = {
                ...state.currentRide,
                status: 'CANCELLED',
            };
            return {
                ...state,
                isSearching: false,
                currentRide: null,
                history: [cancelledRide, ...state.history],
            };

        case 'COMPLETE_RIDE':
            if (!state.currentRide) return state;
            const completedRide: RideRequest = {
                ...state.currentRide,
                status: 'COMPLETED',
                completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            return {
                ...state,
                currentRide: completedRide,
                isSearching: false,
                history: [completedRide, ...state.history],
            };

        case 'RESET_CURRENT_RIDE':
            return {
                ...state,
                currentRide: null,
                isSearching: false,
            };

        default:
            return state;
    }
}
