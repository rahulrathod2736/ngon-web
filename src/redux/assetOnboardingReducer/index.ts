import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { axiosInstance } from "../../utils/axios";
import { apiRoutes } from "../../utils/constants/apiRoutes";
import { INgonAsset } from "../../utils/interface";

interface IAuthState {
  isAssetModelUploadLoading: boolean;
  isAssetModelUploadSuccess: Record<string, any>;
  isAssetModelUploadError: string | null;
  isAssetModelCreateLoading: boolean;
  isAssetModelCreateSuccess: Record<string, any>;
  isAssetModelCreateError: string | null;
  isAssetGetDetailsLoading: boolean;
  isAssetGetDetailsSuccess: INgonAsset | null;
  isAssetGetDetailsError: string | null;
  isAssetUpdateStatusLoading: boolean;
  isAssetUpdateStatusSuccess: INgonAsset | null;
  isAssetUpdateStatusError: string | null;
}

const initialState: IAuthState = {
  isAssetModelUploadLoading: false,
  isAssetModelUploadError: null,
  isAssetModelUploadSuccess: {},
  isAssetModelCreateLoading: false,
  isAssetModelCreateError: null,
  isAssetModelCreateSuccess: {},
  isAssetGetDetailsLoading: false,
  isAssetGetDetailsSuccess: null,
  isAssetGetDetailsError: null,
  isAssetUpdateStatusLoading: false,
  isAssetUpdateStatusSuccess: null,
  isAssetUpdateStatusError: null,
};

export const uploadAssetModel = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/uploadAssetModel", async (args, { getState, rejectWithValue }) => {
  try {
    console.log("args", args);
    const formData = new FormData();
    formData.append("file", args.file);
    const resp = await axiosInstance.post(
      apiRoutes.uploadAssetModel,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const assetOnboardingDetails = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>(
  "asset/assetOnboardingDetails",
  async (args, { getState, rejectWithValue }) => {
    try {
      const resp = await axiosInstance.post(
        apiRoutes.assets,
        args.values
      );
      return resp.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAssetDetailsById = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/getAssetDetailsById", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.get(`${apiRoutes.assets}/${args.id}`);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const assetUpdateDetailsById = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>(
  "asset/assetUpdateDetailsById",
  async (args, { getState, rejectWithValue }) => {
    try {
      const resp = await axiosInstance.put(
        `${apiRoutes.assets}/${args.id}`,
        args.values
      );
      return resp.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const assetUpdateByStatus = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/assetUpdateByStatus", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.put(
      `${apiRoutes.assets}/${args.id}/status`,
      {
        status: args.status,
      }
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
  name: "assetOnboarding",
  initialState,
  reducers: {
    resetAssetState: (state) => {
      state.isAssetModelUploadLoading = initialState.isAssetModelUploadLoading;
      state.isAssetModelUploadError = initialState.isAssetModelUploadError;
      state.isAssetModelUploadSuccess = initialState.isAssetModelUploadSuccess;
      state.isAssetModelCreateLoading = initialState.isAssetModelCreateLoading;
      state.isAssetModelCreateError = initialState.isAssetModelCreateError;
      state.isAssetModelCreateSuccess = initialState.isAssetModelCreateSuccess;
      state.isAssetGetDetailsLoading = initialState.isAssetGetDetailsLoading;
      state.isAssetGetDetailsSuccess = initialState.isAssetGetDetailsSuccess;
      state.isAssetGetDetailsError = initialState.isAssetGetDetailsError;
      state.isAssetUpdateStatusLoading =
        initialState.isAssetUpdateStatusLoading;
      state.isAssetUpdateStatusSuccess =
        initialState.isAssetUpdateStatusSuccess;
      state.isAssetUpdateStatusError = initialState.isAssetUpdateStatusError;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAssetModel.pending, (state) => {
        console.log(state, "pending");
        state.isAssetModelUploadLoading = true;
        state.isAssetModelUploadError = null;
      })
      .addCase(uploadAssetModel.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.isAssetModelUploadLoading = false;
        state.isAssetModelUploadSuccess = data;
      })
      .addCase(uploadAssetModel.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isAssetModelUploadLoading = false;
        state.isAssetModelUploadError = action.payload.message;
      });
    builder
      .addCase(assetOnboardingDetails.pending, (state) => {
        console.log(state, "pending");
        state.isAssetModelCreateLoading = true;
        state.isAssetModelCreateError = null;
      })
      .addCase(assetOnboardingDetails.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.isAssetModelCreateLoading = false;
        state.isAssetModelCreateSuccess = data;
      })
      .addCase(assetOnboardingDetails.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isAssetModelCreateLoading = false;
        state.isAssetModelCreateError = action.payload.message;
      });

    builder
      .addCase(assetUpdateDetailsById.pending, (state) => {
        console.log(state, "pending");
        state.isAssetModelCreateLoading = true;
        state.isAssetModelCreateError = null;
      })
      .addCase(assetUpdateDetailsById.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.isAssetModelCreateLoading = false;
        state.isAssetModelCreateSuccess = data;
        state.isAssetGetDetailsSuccess = data;
      })
      .addCase(assetUpdateDetailsById.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isAssetModelCreateLoading = false;
        state.isAssetModelCreateError = action.payload.message;
      });

    builder
      .addCase(getAssetDetailsById.pending, (state) => {
        console.log(state, "pending");
        state.isAssetGetDetailsLoading = true;
        state.isAssetGetDetailsError = null;
      })
      .addCase(getAssetDetailsById.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.isAssetGetDetailsLoading = false;
        state.isAssetGetDetailsSuccess = data;
      })
      .addCase(getAssetDetailsById.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isAssetGetDetailsLoading = false;
        state.isAssetGetDetailsError = action.payload.message;
      });

    builder
      .addCase(assetUpdateByStatus.pending, (state) => {
        console.log(state, "pending");
        state.isAssetUpdateStatusLoading = true;
        state.isAssetUpdateStatusError = null;
      })
      .addCase(assetUpdateByStatus.fulfilled, (state, action) => {
        console.log(state, action, "fulfilled");
        const { data } = action.payload || {};
        state.isAssetUpdateStatusLoading = false;
        state.isAssetUpdateStatusSuccess = data;
        state.isAssetGetDetailsSuccess = data;
      })
      .addCase(assetUpdateByStatus.rejected, (state, action: any) => {
        console.log(state, action, "rejected");
        message.error(action.payload.message);
        state.isAssetUpdateStatusLoading = false;
        state.isAssetUpdateStatusError = action.payload.message;
      });
  },
});

export const { resetAssetState } = slice.actions;

export const assetOnboardingReducer = slice.reducer;
