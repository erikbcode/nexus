export type CreateCommentOptions = {
  data: {
    postId: string;
    text: string;
    replyToId: string | null;
  };
};

export type CreateCommentResponse = {
  status: number;
  data: {
    title: string;
    description: string;
    commentId?: string;
  };
};

export type UpdateCommentVoteOptions = {
  data: {
    commentId: string;
    voteType: VoteType;
  };
};
