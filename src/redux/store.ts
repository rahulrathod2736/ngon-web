import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { combineReducers } from "redux";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import { userReducer } from "./userReducer";
import { assetOnboardingReducer } from "./assetOnboardingReducer";
import { assetReducer } from "./assetReducer";

const rootReducer = combineReducers({
  authentication: authReducer,
  user: userReducer,
  assetOnboarding: assetOnboardingReducer,
  asset: assetReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [logger, thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
