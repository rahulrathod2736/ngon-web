import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { axiosInstance } from "../../utils/axios";
import { apiRoutes } from "../../utils/constants/apiRoutes";
import { INgonAsset } from "../../utils/interface";

interface IAuthState {
  assets: INgonAsset[];
  isGetAssetsLoading: boolean;
  isGetAssetsError: string | null;
  assetDetails: INgonAsset | null;
  isGetModelUrlLoading: boolean;
  isGetModelUrlError: string | null;
  assetModelUrl: string | null;
  isGetAssetByIdLoading: boolean;
  isGetAssetByIdError: string | null;
  isLikeUnlikeLoading: boolean;
  isLikeUnlikeError: string | null;
  isSubmitReviewLoading: boolean;
  isSubmitReviewError: string | null;
  isSubmitCommentLoading: boolean;
  isSubmitCommentError: string | null;
}

const initialState: IAuthState = {
  assets: [],
  isGetAssetsLoading: false,
  isGetAssetsError: null,
  assetDetails: null,
  isGetModelUrlLoading: false,
  isGetModelUrlError: null,
  assetModelUrl: null,
  isGetAssetByIdLoading: false,
  isGetAssetByIdError: null,
  isLikeUnlikeLoading: false,
  isLikeUnlikeError: null,
  isSubmitReviewLoading: false,
  isSubmitReviewError: null,
  isSubmitCommentLoading: false,
  isSubmitCommentError: null,
};

export const getAssets = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/getAssets", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.get(`${apiRoutes.assets}`);
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const getAssetDetailById = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/getAssetDetailById", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.get(
      `${apiRoutes.getAssetDetails.replace(":assetId", args.id)}`
    );
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const getModelUrl = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/getModelUrl", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.post(
      `${apiRoutes.assetMedia.replace(":assetId", args.id)}`,
      {
        type: "model",
        action: "download",
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

export const likeUnlikeById = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/likeUnlikeById", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.put(
      `${apiRoutes.likeUnlikeAssets.replace(":assetId", args.id)}`
    );
    return resp.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});

export const submitReviews = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/submitReviews", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.put(
      `${apiRoutes.submitReviews.replace(":assetId", args.id)}`,
      {
        rating: args.rating,
        review: args.review,
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

export const submitComment = createAsyncThunk<
  Record<string, any>,
  Record<string, any>
>("asset/submitComment", async (args, { getState, rejectWithValue }) => {
  try {
    const resp = await axiosInstance.put(
      `${apiRoutes.submitComment.replace(":assetId", args.id)}`,
      {
        comment: args.comment,
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
  name: "asset",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAssets.pending, (state) => {
        state.isGetAssetsLoading = true;
        state.isGetAssetsError = null;
      })
      .addCase(getAssets.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        state.isGetAssetsLoading = false;
        state.assets = data;
      })
      .addCase(getAssets.rejected, (state, action: any) => {
        message.error(action.payload.message);
        state.isGetAssetsLoading = false;
        state.isGetAssetsError = action.payload.message;
      });
    builder
      .addCase(getModelUrl.pending, (state, action) => {
        state.isGetAssetsLoading = true;
        state.isGetAssetsError = null;
      })
      .addCase(getModelUrl.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        state.isGetAssetsLoading = false;
        state.assetModelUrl = data?.url || "";
      })
      .addCase(getModelUrl.rejected, (state, action: any) => {
        message.error(action.payload.message);
        state.isGetAssetsLoading = false;
        state.isGetAssetsError = action.payload.message;
      });
    builder
      .addCase(getAssetDetailById.pending, (state) => {
        state.isGetAssetByIdLoading = true;
        state.isGetAssetByIdError = null;
      })
      .addCase(getAssetDetailById.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        state.isGetAssetByIdLoading = false;
        state.assetDetails = data;
      })
      .addCase(getAssetDetailById.rejected, (state, action: any) => {
        message.error(action.payload.message);
        state.isGetAssetByIdLoading = false;
        state.isGetAssetByIdError = action.payload.message;
      });
    builder
      .addCase(likeUnlikeById.pending, (state) => {
        state.isLikeUnlikeLoading = true;
        state.isLikeUnlikeError = null;
      })
      .addCase(likeUnlikeById.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        state.isLikeUnlikeLoading = false;
        state.assetDetails = data;
      })
      .addCase(likeUnlikeById.rejected, (state, action: any) => {
        message.error(action.payload.message);
        state.isLikeUnlikeLoading = false;
        state.isLikeUnlikeError = action.payload.message;
      });
    builder
      .addCase(submitReviews.pending, (state) => {
        state.isSubmitReviewLoading = true;
        state.isSubmitReviewError = null;
      })
      .addCase(submitReviews.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        state.isSubmitReviewLoading = false;
        state.assetDetails = data;
      })
      .addCase(submitReviews.rejected, (state, action: any) => {
        message.error(action.payload.message);
        state.isSubmitReviewLoading = false;
        state.isSubmitReviewError = action.payload.message;
      });
    builder
      .addCase(submitComment.pending, (state) => {
        state.isSubmitCommentLoading = true;
        state.isSubmitCommentError = null;
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        state.isSubmitCommentLoading = false;
        state.assetDetails = data;
      })
      .addCase(submitComment.rejected, (state, action: any) => {
        message.error(action.payload.message);
        state.isSubmitCommentLoading = false;
        state.isSubmitCommentError = action.payload.message;
      });
  },
});

export const assetReducer = slice.reducer;
