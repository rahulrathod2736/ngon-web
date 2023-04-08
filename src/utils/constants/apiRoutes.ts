export const apiRoutes = {
  registerUser: "/authentication/register",
  loginUser: "/authentication/signin",
  verifyCode: "/authentication/verification",
  getProfile: "/users/profile",
  getCategories: "/categories",
  uploadAssetModel: "/asset-onboarding/upload",
  assets: "/assets",
  getAssetDetails: "/assets/:assetId",
  likeUnlikeAssets: "/assets/like/:assetId",
  submitReviews: "/assets/review/:assetId",
  submitComment: "/assets/comment/:assetId",
  followUnfollowUsers: "/users/:userId/follow"
};
