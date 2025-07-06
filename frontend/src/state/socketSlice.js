import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: null,
  reducers: {
    setSocket: (state, action) => action.payload,
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
