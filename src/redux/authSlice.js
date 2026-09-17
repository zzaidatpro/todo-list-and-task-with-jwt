import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // <--- Remis à JSON
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Échec de la connexion');
  return await res.json();
});

export const registerUser = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // <--- Remis à JSON
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Échec de l\'inscription');
  return await res.json();
});

const tokenFromStorage = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: tokenFromStorage || null,
    user: null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload;
        localStorage.setItem('token', action.payload.token);
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;   