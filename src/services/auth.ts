import type fileUpload from "express-fileupload";
import { compare, encrypt } from "../libs/bcrypt";
import { signToken } from "../libs/jwt";
import { UserPayload } from "../controllers/auth";
import { uploadFile } from "../libs/cloudinary";
import { db } from "../db";

export const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dzmuriaby/image/upload/v1701369252/avatares/ucqpxvyuji2z0gqwbwg9.png";

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
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = $email",
      args: {
        email,
      },
    });
    if (result.rows.length === 0)
      return {
        status: 401,
        message:
          "Invalid credentials, please provide correct credentials or sing up.",
      };

    const user = result.rows[0];

    const isMatch = await compare(password, user.hash!.toString());

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
      token,
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
    const user = await db.execute({
      sql: "SELECT * FROM users WHERE email = $email",
      args: {
        email: payload.email,
      },
    });

    if (user.rows.length > 0)
      return {
        status: 400,
        message: `This email: @${payload.email}; already exists. Please provide other email.`,
      };

    const hash = await encrypt(payload.password);

    // const { uploadedFile } = await uploadFile(avatar!, {
    //   folder: "avatares",
    // });
    console.log(avatar);

    const result = await db.execute({
      sql: "INSERT INTO users (id, name, username, email, hash, bio, date, isVerified, avatar, settings) VALUES ($id, $name, $username, $email, $hash, $bio, $date, $isVerified, $avatar, $settings)",
      args: {
        id: crypto.randomUUID(),
        name: payload.name!,
        username: payload.username!,
        email: payload.email!,
        hash,
        bio: payload.bio!,
        date: payload.date!,
        isVerified: false,
        avatar: JSON.stringify({
          secureUrl: "",
        }),
        settings: JSON.stringify({
          notifications: false,
          theme: "light",
        }),
      },
    });

    const token = signToken({
      loggedAt: new Date(Date.now()),
      user: result.rows[0],
    });

    return {
      status: 200,
      message: "Good! You have created an account succefully!",
      data: token as string,
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Error on signun function.",
      error: e,
    };
  }
};

export { login, signup };
