import React, { useContext, useEffect } from 'react';
import BlogContext from '../../context/BlogContext';
import UserContext from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { getImageUrl } from '../../utils/image';

const ProfilePage = () => {

    const { user, loading } = useContext(UserContext);
    const { blogs, fetch_blogs } = useContext(BlogContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch_blogs();
        console.log("Blogs fetched in profile page", blogs);
    }, []);

    useEffect(() => {
        // Only redirect once loading is finished and user is still null
        if (!loading && !user) {
            navigate('/Login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loading />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    const userBlogs = blogs.filter(blog => blog.createdBy && blog.createdBy._id && blog.createdBy._id.toString() === user._id);
    const likedBlogs = blogs.filter(blog => {
        if (!user.likedBlogs || !Array.isArray(user.likedBlogs)) return false;
        return user.likedBlogs.some(id => id && typeof id === 'string' && id === blog._id);
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header */}
            <div className="bg-white shadow-md px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className='text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900'>Profile</h1>
                    
                    <div className='flex flex-col sm:flex-row items-center gap-6 sm:gap-8'>
                        <img
                            src={getImageUrl(user.profileImg)}
                            alt={user.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        />

                        <div className='flex-1 text-center sm:text-left'>
                            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>{user.name}</h2>
                            
                            <div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
                                <div className='bg-blue-50 rounded-lg p-4'>
                                    <p className='text-2xl sm:text-3xl font-bold text-blue-600'>{userBlogs.length}</p>
                                    <p className='text-gray-600 text-sm sm:text-base'>Blogs Created</p>
                                </div>
                                <div className='bg-red-50 rounded-lg p-4'>
                                    <p className='text-2xl sm:text-3xl font-bold text-red-600'>{user.likedBlogs ? user.likedBlogs.length : 0}</p>
                                    <p className='text-gray-600 text-sm sm:text-base'>Blogs Liked</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blogs Created Section */}
            <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2'>
                        <span>📝</span> Blogs Created by You
                    </h2>
                    
                    {userBlogs.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {userBlogs.map(filteredBlog => (
                                <div key={filteredBlog._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                                    <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
                                        <img 
                                            className="w-fit h-fit object-cover hover:scale-105 transition-transform duration-300" 
                                            src={getImageUrl(filteredBlog.imageUrl)} 
                                            alt={filteredBlog.title}
                                        />
                                    </div>
                                    
                                    <div className='flex flex-col flex-1 p-4 sm:p-5'>
                                        <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2'>
                                            {filteredBlog.title}
                                        </h3>
                                        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                                            {filteredBlog.discription ? filteredBlog.discription : "No description available"}
                                        </p>
                                        
                                        <div className='flex gap-2 mt-auto'>
                                            <Link 
                                                className="flex-1 bg-blue-500 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200" 
                                                to={`/blog/${filteredBlog._id}`}
                                            >
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-16 bg-white rounded-lg'>
                            <p className='text-gray-500 text-lg'>No blogs created yet. Start writing your first blog!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Liked Blogs Section */}
            <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2'>
                        <span>❤️</span> Blogs You Liked
                    </h2>
                    
                    {likedBlogs.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {likedBlogs.map(filteredBlog => (
                                <div key={filteredBlog._id} className="bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                                    <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
                                        <img 
                                            className="w-fit h-fit object-cover hover:scale-105 transition-transform duration-300" 
                                            src={getImageUrl(filteredBlog.imageUrl)} 
                                            alt={filteredBlog.title}
                                        />
                                    </div>
                                    
                                    <div className='flex flex-col flex-1 p-4 sm:p-5'>
                                        <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2'>
                                            {filteredBlog.title}
                                        </h3>
                                        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                                            {filteredBlog.discription ? filteredBlog.discription : "No description available"}
                                        </p>
                                        
                                        <div className='flex gap-2 mt-auto'>
                                            <Link 
                                                className="flex-1 bg-blue-500 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200" 
                                                to={`/blog/${filteredBlog._id}`}
                                            >
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-16 bg-gray-50 rounded-lg'>
                            <p className='text-gray-500 text-lg'>You haven't liked any blogs yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;