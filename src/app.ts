import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth";
import { postsRouter } from "./routes/posts";
import { usersRouter } from "./routes/users";
import { clientHostProduction } from "./config";
import { testRoutes } from "./routes/test";

export const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? clientHostProduction : 'http://localhost:5173',
  credentials: true
}));

app.use(fileUpload({  }));

app.use(authRoutes);
app.use(postsRouter);
app.use(usersRouter);

// en produccion quitar
app.use(testRoutes);