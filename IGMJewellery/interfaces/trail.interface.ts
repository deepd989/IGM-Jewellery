import { Product } from "./product.interface";


export type TrialStatus = 'Scheduled' | 'Cancelled' | 'Executed' | 'InTransit' | 'Delivered';

export interface TrialRequest {
  id: string;
  displayId: string;
  status: TrialStatus;
  statusLabel: string;
  items: Partial<Product>[];
  requestedDate: string;
  appointmentDate: string;
  cancellationDate?: string;
  bookingTime?: string;
  bookingAddress?: string;
  nearestStore?: string;
}