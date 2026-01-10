/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BaseAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  street: string;
  landmark?: string;

  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface SavedAddress extends BaseAddress {
  id: string;
  isDefault: boolean;
  type: "Home" | "Work" | "Other";
}

export interface DeliveryAddress extends BaseAddress {}

export interface BillingAddress extends BaseAddress {
  sameAsDelivery: boolean;
}

export interface Address {
  id: string;
  label: string;
  details: string;
  isDefault: boolean;
}
