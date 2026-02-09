import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./apiUrl.const";

// --- Types for the new endpoint ---
export interface ProfileData {
  full_name: string;
  gender: string;
  date_of_birth: string;
  city: string;
  preferred_language: string;
  identity: string;
  shopping_for: string;
  jewelry_preference: string;
}

export interface RegisterProfileRequest {
  mobileNumber: string;
  verificationToken: string;
  profileData: ProfileData;
}

export const otpApiService = createApi({
  reducerPath: "otpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // --- SEND OTP SECTION ---

    sendRegistrationOtp: builder.mutation<
      { message: string },
      { mobileNumber: string }
    >({
      query: (payload) => ({
        url: "/default/V1/customer-register/send-otp",
        method: "POST",
        body: payload,
      }),
    }),

    sendLoginOtp: builder.mutation<
      { message: string },
      { mobileNumber: string }
    >({
      query: (payload) => ({
        url: "/default/V1/otp/customer/request",
        method: "POST",
        body: payload,
      }),
    }),

    // --- VERIFY OTP SECTION ---

    verifyRegistrationOtp: builder.mutation<
      { verification_token: string; success: boolean },
      { mobileNumber: string; otp: string }
    >({
      query: (payload) => ({
        url: "/default/V1/customer-register/verify-otp",
        method: "POST",
        body: payload,
      }),
    }),

    verifyLoginOtp: builder.mutation<
      string,
      { mobileNumber: string; otp: string }
    >({
      query: (payload) => ({
        url: "/default/V1/otp/customer/verify",
        method: "POST",
        body: payload,
      }),
    }),

    // --- PROFILE SECTION ---

    registerCustomerProfile: builder.mutation<
      { message: string; status: string },
      RegisterProfileRequest
    >({
      query: (payload) => ({
        url: "/default/V1/customer-register/register-profile",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useSendRegistrationOtpMutation,
  useSendLoginOtpMutation,
  useVerifyRegistrationOtpMutation,
  useVerifyLoginOtpMutation,
  useRegisterCustomerProfileMutation, // Export the new hook
} = otpApiService;
