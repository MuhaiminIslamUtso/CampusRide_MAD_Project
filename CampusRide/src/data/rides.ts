export interface Rider {
    id: string;
    name: string;
    studentId: string;
    university: string;
    rating: number;
    totalTrips: number;
    vehicleType: 'bike' | 'car';
    vehiclePlate: string;
    vehicleModel: string;
    phone: string;
    avatarUrl: string;
}

export type RideStatus = 'IDLE' | 'SEARCHING' | 'ACCEPTED' | 'ARRIVED' | 'IN_TRIP' | 'COMPLETED' | 'CANCELLED';

export interface LocationPoint {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface RideRequest {
    id: string;
    passengerId: string;
    passengerName: string;
    passengerUniversity: string;
    pickup: LocationPoint;
    destination: LocationPoint;
    vehicleType: 'bike' | 'car';
    distanceKm: number;
    durationMinutes: number;
    fare: number;
    status: RideStatus;
    rider?: Rider;
    createdAt: string;
    completedAt?: string;
}

export interface FareCalculation {
    baseFare: number;
    perKmRate: number;
    distanceKm: number;
    totalFare: number;
}
