import Post from "./posts/Post";
import Reply from "./replies/Reply";

const Answers = ({ posts, replies, tags, postPref, onDelete }) => {
  const getPref = (id) => {
    return postPref.filter((pref) => {
      return pref.post_id === id;
    });
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            key={post.id}
            post={post}
            postPref={getPref(post.id)}
            tags={tags.filter((tag) => tag.post_id == post.id)}
            answerOnly={true}
          />
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
