import { dbToken, dbUrl } from "./config";
import { createClient } from "@libsql/client";

export const db = createClient({
  url: dbUrl!,
  authToken: dbToken!
})


