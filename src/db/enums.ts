export const Interaction = {
    UPVOTE: "UPVOTE",
    DOWNVOTE: "DOWNVOTE"
} as const;
export type Interaction = (typeof Interaction)[keyof typeof Interaction];
