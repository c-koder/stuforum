import Reply from "./Reply";

const Replies = ({ replies, onDelete, addReply, answered }) => {
  return (
    <div>
      {replies.map((reply) => {
        return (
          <Reply
            key={reply.id}
            reply={reply}
            onDelete={onDelete}
            addReply={addReply}
            answered={answered}
          />
        );
      })}
    </div>
  );
};

export default Replies;
