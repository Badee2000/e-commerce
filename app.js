const express = require("express");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");
const categoryRouter = require("./routes/categoryRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

//SECURITY:

//Set Security HTTP headers
app.use(helmet());

const limiter = rateLimit({
  //One hundred requests
  max: 100,
  //One hour
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
const loginLimiter = rateLimit({
  //One hundred requests
  max: 3,
  //One hour
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/", limiter);
app.use("/users/login", loginLimiter);

//Body parser, reading data from body into body.req
app.use(express.json({ limit: "10kb" }));
// Data sanitization against NoSQL query injection.
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

//Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/admins", adminRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
