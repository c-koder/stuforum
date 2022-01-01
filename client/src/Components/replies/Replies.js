import Reply from "./Reply";

const Replies = ({ replies, onDelete, addReply }) => {
  return (
    <div>
      {replies.map((reply) => {
        return (
          <Reply
            key={reply.id}
            reply={reply}
            onDelete={onDelete}
            addReply={addReply}
          />
        );
      })}
    </div>
  );
};

export default Replies;
