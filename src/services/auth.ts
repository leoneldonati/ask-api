import User from "../db-models/user";
import { compare } from "../libs/bcrypt";
import { signToken } from "../libs/jwt";

type AuthFnResponse = {
  status: number;
  message: string;
  error?: any;
  data?: any;
}

type LoginFn = ({ email, password }: { email: string; password: string; }) => Promise<AuthFnResponse>;

const login: LoginFn = async ({ email, password }) => {
  try {
    
    const user = await User.findOne({ email })

    if (!user) return {
      status: 401,
      message: 'Invalid credentials, please provide correct credentials or sing up.'
    }

    const isMatch = await compare(password, user.hash!)

    if (!isMatch) return {
      status: 401,
      message: 'Invalid credentials, please provide correct credentials or sing up.'
    }

    const token = signToken({ user, loggedAt: new Date(Date.now()) })

    return {
      status: 200,
      message: 'Login succefully.',
      data: token as string
    }
  }
  catch (error) {
    return {
      status: 500,
      error,
      message: 'Error on login function.'
    }
  }
}


export {
  login
}