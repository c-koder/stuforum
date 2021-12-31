import Post from "./posts/Post";
import Reply from "./replies/Reply";

const Answers = ({ posts, replies, onDelete, repliedBy }) => {
  return (
    <>
      <div>
        {posts.map((post) => (
          <div>
            <Post key={post.id} post={post} />
            {replies.map(
              (reply) =>
                reply.postId === post.id && (
                  <Reply
                    key={reply.id}
                    reply={reply}
                    onDelete={onDelete}
                    repliedBy={repliedBy}
                  />
                )
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Answers;
