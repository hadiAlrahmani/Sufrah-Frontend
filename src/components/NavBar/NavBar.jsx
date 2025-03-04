import { Link } from 'react-router-dom';
import { AuthedUserContext } from '../../App';
import { useContext } from 'react';

const NavBar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext);

  return (
    <nav>
      <ul>
        {user ? (
          <>
            <li>Welcome, {user.username}</li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>

            {/* Show Admin Dashboard if user is an admin */}
            {user?.role === "admin" && (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}

            <li>
              <Link to="" onClick={handleSignout}>
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;