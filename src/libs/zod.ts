import { date, object, string, any, array } from "zod";

const payloadObject = object({
  password: string(),
  email: string().email(),
  bio: string(),
  date: date(),
  name: string(),
  username: string(),
  avatar: any(),
});

type Payload = {
  password: string;
  email: string;
  bio?: string;
  date?: Date;
  name?: string;
  username?: string;
  avatar: any;
};
type VerifyPayloadFn = (
  payload: Payload,
  { action }: { action: "login" | "signup" | string }
) => { ok: boolean; error: any | null };

const verifyClientPayload: VerifyPayloadFn = (payload, { action }) => {
  try {
    const parsedPayload =
      action === "login"
        ? payloadObject
            .partial({ bio: true, date: true, name: true, username: true })
            .parse(payload)
        : payloadObject.parse(payload);

    return {
      ok: parsedPayload && true,
      error: null,
    };
  } catch (e: any) {
    return {
      ok: false,
      error: e.issues,
    };
  }
};

const postPayload = object({
  content: string(),
  images: array(object({})).nullable(),
})

type VerifyPostFn = (payload: { content: string; images?: File[] | null}) => {ok: boolean; error: any | null;}
const verifyPostPayload: VerifyPostFn = (payload) => {
  try {
    const parsedPayload = postPayload.parse(payload)

    return {
      ok: true,
      error: null
    }
  }
  catch(err: any){
    return {
      ok: false,
      error: err.issues
    }
  }
}

export { verifyClientPayload, verifyPostPayload };
