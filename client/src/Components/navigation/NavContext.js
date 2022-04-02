const NavContext = ({ onLogout }) => {
  return (
    <ul
      className="dropdown-menu dropdown-menu-end dropdown-context"
      aria-labelledby="nav-context"
    >
      <li
        className="dropdown-item"
        onClick={() => (window.location.href = "/profile")}
      >
        <i className="bi bi-person-fill"></i>
        <span>Profile</span>
      </li>
      <li className="dropdown-item" onClick={onLogout}>
        <i className="bi bi-box-arrow-in-left"></i>
        <span>Logout</span>
      </li>
    </ul>
  );
};

export default NavContext;
