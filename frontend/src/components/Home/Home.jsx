import React, { useContext, useState } from "react";
import BlogContext from "../../context/BlogContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import ChatBot from "../ChatBot/ChatBot";
import Loading from "../Loading/Loading";

import { useEffect } from "react";

function Home() {
  const { blogs, fetch_blogs, searchBlogs, loading } = useContext(BlogContext);
  const [sortBy, setSortBy] = useState('newest');

  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  


  useEffect(() => {
    fetch_blogs();
    console.log("Blogs fetched", blogs);
  }, []);

  const onSubmit = async (data) => {
    console.log("Search data in frontend", data);
    // Implement search functionality here
    await searchBlogs(data.q);
  }
  const handle_mouse_move = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const center_x = rect.width / 2;
    const center_y = rect.height / 2;

    const rotate_x = ((y - center_y) / center_y) * 10;
    const rotate_y = ((x - center_x) / center_x) * -10;

    card.style.transform = `perspective(1000px) rotateX(${rotate_x}deg) rotateY(${rotate_y}deg) scale(1)`;
  };

  const handle_mouse_leave = (e) => {
    e.currentTarget.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">

        {/* Top bar */}
        <div className="flex flex-col md:flex-row p-4 w-full justify-between items-center mb-4 gap-4 bg-white rounded-lg shadow">

          <div className="w-full md:w-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                className="border-2 border-gray-300 p-2 w-full sm:w-64 rounded focus:border-blue-500 outline-none"
                type="text"
                name="q"
                {...register("q")}
                placeholder="Search blogs..."
              />

              <button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-all px-4 py-2 rounded font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          <div className="text-sm md:text-base flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold text-gray-700">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded focus:border-blue-500 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostLiked">Most Liked</option>
              <option value="leastLiked">Least Liked</option>
              <option value="Trending">Trending</option>
            </select>
          </div>

        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loading />
              <p className="text-gray-600 mt-4 font-semibold">Loading blogs...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {blogs && blogs.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <p className="text-gray-600 text-lg font-semibold mb-4">No blogs found</p>
                  <p className="text-gray-500">Start creating your first blog today!</p>
                  <p className="text-gray-500">Or refresh the page</p>
                </div>
              </div>
            ) : (
              /* Blog grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-3">

                {blogs && (() => {
                  const sortedBlogs = [...blogs.filter(blog => blog)].sort((a, b) => {
                    switch (sortBy) {
                      case 'newest':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      case 'oldest':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      case 'mostLiked':
                        return b.likes.length - a.likes.length;
                      case 'leastLiked':
                        return a.likes.length - b.likes.length;
                      case 'Trending':
                        return b.views - a.views;
                      default:
                        return 0;
                    }
                  });
                  return sortedBlogs.map((blog) => (

                    <div
                      onMouseMove={handle_mouse_move}
                      onMouseLeave={handle_mouse_leave}
                      key={blog._id}
                      className="hover:scale-105 transition-all duration-100 border border-gray-200 p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg w-full max-w-sm"
                    >

                      <img
                        className="w-fit h-fit sm:h-56 object-cover rounded"
                        src={`http://localhost:3000${blog.imageUrl}`}
                        alt={blog.title}
                      />

                      <h2 className="text-lg md:text-xl font-bold mt-3 mb-2">
                        {blog.title.substring(0, 40)}...
                      </h2>

                      <p className="text-sm text-gray-600 mb-3">
                        {blog.discription ? blog.discription : "No description available"}
                      </p>

                      <div className="flex items-center gap-2">
                        <h5 className="text-sm text-gray-700">Liked By : {blog.likes?.length || 0} people | </h5>
                        <h5 className="text-sm text-gray-700">Comments : {blog.comments?.length || 0} | </h5>
                        <h5 className="text-sm text-gray-700">Views : {blog.views || 0}</h5>
                      </div>

                      <Link
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-800 transition-all font-semibold mt-3"
                        to={`/Blog/${blog._id}`}
                      >
                        Read More
                      </Link>

                    </div>

                  ))
                })()}

              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}

export default Home;
