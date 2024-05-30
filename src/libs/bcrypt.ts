import bcrypt from "bcrypt";

type EncryptFn = (password: string) => Promise<string>;
type CompareFn = (password: string, hash: string) => Promise<boolean>;

const encrypt: EncryptFn = async (password) => {
  return await bcrypt.hash(password, 10);
};

const compare: CompareFn = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export { encrypt, compare };
