import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

// Define types for state and actions
interface AuthState {
    isAuthenticated: boolean;
    user: object | null;
    token: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterInfo {
    name: string;
    email: string;
    phone: string;
    password_confirmation: string;
    password: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    status: "idle",
    error: null,
};

// Async thunk to handle login
export const login = createAsyncThunk(
    "auth/login",
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_DATA_API + "/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            Cookies.set("token", data.token, { expires: 7 });
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

// Async thunk to handle registration
export const register = createAsyncThunk(
    "auth/register",
    async (userInfo: RegisterInfo, { rejectWithValue }) => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_DATA_API + "/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userInfo),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            Cookies.set("token", data.token, { expires: 7 });

            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

// Async thunk to handle logout
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { getState, rejectWithValue }) => {
        const { token } = (getState() as { auth: AuthState }).auth;

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_DATA_API + "/auth/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "x-access-token": token }),
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            Cookies.remove("token");
            return {};
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

// Async thunk to fetch user info
export const fetchUserInfo = createAsyncThunk(
    "auth/fetchUserInfo",
    async (_, { getState, rejectWithValue }) => {
        const { token } = (getState() as { auth: AuthState }).auth;

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_DATA_API + "/user/user_info",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "x-access-token": token }),
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated: (state, action: { payload: boolean }) => {
            state.isAuthenticated = action.payload;
        },
        setUser: (state, action: { payload: object }) => {
            state.user = action.payload;
        },
        setToken: (state, action: { payload: string | null }) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        // Login handlers
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                toast.success("Login successful!");
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as { detail: string }).detail || action.error.message || null;
                toast.error(`Login failed: ${state.error}`);
            });

        // Registration handlers
        builder
            .addCase(register.pending, (state) => {
                state.status = "loading";
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                toast.success("Registration successful!");
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as { detail: string }).detail || action.error.message || null;
                toast.error(`Register failed: ${state.error}`);
            });

        // Logout handlers
        builder
            .addCase(logout.pending, (state) => {
                state.status = "loading";
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = "idle";
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as { detail: string }).detail || action.error.message || null;
                toast.error(`Logout failed: ${state.error}`);
            });

        // Fetch user info handlers
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as { detail: string }).detail || action.error.message || null;
                state.isAuthenticated = false;
            });
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initializeAuth = () => (dispatch: any) => {
    if (typeof window !== "undefined") {
        const token = Cookies.get("token");
        if (token) {
            dispatch(setToken(token));
            dispatch(fetchUserInfo());
        }
    }
};

// Export actions and reducer
export const { setAuthenticated, setUser, setToken } = authSlice.actions;
export const selectStatus = (initialState: { status: string; }) => initialState?.status
export default authSlice.reducer;
