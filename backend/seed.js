// require("dotenv").config();
// const mongoose = require("mongoose");
// const User = require("./models/user");
// const Blog = require("./models/blog");
// const crypto = require('crypto');

// const MONGO_URI = process.env.MONGODB_URI;

// // Connect to MongoDB
// mongoose.connect(MONGO_URI).then(() => {
//   console.log("MongoDB connected for seeding");
//   seedDatabase();
// }).catch(err => {
//   console.log("Connection error:", err);
//   process.exit(1);
// });

// async function seedDatabase() {
//   try {
//     // Clear existing data
//     await User.deleteMany({});
//     await Blog.deleteMany({});
//     console.log("Cleared existing data");

//     // Create test users
//     const users = [];
    
//     for (let i = 1; i <= 3; i++) {
//       const user = new User({
//         fullName: `Test User ${i}`,
//         email: `user${i}@test.com`,
//         password: crypto.createHash("sha256").update("password123").digest("hex"),
//       });
//       await user.save();
//       users.push(user);
//       console.log(`Created user: ${user.email}`);
//     }

//     // Create test blogs
//     for (let i = 1; i <= 5; i++) {
//       const blog = new Blog({
//         title: `Blog Post ${i}`,
//         content: `This is the content for blog post ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
//         discription: `Description for blog ${i}`,
//         imageUrl: `/upload/test-image-${i}.jpg`,
//         createdBy: users[i % users.length]._id,
//         likes: [],
//         comments: [],
//       });
//       await blog.save();
//       console.log(`Created blog: ${blog.title}`);
//     }

//     console.log("\nSeeding complete!");
//     console.log("\nTest credentials:");
//     console.log("Email: user1@test.com");
//     console.log("Password: password123");
    
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("Seeding error:", error);
//     mongoose.disconnect();
//     process.exit(1);
//   }
// }
