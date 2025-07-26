export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  image: string;
  description: string;
  personality: string[];
  medicalHistory: string[];
  adoptionStatus: 'Available' | 'Pending' | 'Adopted';
  dateArrived: string;
  specialNeeds: string[];
}