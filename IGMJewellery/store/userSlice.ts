import { Address } from "@/interfaces/address.interface";
import {
    PaymentMethod,
    Preferences,
    Profile,
} from "@/interfaces/profile.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../interfaces/user.interface";

interface UserState {
  profile: Profile;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: Preferences;
  isAuthenticated?: boolean;
}

// const initialState: User = {
//   id: '0',
//   name: 'Guest',
//   contactNumber: '12398765432',
//   email: 'guest@gmail.com',
// };

const initialState: UserState = {
  profile: {
    customerId: 5, // Hardcoded for wishlist API - will be set from auth in future
    name: "Welcome, User",
    phone: "+91 9876543221",
    email: "",
    points: 2980,
    tier: "Elite Shopper",
    memberSince: "Aug, 2025",
  },
  addresses: [
    {
      id: "1",
      label: "Default",
      details:
        "144, Avon Classic, Suren Road, Line two, Andheri East, Mumbai 400 010",
      isDefault: true,
    },
  ],
  paymentMethods: [
    {
      id: "1",
      type: "UPI",
      provider: "Google Pay",
      identifier: "username@okhdfcbank",
    },
    {
      id: "2",
      type: "Card",
      provider: "HDFC",
      category: "Credit",
      identifier: "***********553",
    },
    {
      id: "3",
      type: "Card",
      provider: "HDFC",
      category: "Debit",
      identifier: "***********553",
    },
  ],
  preferences: {
    language: "English",
    currency: "INR",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (
      state,
      action: PayloadAction<Partial<UserState["profile"]>>,
    ) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserState["preferences"]>>,
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(
        (m) => m.id !== action.payload,
      );
    },
    addLoyaltyPoints: (state, action: PayloadAction<number>) => {
      state.profile.points += action.payload;

      if (state.profile.points >= 5000) {
        state.profile.tier = "IGM Star";
      } else if (state.profile.points >= 1000) {
        state.profile.tier = "Elite Shopper";
      } else {
        state.profile.tier = "New Shopper";
      }
    },

    redeemLoyaltyPoints: (state, action: PayloadAction<number>) => {
      if (state.profile.points >= action.payload) {
        state.profile.points -= action.payload;
      }
    },

    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.profile = initialState.profile;
    },
  },
});

// Selector to get the user
export const selectUser = (state: { user: User }) => state.user;

export const {
  updateProfile,
  updatePreferences,
  removePaymentMethod,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  setAuthenticated,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
