import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

// ✅ Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// ================= REGISTER =================
export const register = catchAsyncErrors(async (req, res, next) => {
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  const profileImage = req.files?.profileImage;

  if (profileImage && !allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(new ErrorHandler("Please provide bank details.", 400));
    }
    if (!easypaisaAccountNumber) {
      return next(new ErrorHandler("Provide easypaisa number.", 400));
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Provide paypal email.", 400));
    }
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  // Default image
  let profileImageData = {
    public_id: "default",
    url: "https://via.placeholder.com/150",
  };

  // Upload to Cloudinary (if configured)
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    profileImage
  ) {
    const result = await cloudinary.uploader.upload(
      profileImage.tempFilePath || profileImage,
      { folder: "users" }
    );

    profileImageData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: profileImageData,
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      easypaisa: {
        easypaisaAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });

  const token = generateToken(user);

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "User Registered",
      user,
    });
});

// ================= LOGIN =================
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  const token = generateToken(user);

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Login successful",
      user,
    });
});

// ================= PROFILE =================
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ================= LOGOUT =================
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});

// ================= LEADERBOARD =================
export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });

  const leaderboard = users.sort(
    (a, b) => b.moneySpent - a.moneySpent
  );

  res.status(200).json({
    success: true,
    leaderboard,
  });
});
