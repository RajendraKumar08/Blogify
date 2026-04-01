import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Header = () => {

  const navigate = useNavigate();
  const { user, logout, fetchUser } = useContext(UserContext);

  const [menuopen, setmenuopen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const handle_login = () => {
    navigate("/Login");
  };

  const handle_create_account = () => {
    navigate("/CreateAccount");
  };

  const handle_logout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white sticky top-0 w-full z-50">

      <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <Link to="/" className="text-2xl font-bold hover:text-blue-200">
          Blogify
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setmenuopen(!menuopen)}
        >
          ☰
        </button>

        {/* Menu */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:gap-4 absolute md:static bg-blue-600 w-full md:w-auto left-0 md:flex ${
            menuopen ? "top-16" : "hidden md:flex"
          }`}
        >

          {user ? (
            <>

              <Link
                className="bg-blue-500 px-4 py-2 rounded m-2 text-center"
                to="/createblog"
              >
                Create Blog
              </Link>

              <Link
                className="px-4 py-2 m-2 text-center"
                to="/profilepage"
              >
                {user.name}
              </Link>

              <button
                onClick={handle_logout}
                className="bg-white text-blue-600 px-4 py-2 rounded m-2 hover:bg-gray-200"
              >
                Logout
              </button>

            </>
          ) : (
            <>
              <button
                onClick={handle_login}
                className="bg-white text-blue-600 px-4 py-2 rounded m-2"
              >
                Login
              </button>

              <button
                onClick={handle_create_account}
                className="bg-white text-blue-600 px-4 py-2 rounded m-2"
              >
                Sign Up
              </button>
            </>
          )}

        </div>

      </nav>
    </header>
  );
};

export default Header;