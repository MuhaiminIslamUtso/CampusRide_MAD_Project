export interface University {
  id: string;
  name: string;
  shortName: string;
  campusLocation: string;
  domain: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const UNIVERSITIES: University[] = [
  {
    id: 'aiub',
    name: 'American International University-Bangladesh',
    shortName: 'AIUB',
    campusLocation: '408/1, Kuratoli, Khilkhet, Dhaka 1229',
    domain: 'aiub.edu',
    coordinates: { latitude: 23.8222, longitude: 90.4273 },
  },
  {
    id: 'nsu',
    name: 'North South University',
    shortName: 'NSU',
    campusLocation: 'Plot 15, Block B, Bashundhara R/A, Dhaka 1229',
    domain: 'northsouth.edu',
    coordinates: { latitude: 23.8151, longitude: 90.4255 },
  },
  {
    id: 'iub',
    name: 'Independent University, Bangladesh',
    shortName: 'IUB',
    campusLocation: 'Plot 16, Block B, Bashundhara R/A, Dhaka 1229',
    domain: 'iub.edu.bd',
    coordinates: { latitude: 23.8164, longitude: 90.4284 },
  },
  {
    id: 'brac',
    name: 'BRAC University',
    shortName: 'BRACU',
    campusLocation: 'Merul Badda, Dhaka 1212',
    domain: 'g.bracu.ac.bd',
    coordinates: { latitude: 23.7744, longitude: 90.4252 },
  },
  {
    id: 'du',
    name: 'University of Dhaka',
    shortName: 'DU',
    campusLocation: 'Nilkhet Road, Dhaka 1000',
    domain: 'du.ac.bd',
    coordinates: { latitude: 23.7340, longitude: 90.3928 },
  },
  {
    id: 'buet',
    name: 'Bangladesh University of Engineering and Technology',
    shortName: 'BUET',
    campusLocation: 'Palashi, Dhaka 1000',
    domain: 'buet.ac.bd',
    coordinates: { latitude: 23.7265, longitude: 90.3888 },
  },
  {
    id: 'diu',
    name: 'Daffodil International University',
    shortName: 'DIU',
    campusLocation: 'Daffodil Smart City, Ashulia, Dhaka',
    domain: 'daffodilvarsity.edu.bd',
    coordinates: { latitude: 23.8767, longitude: 90.3204 },
  },
  {
    id: 'ewu',
    name: 'East West University',
    shortName: 'EWU',
    campusLocation: 'A/2, Jahurul Islam Avenue, Jahurul Islam City, Aftabnagar, Dhaka',
    domain: 'ewubd.edu',
    coordinates: { latitude: 23.7686, longitude: 90.4256 },
  },
];
