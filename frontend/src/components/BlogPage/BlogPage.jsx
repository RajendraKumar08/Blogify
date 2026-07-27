import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import BlogContext from "../../context/BlogContext";
import userContext from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const BlogPage = () => {

  const { id } = useParams();
  const { fetch_blog, blog, create_comment, fetch_comments, comments, likeBlog, deleteBlog } = useContext(BlogContext);
  const { user, managelike, fetchUser } = useContext(userContext);
  const [timespent, setTimespent] = useState(0);
  const timespentRef = useRef(0);

  const isBlogLikedByUser = Boolean(
    blog && user && blog.likes && blog.likes.some((id) => id.toString() === user._id.toString())
  );

  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    let interval;
    let lastactive = Date.now();

    const handleActivity = () => {
      lastactive = Date.now();
    };

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("scroll", handleActivity);
    document.addEventListener("click", handleActivity);

    interval = setInterval(() => {
      const inactiveDuration = Date.now() - lastactive;
      // Increment time spent only if user has been active within the last 5 seconds
      if (inactiveDuration <= 10000) {
        setTimespent((prev) => {
          const newTime = prev + 1;
          timespentRef.current = newTime;
          return newTime;
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("scroll", handleActivity);
      document.removeEventListener("click", handleActivity);

      if (timespentRef.current > 0) {
        fetch(`${API}/blog/api/${encodeURIComponent(id)}/read-time`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ time: timespentRef.current }),
          keepalive: true,
        }).catch(err => console.error("Failed to update read time", err));
      }
    };
  }, [id]);



  useEffect(() => {
    if (id) {
      console.log("Fetching blog with id:", id);
      fetch_blog(id);
      fetch_comments();
    }

  }, [id, fetch_blog, comments.length]);


  const onSubmit = async (data) => {
    console.log("Comment data", data)
    data.blogId = blog._id;
    console.log("Comment data after appending blogId", data)
    await create_comment(data);
    reset();
  }


  const handlelike = async () => {
    if (!user) {
      alert("Please login to like the blog");
      return;
    }
    
    // We don't await here because we want optimistic updates to trigger immediately in both contexts
    likeBlog(blog._id, user._id);
    managelike(blog);
    
    // No need to fetch_blog(id) here anymore because the context 
    // updates the 'blog' state automatically (optimistically and then with sync)
  }

  const handleDelete = async () => {
    try {
      await deleteBlog(blog._id);
      navigate('/');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Unable to delete blog. Please try again.');
    }
  }

  const handleEdit = () => {
    navigate(`/edit/${blog._id}`);
  }

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      fetch(`${API}/blog/api/${encodeURIComponent(id)}/view`, {
        method: "POST",
        credentials: "include",
      });
      // console.log("View count updated", result);
    }, 4000)
    console.log("Result in view api in frontend")

    return () => clearTimeout(timer);
  }, [id]);


  let parsedContent = null;

  try {
    parsedContent = typeof blog.content === "string"
      ? JSON.parse(blog.content)
      : blog.content;
  } catch (error) {
    console.error("Content parse error", error);
  }

  return (
    <>
      {blog ? (
        <div className="min-h-screen bg-gray-50">
          {/* Blog Header Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Blog Image */}
            {blog.imageUrl && (
              <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden shadow-md">
                <img
                  className="w-full h-auto object-cover max-h-96 sm:max-h-full"
                  src={`${blog.imageUrl}`}
                  alt={blog.title}
                />
              </div>
            )}

            {/* Blog Title */}
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center mb-6 text-gray-900">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-gray-700">
                <p className="text-sm text-gray-600">Created By</p>

                <Link to={user && String(user._id) === String(blog.createdBy._id) ? '/ProfilePage' : `/user/${blog.createdBy._id}`} className="font-semibold text-gray-900">{blog.createdBy.name}</Link>
              </div>

              {/* Like Button */}
              <button
                onClick={handlelike}
                className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isBlogLikedByUser
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                <span>❤️</span>
                <span>{blog.likes.length}</span>
              </button>
              <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                {blog.views} views
              </p>
            </div>

            {/* Edit/Delete Buttons - Only show for owner */}
            {blog.createdBy._id === user?._id && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md"
                >
                  ✏️ Edit Blog
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-md"
                >
                  🗑️ Delete Blog
                </button>
              </div>
            )}

            {/* Blog Content */}
            <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-12 prose prose-sm sm:prose lg:prose-lg max-w-none">
              {parsedContent?.blocks?.map((block, index) => {
                if (block.type === "header") {
                  return (
                    <h2 key={index} className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-gray-900">
                      {block.data.text}
                    </h2>
                  );
                }

                if (block.type === "paragraph") {
                  return (
                    <p key={index} className="mt-4 leading-relaxed text-gray-700 text-base sm:text-lg">
                      {block.data.text}
                    </p>
                  );
                }

                if (block.type === "image") {
                  return (
                    <img
                      key={index}
                      src={block.data.file?.url || block.data.url}
                      alt=""
                      className="my-6 rounded-lg shadow-md w-full h-auto object-cover"
                    />
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul key={index} className="list-disc ml-6 space-y-2 text-gray-700">
                      {block.data.items.map((item, i) => {
                        const itemText =
                          typeof item === "string"
                            ? item
                            : item?.content ?? JSON.stringify(item);

                        return <li key={i} className="text-base sm:text-lg">{itemText}</li>;
                      })}
                    </ul>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic my-6 bg-blue-50 py-4 pr-4 rounded text-gray-700">
                      {block.data.text}
                    </blockquote>
                  );
                }

                if (block.type === "code") {
                  return (
                    <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm">
                      <code>{block.data.code}</code>
                    </pre>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white border-t border-gray-200 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-bold text-2xl sm:text-3xl mb-8 text-gray-900">💬 Comments</h2>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="content"
                    name="content"
                    placeholder="Add a thoughtful comment..."
                    className='flex-1 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    {...register("content", { required: true })}
                  />
                  <button
                    className='bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md whitespace-nowrap'
                    type="submit"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.filter(comment => comment.blog == blog._id).length > 0 ? (
                  comments.filter(comment => comment.blog == blog._id).map(filteredComment => (
                    <div key={filteredComment._id} className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          className="rounded-full object-cover h-10 w-10 sm:h-12 sm:w-12 shrink-0"
                          src={`${filteredComment.createdBy.profileImg}`}
                          alt={filteredComment.createdBy.name}
                        />
                        <div className="flex-1 min-w-0">
                          <Link className="font-semibold text-gray-900 text-sm sm:text-base" to={user && String(user._id) === String(filteredComment.createdBy._id) ? '/ProfilePage' : `/user/${filteredComment.createdBy._id}`}>
                            {filteredComment.createdBy.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {new Date(filteredComment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {filteredComment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-base">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      ) : (
        <p className="text-center py-12 text-gray-500">Loading...</p>
      )}
    </>
  )
}


export default BlogPage;
