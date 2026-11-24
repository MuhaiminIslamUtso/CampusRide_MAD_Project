import React, { createContext, useContext, useReducer } from 'react';
import { FareCalculation, LocationPoint, RideRequest } from '../data/rides';
import { RideAction, RideState, initialRideState, rideReducer } from './ride-reducer';

interface RideContextValue {
    state: RideState;
    dispatch: React.Dispatch<RideAction>;
    calculateFare: (distanceKm: number, vehicleType: 'bike' | 'car') => FareCalculation;
    requestNewRide: (pickup: LocationPoint, destination: LocationPoint, vehicleType: 'bike' | 'car') => RideRequest;
}

const RideContext = createContext<RideContextValue | null>(null);

export function RideProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(rideReducer, initialRideState);

    // Dynamic Fare Calculation Engine (Proposal Feature 1)
    const calculateFare = (distanceKm: number, vehicleType: 'bike' | 'car'): FareCalculation => {
        // Transparent student pricing logic
        const baseFare = vehicleType === 'bike' ? 25 : 60;
        const perKmRate = vehicleType === 'bike' ? 12 : 22;
        const computedFare = Math.round(baseFare + distanceKm * perKmRate);

        return {
            baseFare,
            perKmRate,
            distanceKm: Number(distanceKm.toFixed(1)),
            totalFare: Math.max(computedFare, baseFare),
        };
    };

    const requestNewRide = (
        pickup: LocationPoint,
        destination: LocationPoint,
        vehicleType: 'bike' | 'car'
    ): RideRequest => {
        const estimatedKm = 3.6;
        const fareInfo = calculateFare(estimatedKm, vehicleType);

        const newRide: RideRequest = {
            id: `CR-${Date.now().toString().slice(-5)}`,
            passengerId: '22-47616-2',
            passengerName: 'Muhaimin Islam Utso',
            passengerUniversity: 'AIUB',
            pickup,
            destination,
            vehicleType,
            distanceKm: estimatedKm,
            durationMinutes: Math.round(estimatedKm * 3.5),
            fare: fareInfo.totalFare,
            status: 'SEARCHING',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        dispatch({ type: 'REQUEST_RIDE', payload: newRide });
        return newRide;
    };

    return (
        <RideContext.Provider value={{ state, dispatch, calculateFare, requestNewRide }}>
            {children}
        </RideContext.Provider>
    );
}

export function useRide(): RideContextValue {
    const context = useContext(RideContext);
    if (!context) {
        throw new Error('useRide must be used within a RideProvider');
    }
    return context;
}
