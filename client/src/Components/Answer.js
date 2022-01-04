import Post from "./posts/Post";
import Reply from "./replies/Reply";

const Answers = ({ posts, replies, onDelete }) => {
  return (
    <div>
      {posts.map((post) => (
        <div>
          <Post key={post.id} post={post} answerOnly={true} />
          {replies.map(
            (reply) =>
              reply.post_id === post.id && (
                <Reply
                  key={reply.id}
                  reply={reply}
                  onDelete={onDelete}
                  answered={true}
                  answerOnly={true}
                />
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Answers;
