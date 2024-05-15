import { date, object, string, any } from "zod";

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
  { action }: { action: "login" | "signup" }
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

export { verifyClientPayload };
