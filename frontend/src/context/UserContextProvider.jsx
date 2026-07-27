import UserContext from "./UserContext";
import { useState } from "react";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [otheruser, setotheruser] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL || '';

  // make a fetch user function that will fetch the user from the backend when we refresh the page
  //  and it will solve the problem of losing the user state on refresh
  const fetchUser = async () => {
    try {
      setLoading(true);
      const result = await fetch(`${API}/user/api/me`, {
        method: "GET",
        credentials: "include",
      });

      const data = await result.json();
      console.log("To check profile data", data);
      console.log("This is user", data.user);
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const CreateAccount = async (form_data) => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", form_data.name);
      fd.append("email", form_data.email);
      fd.append("password", form_data.password);
      fd.append("profileImg", form_data.profileImg[0]);
      console.log("This is form data", fd);
      console.log("profile iamge" , form_data.profileImg[0]);
      const result = await fetch(`${API}/user/api/signup`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await result.json();
      console.log(data);

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const Login = async (form_data) => {
    try {
      setLoading(true);
      const result = await fetch(`${API}/user/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form_data),
      });

      if (result.status === 401) {
        setUser(null);
        return;
      }
      // console.log(result); 
      const data = await result.json();
      // console.log(data);

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }


    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      const result = await fetch(`${API}/user/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await result.json();
      if (data.success) {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const managelike = async (blog) => {
    if (!user || !blog) return;

    // 1. Save snapshot of current state
    const previousUser = user;

    // 2. Perform optimistic update
    const isLiked = user.likedBlogs.some((id) => id.toString() === blog._id.toString());
    const updatedLikedBlogs = isLiked
      ? user.likedBlogs.filter((id) => id.toString() !== blog._id.toString())
      : [...user.likedBlogs, blog._id];

    setUser({ ...user, likedBlogs: updatedLikedBlogs });

    try {
      const result = await fetch(`${API}/user/api/managelike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ blogId: blog._id }),
      });

      if (!result.ok) {
        throw new Error("Manage like request failed");
      }

      const data = await result.json();
      if (data.success) {
        // Sync with server data
        setUser(data.user); 
      }
    } catch (error) {
      console.log("Manage like err", error);
      // 3. Revert on error
      setUser(previousUser);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      setProfileLoading(true);
      const result = await fetch(`${API}/user/api/${encodeURIComponent(userId)}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await result.json();
      console.log("Fetch user by ID response", data);
      setotheruser(data.user);
      return data.user;
    } catch (error) {
      console.log("Error fetching user by ID", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, CreateAccount, Login, logout, fetchUser, managelike, fetchUserById, loading , otheruser, setotheruser, profileLoading}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
