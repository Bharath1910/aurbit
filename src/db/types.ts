import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type comments = {
    id: Generated<string>;
    post_id: string;
    content: string;
    parent_id: string | null;
};
export type communities = {
    name: string;
    description: string | null;
    owner: string;
};
export type members = {
    community_id: string;
    username: string;
};
export type posts = {
    id: Generated<string>;
    community_id: string;
    username: string;
    title: string;
    votes: Generated<number>;
    content: string | null;
    image: string | null;
    created_at: Generated<Timestamp>;
};
export type users = {
    username: string;
    password: string;
    pfp: string | null;
    aura: Generated<number>;
    bio: string | null;
};
export type DB = {
    comments: comments;
    communities: communities;
    members: members;
    posts: posts;
    users: users;
};
