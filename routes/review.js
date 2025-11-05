const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const { authenticateToken } = require("../middelware/checkauth");

router.post("/:courseId/reviews", authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newReview = { student: req.user.id, rating, comment };
    course.review.push(newReview);
    course.calculateAverageReview();
    await course.save();

    res.status(200).json({ message: "Review added successfully", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:courseId/reviews", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("reviews.student", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
