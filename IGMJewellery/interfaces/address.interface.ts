export interface SavedAddress {
  id: string;
  isDefault: boolean;
  type: 'Home' | 'Work' | 'Other';
  fullAddress: string;
  phone: string;
  email: string;
}

export interface Address {
  id: string;
  label: string;
  details: string;
  isDefault: boolean;
}