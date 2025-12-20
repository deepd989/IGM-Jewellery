export interface SavedAddress {
  id: string;
  isDefault: boolean;
  type: 'Home' | 'Work' | 'Other';
  fullAddress: string;
  phone: string;
  email: string;
}