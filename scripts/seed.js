import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/Role.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Series from "../models/Series.js";
import Post from "../models/Post.js";

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Role.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Series.deleteMany({});
    await Post.deleteMany({});
    console.log("Cleared existing data");

    // Seed Roles
    const role1 = new Role({
      name: "Admin",
      description: "Administrator with full access",
    });
    await role1.save();
    const role2 = new Role({
      name: "Editor",
      description: "Can create and edit posts",
    });
    await role2.save();
    const role3 = new Role({
      name: "Author",
      description: "Can create own posts",
    });
    await role3.save();
    const role4 = new Role({ name: "Viewer", description: "Read-only access" });
    await role4.save();
    console.log("✓ Seeded roles");

    // Seed Users
    const user1 = new User({
      username: "admin",
      email: "admin@blogsphere.com",
      password: "admin123",
      role: role1._id,
    });
    await user1.save();

    const user2 = new User({
      username: "editor1",
      email: "editor@blogsphere.com",
      password: "editor123",
      role: role2._id,
    });
    await user2.save();

    const user3 = new User({
      username: "author1",
      email: "author@blogsphere.com",
      password: "author123",
      role: role3._id,
    });
    await user3.save();
    console.log("✓ Seeded users");

    // Seed Categories
    const cat1 = new Category({
      name: "Technology",
      description: "Posts about technology and programming",
    });
    await cat1.save();

    const cat2 = new Category({
      name: "Lifestyle",
      description: "Posts about lifestyle and personal development",
    });
    await cat2.save();

    const cat3 = new Category({
      name: "Business",
      description: "Posts about business and entrepreneurship",
    });
    await cat3.save();

    const cat4 = new Category({
      name: "Travel",
      description: "Posts about travel and adventures",
    });
    await cat4.save();

    const cat5 = new Category({
      name: "Food",
      description: "Posts about cooking and food",
    });
    await cat5.save();

    const cat6 = new Category({
      name: "Health",
      description: "Posts about health and fitness",
    });
    await cat6.save();
    console.log("✓ Seeded categories");

    // Seed Series
    const series1 = new Series({
      name: "Getting Started with Web Development",
      description:
        "A comprehensive series for beginners learning web development",
    });
    await series1.save();

    const series2 = new Series({
      name: "Advanced JavaScript Techniques",
      description: "Deep dive into advanced JavaScript concepts",
    });
    await series2.save();

    const series3 = new Series({
      name: "Travel Diaries 2025",
      description: "My journey through different countries",
    });
    await series3.save();

    const series4 = new Series({
      name: "Healthy Living Guide",
      description: "Tips and tricks for a healthier lifestyle",
    });
    await series4.save();
    console.log("✓ Seeded series");

    // Seed Posts
    const post1 = new Post({
      title: "Welcome to BlogSphere",
      content:
        "This is your first post! BlogSphere is a powerful blog management system that helps you organize and publish your content.",
      category: cat1._id,
      author: user1._id,
      status: "Published",
    });
    await post1.save();

    const post2 = new Post({
      title: "Introduction to Web Development",
      content:
        "Web development is an exciting field that combines creativity with technical skills. In this series, we will explore the fundamentals.",
      category: cat1._id,
      series: series1._id,
      author: user2._id,
      status: "Published",
    });
    await post2.save();

    const post3 = new Post({
      title: "My Journey to Japan",
      content:
        "Japan has always been on my bucket list. This post marks the beginning of my travel diary series.",
      category: cat4._id,
      series: series3._id,
      author: user3._id,
      status: "Published",
    });
    await post3.save();
    console.log("✓ Seeded posts");

    console.log("\nDatabase seeded successfully!");
    console.log(
      `Total: ${await Role.countDocuments()} roles, ${await User.countDocuments()} users, ${await Category.countDocuments()} categories, ${await Series.countDocuments()} series, ${await Post.countDocuments()} posts`
    );
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
