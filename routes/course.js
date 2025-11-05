const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middelware/checkauth");

router.get("/courses", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json({ message: "Courses fetched", courses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post(
  "/courses/create",
  authenticateToken,
  authorizeRoles("Instructor"),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const newCourse = await Course.create({
        name,
        description,
        category,
        price,
        instructor: req.user.id,
      });
      res
        .status(201)
        .json({ message: "Course created successfully", course: newCourse });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

router.post(
  "/courses/:id/enroll",
  authenticateToken,
  authorizeRoles("Student"),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });

      const user = await User.findById(req.user.id);

      if (user.courseEnrolled.includes(course._id))
        return res.status(400).json({ message: "Already enrolled" });

      user.courseEnrolled.push(course._id);
      course.students.push(user._id);

      await user.save();
      await course.save();

      res.status(200).json({ message: "Enrollment successful" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
