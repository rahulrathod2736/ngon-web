export const apiRoutes = {
  registerUser: "/authentication/register",
  loginUser: "/authentication/signin",
  verifyCode: "/authentication/verification",
  getProfile: "/users/profile",
  getCategories: "/categories",
  uploadAssetModel: "/asset-onboarding/upload",
  assets: "/assets",
  assetMedia: "assets/:assetId/media",
  getAssetDetails: "/assets/:assetId",
  getModelUrls: "assets/:assetId/models",
  deleteModelUrls: "assets/:assetId/models/:modelId",
  likeUnlikeAssets: "/assets/like/:assetId",
  submitReviews: "/assets/review/:assetId",
  submitComment: "/assets/comment/:assetId",
  followUnfollowUsers: "/users/:userId/follow"
};
