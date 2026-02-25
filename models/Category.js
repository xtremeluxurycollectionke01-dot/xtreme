// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    subcategories: [{ type: String }], // Array of subcategory names
  },
  { timestamps: true }
);

// Create slug from name
CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

module.exports = Category;