import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}/api/v1/user/register`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}/api/v1/user/login`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ✅ FETCH USER
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API}/api/v1/user/me`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ✅ FETCH LEADERBOARD  🔥 (THIS WAS MISSING)
export const fetchLeaderboard = createAsyncThunk(
  "user/fetchLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API}/api/v1/user/leaderboard`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API}/api/v1/user/logout`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ✅ SLICE
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    leaderboard: [],
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      // LOGIN
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      // FETCH USER
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      // FETCH LEADERBOARD
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload.leaderboard;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default userSlice.reducer;
