import TopUser from "./TopUser";

const TopUsers = ({ topUsers }) => {
  return (
    <div>
      {topUsers.map((topUser) => (
        <TopUser key={topUser.id} topUser={topUser} />
      ))}
    </div>
  );
};

export default TopUsers;
