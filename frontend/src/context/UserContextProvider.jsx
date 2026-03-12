import UserContext from "./UserContext";
import { useState } from "react";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // make a fetch user function that will fetch the user from the backend when we refresh the page
  // and it will solve the problem of losing the user state on refresh
  const fetchUser = async () => {
    try {
      const result = await fetch("/user/api/me", {
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
    }
  };

  const CreateAccount = async (form_data) => {
    try {
      const fd = new FormData();
      fd.append("name", form_data.name);
      fd.append("email", form_data.email);
      fd.append("password", form_data.password);
      fd.append("profileImg", form_data.profileImg[0]);
      console.log("This is form data", fd);
      console.log("profile iamge" , form_data.profileImg[0]);
      const result = await fetch("/user/api/signup", {
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
    }
  };

  const Login = async (form_data) => {
    try {
      const result = await fetch("/user/api/login", {
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
    }
  }

  const logout = async () => {
    try {
      const result = await fetch("/user/api/logout", {
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

  const managelike = async () => {
    try{
      const result = await fetch("/user/api/managelike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({blogId : blog._id}),
      });
      if(!result.ok){
        const text = await result.text();
        throw new Error(`Manage like request failed (${result.status}): ${text}`);
      }
      const data = await result.json();
      console.log("Manage like response", data);

    }
    catch(error){
      console.log("Mange like err" , error)
    }
  }

 

  return (
    <UserContext.Provider value={{ user, setUser, CreateAccount, Login, logout, fetchUser, managelike }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
