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
      return rejectWithValue(error.response?.data || "Register failed");
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
      return rejectWithValue(error.response?.data || "Login failed");
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
      return rejectWithValue(error.response?.data || "Fetch failed");
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
      return rejectWithValue(error.response?.data || "Logout failed");
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
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default userSlice.reducer;
