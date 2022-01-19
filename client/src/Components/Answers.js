import Post from "./posts/Post";
import Reply from "./replies/Reply";

const Answers = ({ socket, posts, replies, tags, postPref, onDelete }) => {
  console.log(postPref);
  const getPref = (id) => {
    return postPref.find((pref) => {
      return pref.post_id === id;
    });
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            socket={socket}
            key={post.id}
            post={post}
            postPref={getPref(post.id)}
            tags={tags.filter((tag) => tag.post_id == post.id)}
            answerOnly={true}
          />
          {console.log(getPref(post.id))}
          {replies.map(
            (reply) =>
              reply.post_id == post.id && (
                <Reply
                  socket={socket}
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
