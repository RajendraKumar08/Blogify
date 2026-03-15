import BlogContext from "./BlogContext";
import { useState, useCallback } from "react";

const BlogContextProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [searchedBlogs, setSearchedBlogs] = useState(false);

  const fetch_blogs = useCallback(async () => {
    try {
      const result = await fetch("/blog/api/all", {
        method: "GET",
        credentials: "include",
      });
      const data = await result.json();
      // console.log("data fetched in contextPrivider", data);
      // console.log("All Blogs", data.blogs);
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetch_blog = useCallback(async (id) => {
    try {
      const result = await fetch(`/blog/api/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await result.json();
      console.log("Data fetched for blog:", data);
      if(data.success){
        console.log("Fetched blog data", data.blog);
        console.log("Created By:", data.blog.createdBy);
        setBlog(data.blog);
      }
      else{
        setBlog(null);
      }

    } catch (error) {
      console.log("Error from frontend",error)
    }
  }, []);

  const create_blog = async (form_data) => {
    try {
      const fd = new FormData();
      fd.append("title", form_data.title);
      fd.append("content", JSON.stringify(form_data.content));
      fd.append("discription", form_data.Discription);
      fd.append("image", form_data.image[0]);
      // console.log("This is form data", fd);
      const result = await fetch("/blog/api/create", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await result.json();
      console.log("This is the data", data);
      if(data.success) {
        console.log("This is new blog ",data.blog);
        blogs.push(data.blog);
        setBlogs([...blogs]);
      } else {
        console.error("Blog creation failed:", data.error);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  const create_comment = async(form_data) => {
    try {
        console.log("Creating comment with data in context", form_data);
        const result = await fetch("/comment/api/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
      });
      const data = await result.json();
      // console.log("Comment creation response", data);
      if(data.success) {
        setComments([...comments, data.comment]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetch_comments = async() => {
    try {
      const result = await fetch("/comment/api/all", {
        method: "GET",
        credentials: "include",
      });
      const data = await result.json();
      // console.log("Comments data fetched in contextPrivider", data);
      setComments(data.comments);
      
    } catch (error) {
      console.log("Error fetching comments", error);
    }
  }

  const searchBlogs = async(query) => {
    try{
      const result = await fetch(`/blog/api/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await result.json();
      // console.log("Search results", data);
      if(data.success){
        setBlogs(data.blogs);
      }
    } catch(error){
      console.log(error);

    }
  }

  const likeBlog = async (blogId) => {
    try {
      const result = await fetch(`/blog/api/${encodeURIComponent(blogId)}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!result.ok) {
        const text = await result.text();
        throw new Error(`Like request failed (${result.status}): ${text}`);
      }

      const data = await result.json();
      // console.log("Like response", data);

      if (data.success && data.blog) {
        setBlog(data.blog);
        setBlogs((prev) => prev.map((b) => (b._id === data.blog._id ? data.blog : b)));
      }
    } catch (error) {
      console.error("Error liking blog", error);
      alert("Unable to like blog. Please try again.");
    }
  };

  const deleteBlog = async (blogId) => {
    try{
      const result = await fetch(`/blog/api/${encodeURIComponent(blogId)}/delete`, {
        method: "POST", // backend expects POST for delete
        credentials: "include",
      });
      if(!result.ok){
        const text = await result.text();
        throw new Error(`Delete request failed (${result.status}): ${text}`);
      }
      const data = await result.json();
      console.log(data);

      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
        setBlog((prev) => (prev?._id === blogId ? null : prev));
      }

      return data;
    } catch(error){
      console.log("Error deleting blog", error);
      throw error;
    }
  }


    return (
    <BlogContext.Provider value={{ blogs, create_blog, fetch_blogs, fetch_blog, blog, create_comment, fetch_comments, comments, searchBlogs, likeBlog, deleteBlog}}>
      {children}
    </BlogContext.Provider>
  );

}




export default BlogContextProvider;