import * as z from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  street: z.string().min(5, "Enter a valid street address"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  pincode: z.string().length(6, "6-digit pincode required").regex(/^\d+$/),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().length(10, "10-digit phone required").regex(/^\d+$/),
  email: z.string().email("Invalid email address"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
