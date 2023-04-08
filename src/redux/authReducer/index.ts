import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { axiosInstance } from "../../utils/axios";
import { apiRoutes } from "../../utils/constants/apiRoutes";

export const registerUser = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("auth/registerUser", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.post(apiRoutes.registerUser, args);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const verifyCode = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("auth/verifyCode", async (args, { getState, rejectWithValue }) => {
  try {
    const resp: any = await axiosInstance.post(apiRoutes.verifyCode, args);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});
export const loginUser = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("auth/loginUser", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.post(apiRoutes.loginUser, args);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

interface IAuthState {
  isCreateAccountLoading: boolean;
  isCreateAccountSuccess: Record<string, any>;
  isCreateAccountError: string | null;
  isVerificationCodeSent: boolean;
  isVerifyingCodeLoading: boolean;
  isVerifyingCodeSuccess: Record<string, any>;
  isVerifyingCodeError: string | null;
  isLoginLoading: boolean;
  isLoginSuccess: string | null;
  isLoginError: string | null;
}

const initialState: IAuthState = {
  isCreateAccountLoading: false,
  isCreateAccountSuccess: {},
  isCreateAccountError: null,
  isVerificationCodeSent: false,
  isVerifyingCodeLoading: false,
  isVerifyingCodeSuccess: {},
  isVerifyingCodeError: null,
  isLoginLoading: false,
  isLoginSuccess: null,
  isLoginError: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthentication: (state) => {
      state.isCreateAccountError = initialState.isCreateAccountError;
      state.isCreateAccountLoading = initialState.isCreateAccountLoading;
      state.isCreateAccountSuccess = initialState.isCreateAccountSuccess;
      state.isLoginLoading = initialState.isLoginLoading;
      state.isLoginSuccess = initialState.isLoginSuccess;
      state.isLoginError = initialState.isLoginError;
      state.isVerifyingCodeLoading = initialState.isVerifyingCodeLoading;
      state.isVerifyingCodeSuccess = initialState.isVerifyingCodeSuccess;
      state.isVerifyingCodeError = initialState.isVerifyingCodeError;
      state.isVerificationCodeSent = initialState.isVerificationCodeSent;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        console.log(state, "pending");
        state.isCreateAccountLoading = true;
        state.isCreateAccountError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        if (data?._id) {
          state.isVerificationCodeSent = true;
          state.isCreateAccountLoading = false;
          state.isCreateAccountSuccess = action.payload.data;
        }
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isCreateAccountLoading = false;
        state.isCreateAccountError = action?.payload?.message || "";
      });

    builder
      .addCase(verifyCode.pending, (state) => {
        console.log(state, "pending");
        state.isVerifyingCodeLoading = true;
        state.isVerifyingCodeError = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        if (data?.isVerified) {
          state.isVerifyingCodeLoading = false;
          state.isVerifyingCodeSuccess = action.payload.data;
        }
      })
      .addCase(verifyCode.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isVerifyingCodeLoading = false;
        state.isVerifyingCodeSuccess = action?.payload?.message || "";
      });

    builder
      .addCase(loginUser.pending, (state) => {
        console.log(state, "pending");
        state.isLoginLoading = true;
        state.isLoginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        if (data) {
          message.success("Login Successfully");
          state.isLoginLoading = false;
          state.isLoginSuccess = action.payload.data;
        }
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isLoginLoading = false;
        state.isLoginSuccess = action?.payload?.message || "";
      });
  },
});

export const { resetAuthentication } = slice.actions;

export const authReducer = slice.reducer;
