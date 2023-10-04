const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!."],
  },
  email: {
    type: String,
    lowercase: true, // Convert email to lowercase
    unique: true, // Ensure that each email is unique
    required: [true, "Please provide your email!."],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  address: {
    type: String,
    required: [true, "Please provide your address!."],
  },
  password: {
    type: String,
    required: [true, "Please provide your password!."],
    minLength: [8],
    //Add validation to accept hard passwords only!!!.
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!."],
    validate: {
      validator: function (el) {
        return el === this.password; // Validate that passwordConfirm matches the password field
      },
    },
    message: "Passwords are not the same!.", // Custom error message if validation fails
  },
  passwordChangedAt: {
    type: Date,
    select: true, // Include passwordChangedAt field in query results
  },

  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true, // Default active status is true
    select: false, // Active status will not be returned in query results by default
  },
});
//Pre functions:
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  //This point to the current query
  this.find({ active: { $ne: false } });
  next();
});

//Schema methods:
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //If it is exist
  if (this.passwordChangedAt) {
    //We need to change the type from date to seconds:
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  //False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //we sent the unencrypted reset token via email.
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
