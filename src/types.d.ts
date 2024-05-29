import type { Request } from "express"

declare enum DB_QUERYS {
  SELECT = 'SELECT',
  FROM = 'FROM',
  WHERE = 'WHERE'
}

declare type User = {}

declare interface ExtendedReq extends Request {
  user?: any
}

declare type Post = {
  post_id: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
  owner: {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar: {
      secureUrl: string;
    }
  };
  likes_user_ids: [] | string[];
  comments: Array<T>;

}