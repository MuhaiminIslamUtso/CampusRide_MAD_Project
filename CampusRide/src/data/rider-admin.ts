export interface VehicleRegistration {
  vehicleType: 'bike' | 'car';
  vehicleModel: string;
  vehiclePlate: string;
  drivingLicenseNo: string;
  documentsUploaded: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface VerificationRequest {
  id: string;
  studentName: string;
  studentId: string;
  university: string;
  department: string;
  requestType: 'STUDENT_ID' | 'VEHICLE_RIDER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  vehicleDetails?: string;
  licenseNumber?: string;
}

export interface IncidentReport {
  id: string;
  rideId: string;
  reportedBy: string;
  reporteeName: string;
  category: 'SAFETY' | 'OVERCHARGING' | 'BEHAVIOR' | 'VEHICLE_CONDITION' | 'OTHER';
  rating: number;
  description: string;
  submittedAt: string;
  resolved: boolean;
}

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'req-201',
    studentName: 'M M Shafayetul Islam Farhaz',
    studentId: '22-47940-2',
    university: 'AIUB',
    department: 'Computer Science',
    requestType: 'VEHICLE_RIDER',
    status: 'PENDING',
    submittedAt: 'Today, 10:15 AM',
    vehicleDetails: 'Yamaha MT-15 (Black) • DHAKA METRO HA-7721',
    licenseNumber: 'DL-DH-2024-88419',
  },
  {
    id: 'req-202',
    studentName: 'Arafat Rahman',
    studentId: '21-44112-2',
    university: 'NSU',
    department: 'BBA',
    requestType: 'STUDENT_ID',
    status: 'PENDING',
    submittedAt: 'Today, 09:30 AM',
  },
  {
    id: 'req-203',
    studentName: 'Saad Al Rafi',
    studentId: '22-54321-3',
    university: 'AIUB',
    department: 'Software Engineering',
    requestType: 'VEHICLE_RIDER',
    status: 'APPROVED',
    submittedAt: 'Yesterday, 04:20 PM',
    vehicleDetails: 'Suzuki Gixxer SF • DHAKA METRO LA-3312',
    licenseNumber: 'DL-DH-2023-11209',
  },
];

export const MOCK_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'rep-301',
    rideId: 'CR-90412',
    reportedBy: '22-47399-2 (Junayed)',
    reporteeName: 'Tanvir Ahmed',
    category: 'SAFETY',
    rating: 5,
    description: 'Smooth and careful ride to Kuratoli gate. Helmet provided.',
    submittedAt: 'Yesterday, 02:40 PM',
    resolved: true,
  },
  {
    id: 'rep-302',
    rideId: 'CR-88123',
    reportedBy: '22-47616-2 (Utso)',
    reporteeName: 'Sabbir Hossain',
    category: 'BEHAVIOR',
    rating: 4,
    description: 'Friendly peer commuter, reached on time for midterm exam.',
    submittedAt: '2 days ago',
    resolved: true,
  },
];
