/**
 * Profile-related interface
 */
export interface Profile {
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: string;
  memberSince: string;
}

export interface PaymentMethod {
  id: string;
  type: 'UPI' | 'Card';
  provider: string; // e.g., 'Google Pay', 'HDFC'
  identifier: string; // e.g., 'user@upi' or '**** 553'
  category?: 'Credit' | 'Debit';
}

export interface Preferences {
    language: string;
    currency: string;
  };