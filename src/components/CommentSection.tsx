import React from 'react';
import Comment from './Comment';
import CreateComment from './CreateComment';
import { getNestedComments } from '@/lib/actions/posts/comments/actions';
import { NestedComment } from '@/types/db';

type CommentSectionProps = {
  postId: string;
};

const CommentSection = async ({ postId }: CommentSectionProps) => {
  const comments = await getNestedComments({ postId, replyToId: null });

  if (!comments) {
    return <div>No comments yet</div>;
  }

  return (
    <div className="space-y-20">
      {/* Top level comment */}
      <CreateComment postId={postId} replyToId={null} />
      <div className="space-y-8">
        <h3 className="font-semibold">All comments</h3>
        <div className="flex flex-col max-w-full w-full">{renderComments(comments)}</div>
      </div>
    </div>
  );
};

export default CommentSection;

function renderComments(comments: NestedComment[], level = 0) {
  return comments.map((comment) => <Comment level={level} comment={comment} key={comment.id} />);
}
