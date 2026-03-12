import React, { useEffect, useState, useContext, Profiler } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import UserProfile from "../profilePage/profilePage.jsx";


const Header = () => {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useContext(UserContext);

  useEffect(() => {
    fetchUser();
  }, []);

  const handle_login = () => {
    navigate("/login");
  };


  const handle_create_account = () => {
    navigate("/createaccount");
  };

  const handle_logout = () => {
    logout();
    navigate("/");
  }

  return (
    <header className="bg-blue-600 text-white p-4 sticky top-0 w-full z-50">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-all">Blogify</Link>

        <div>
          {user ? (
            <div>
              <Link className="bg-blue-500 text-white px-4 py-2 rounded ml-2 mx-2" to="/createblog">Create Blog</Link>
              <Link to="/profilepage">{user.name}</Link>
              <button
                onClick={handle_logout}
                className="bg-white text-blue-600 px-4 py-2 rounded ml-2 hover:bg-gray-200 transition-all hover:cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={handle_login}
                className="bg-white text-blue-600 px-4 py-2 rounded"
              >
                Login
              </button>
              <button
                onClick={handle_create_account}
                className="bg-white text-blue-600 px-4 py-2 rounded ml-2"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>

  );
};

export default Header;
