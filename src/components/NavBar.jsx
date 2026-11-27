
function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">F</span>
        <h2>Forum.</h2>
      </div>

      <div className="nav-user">
        <div className="avatar">
          {user.username?.charAt(0).toUpperCase() || "U"}
        </div>

        <span>{user.username}</span>

        <button onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
