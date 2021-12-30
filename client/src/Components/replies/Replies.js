import Reply from "./Reply";

const Replies = ({ replies, onDelete }) => {
  return (
    <div>
      {replies.map((reply) => {
        return <Reply key={reply.id} reply={reply} onDelete={onDelete} />;
      })}
    </div>
  );
};

export default Replies;
