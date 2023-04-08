import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { axiosInstance } from "../../utils/axios";
import { apiRoutes } from "../../utils/constants/apiRoutes";

// export const registerUser = createAsyncThunk<
//   Record<string, any>,
//   Record<string, any>
// >("auth/registerUser", async (args, { getState, rejectWithValue }) => {
//   try {
//     const resp = await axiosInstance.post(apiRoutes.registerUser, args);
//     return resp.data;
//   } catch (err: any) {
//     if (!err.response) {
//       throw err;
//     }
//     return rejectWithValue(err.response.data);
//   }
// });

interface IAuthState {
  userProfile: Record<string, any>;
  authToken: string | null;
  categories: Record<string, any>[];
  isGetProfileLoading: boolean;
  isGetProfileError: string | null;
  isFollowUnfollowLoading: boolean
  isFollowUnfollowError: string | null,
}

const initialState: IAuthState = {
  userProfile: {},
  authToken: null,
  categories: [],
  isGetProfileLoading: false,
  isGetProfileError: null,
  isFollowUnfollowLoading: false,
  isFollowUnfollowError: null,
};

export const getCategories = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("auth/getCategories", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.get(apiRoutes.getCategories);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const getProfile = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("auth/getProfile", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.get(apiRoutes.getProfile);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const followUnfollowUsers = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("user/followUnfollowUsers", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.put(
      `${apiRoutes.followUnfollowUsers.replace(":userId", args.id)}`
    );
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      // state.userProfile = action.payload.user;
      state.authToken = action.payload;
    },
    logout: (state, action: PayloadAction<{}>) => {
      // state.userProfile = action.payload.user;
      state.authToken = null;
      state.userProfile = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        console.log(state, "pending");
        // state.isCreateAccountLoading = true;
        // state.isCreateAccountError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.categories = data;
      })
      .addCase(getCategories.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        // state.isCreateAccountLoading = false;
        // state.isCreateAccountError = action?.payload?.message || "";
      });
    builder
      .addCase(getProfile.pending, (state) => {
        console.log(state, "pending");
        state.isGetProfileLoading = true;
        state.isGetProfileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.userProfile = data;
        state.isGetProfileLoading = false;
      })
      .addCase(getProfile.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isGetProfileLoading = false;
        state.isGetProfileError = action?.payload?.message || "";
      });
    builder
      .addCase(followUnfollowUsers.pending, (state) => {
        console.log(state, "pending");
        state.isFollowUnfollowLoading = true;
        state.isFollowUnfollowError = null;
      })
      .addCase(followUnfollowUsers.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.userProfile = data;
        state.isFollowUnfollowLoading = false;
      })
      .addCase(followUnfollowUsers.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isFollowUnfollowLoading = false;
        state.isFollowUnfollowError = action?.payload?.message || "";
      });
  },
});

export const { setToken, logout } = slice.actions;

export const userReducer = slice.reducer;
