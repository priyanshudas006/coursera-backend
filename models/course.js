const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: "General",
  },
  published: {
    type: Boolean,
    default: false,
  },
  review: [
    {
      student: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      Comment: {
        type: String,
        trim: true,
      },
    },
  ],
  averageRating: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.methods.calculateAverageReview = function () {
  if (!this.review || this.review.length === 0) {
    this.averageRating = 0;
  } else {
    const total = this.review.reduce((acc, r) => acc + (r.rating || 0), 0);
    this.averageRating = total / this.review.length;
  }
  return this.averageRating;
};

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
