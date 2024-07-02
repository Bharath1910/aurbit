import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type communities = {
    name: string;
    description: string | null;
};
export type members = {
    community_id: string;
    username: string;
};
export type posts = {
    id: Generated<string>;
    community_id: string;
    title: string;
    content: string | null;
    upvotes: Generated<number>;
    downvotes: Generated<number>;
    image: string | null;
};
export type users = {
    username: string;
    password: string;
    pfp: string | null;
    aura: Generated<number>;
    bio: string | null;
};
export type DB = {
    communities: communities;
    members: members;
    posts: posts;
    users: users;
};
