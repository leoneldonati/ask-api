import type fileUpload from "express-fileupload";
import User from "../db-models/user";
import { compare, encrypt } from "../libs/bcrypt";
import { signToken } from "../libs/jwt";
import { UserPayload } from "../controllers/auth";
import { uploadFile } from "../libs/cloudinary";


export const DEFAULT_AVATAR = "https://res.cloudinary.com/dzmuriaby/image/upload/v1701369252/avatares/ucqpxvyuji2z0gqwbwg9.png";

type AuthFnResponse = {
  status: number;
  message: string;
  error?: any;
  data?: any;
  token?: string;
};

type LoginFn = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => Promise<AuthFnResponse>;


const login: LoginFn = async ({ email, password }) => {
  // TODO: implementar funcion para parsear el payload del cliente
  try {
    const user = await User.findOne({ email });

    if (!user)
      return {
        status: 401,
        message:
          "Invalid credentials, please provide correct credentials or sing up.",
      };

    const isMatch = await compare(password, user.hash!);

    if (!isMatch)
      return {
        status: 401,
        message:
          "Invalid credentials, please provide correct credentials or sing up.",
      };

    const token = signToken({ user, loggedAt: new Date(Date.now()) });

    return {
      status: 200,
      message: "Login succefully.",
      data: user,
      token
    };
  } catch (error) {
    return {
      status: 500,
      error,
      message: "Error on login function.",
    };
  }
};

type SignUpFn = ({
  payload,
  avatar,
}: {
  payload: UserPayload;
  avatar: fileUpload.FileArray | null | undefined;
}) => Promise<AuthFnResponse>;

const signup: SignUpFn = async ({ payload, avatar }) => {
  try {
    const user = await User.findOne({ email: payload.email });

    if (user)
      return {
        status: 400,
        message: `This email: @${payload.email}; already exists. Please provide other email.`,
      };

    const hash = await encrypt(payload.password);

    const { ok, uploadedFile } = await uploadFile(avatar!, {
      folder: "avatares",
    });

    const newUser = new User({
      name: payload.name,
      username: payload.username,
      bio: payload.bio,
      date: payload.date,
      email: payload.email,
      followed: [],
      followers: [],
      posts: [],
      isVerified: false,
      hash,
      avatar: uploadedFile ?? {secureUrl: DEFAULT_AVATAR},
    });

    const userSaved = await newUser.save()


    const token = signToken({ loggedAt: new Date(Date.now()), user: userSaved })

    return {
      status: 200,
      message: "Good! You have created an account succefully!",
      data: token as string,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Error on signun function.",
      error: e,
    };
  }
};

export { login, signup };
