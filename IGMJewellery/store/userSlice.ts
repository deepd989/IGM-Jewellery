import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../interfaces/user.interface';

const initialState: User = {
  id: '0',
  name: 'Guest',
  contactNumber: '12398765432',
  email: 'guest@gmail.com',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

// Selector to get the user
export const selectUser = (state: { user: User }) => state.user;

export default userSlice.reducer;