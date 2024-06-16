import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  role: null,
  offer: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.offer = action.payload.offer;
    },
    resetUser: (state) => {
      state.id = null;
      state.email = null;
      state.role = null;
      state.offer = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
