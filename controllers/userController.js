const User = require("../models/User");
const Category = require("../models/Category");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

//Filter fileds:
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1)Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. please use /updateMyPassword.",
        400
      )
    );
  }

  // 2)Filter out unwanted fileds names that are not allowd to be updated.
  //What we want to keep to be updated:
  const filteredBody = filterObj(req.body, "name", "email", "address");

  // 3)Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "sucess",
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  console.log(await user.correctPassword(req.body.password, user.password));
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(
      new AppError(
        "Please insert current password before deactivate the account!",
        403
      )
    );
  }
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // SEND RESPONSE
  res.status(204).json({
    status: "success",
    data: null,
  });
});
