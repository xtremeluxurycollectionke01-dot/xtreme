// Run with: node scripts/seed-categories.js
/*require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  {
    name: "Sneakers",
    description: "Athletic and casual sneakers for everyday wear",
    isActive: true,
    order: 1,
    subcategories: ["Running", "Basketball", "Lifestyle", "Skateboarding", "Training"]
  },
  {
    name: "Formal Shoes",
    description: "Elegant shoes for formal occasions",
    isActive: true,
    order: 2,
    subcategories: ["Oxfords", "Loafers", "Derby", "Monk Strap", "Dress Boots"]
  },
  {
    name: "Boots",
    description: "Durable boots for work and outdoor activities",
    isActive: true,
    order: 3,
    subcategories: ["Work Boots", "Hiking Boots", "Chelsea Boots", "Combat Boots"]
  },
  {
    name: "Sandals & Slides",
    description: "Comfortable sandals for warm weather",
    isActive: true,
    order: 4,
    subcategories: ["Athletic Slides", "Flip Flops", "Sandals"]
  },
  {
    name: "Accessories",
    description: "Shoe care products and accessories",
    isActive: true,
    order: 5,
    subcategories: ["Insoles", "Laces", "Cleaning Kits", "Shoe Care"]
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created:', createdCategories.map(c => ({ id: c._id, name: c.name })));

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();*/

// scripts/seed-categories.js
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Category = require('../models/Category'); // JS version

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categories = [
  {
    name: "Sneakers",
    description: "Athletic and casual sneakers for everyday wear",
    isActive: true,
    order: 1,
    slug: slugify("Sneakers"),
    subcategories: ["Running", "Basketball", "Lifestyle", "Skateboarding", "Training"]
  },
  {
    name: "Formal Shoes",
    description: "Elegant shoes for formal occasions",
    isActive: true,
    order: 2,
    slug: slugify("Formal Shoes"),
    subcategories: ["Oxfords", "Loafers", "Derby", "Monk Strap", "Dress Boots"]
  },
  {
    name: "Boots",
    description: "Durable boots for work and outdoor activities",
    isActive: true,
    order: 3,
    slug: slugify("Boots"),
    subcategories: ["Work Boots", "Hiking Boots", "Chelsea Boots", "Combat Boots"]
  },
  {
    name: "Sandals & Slides",
    description: "Comfortable sandals for warm weather",
    isActive: true,
    order: 4,
    slug: slugify("Sandals & Slides"),
    subcategories: ["Athletic Slides", "Flip Flops", "Sandals"]
  },
  {
    name: "Accessories",
    description: "Shoe care products and accessories",
    isActive: true,
    order: 5,
    slug: slugify("Accessories"),
    subcategories: ["Insoles", "Laces", "Cleaning Kits", "Shoe Care"]
  }
];

async function seedCategories() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not defined");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Category.deleteMany({});
    console.log("🗑 Cleared existing categories");

    const createdCategories = await Category.insertMany(categories);
    console.log("✅ Categories created:", createdCategories.map(c => ({ id: c._id, name: c.name })));

    console.log("🎉 Seeding completed successfully");
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();