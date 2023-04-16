export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  label: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  rating: number;
  review: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  _id: string;
}

export interface IComment {
  comment: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  _id: string;
}

export interface INgonAsset {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: ICategory[];
  tags: string[];
  price: number;
  status: string;
  likes: string[];
  reviews: IReview[];
  comments: IComment[];
  user: IUser;
  license?: {
    attribution: boolean;
    nonCommercial: boolean;
    noDerivatives: boolean;
    shareAlike: boolean;
  };
  createdAt: string;
  updatedAt: string;
  modelUrl?: string;
  priceModel?: "free" | "paid";
}
