const express = require("express");
const Students = require("../models/students");
const { verifyToken, checkRole } = require("../authMiddleware"); // Import middleware
const router = express.Router();

router.post("/addStudent", verifyToken, checkRole(["operator"]), async (req, res) => {
  const { name, phone } = req.body;

  const student = new Students({
    name,
    phone,
  });

  await student.save();

  return res.status(201).json({
    message: "Student Added Successfully",
    student: { name, phone },
  });
});

router.patch("/editAllocatedMan/:id", verifyToken, checkRole(["receptionist"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { allocatedMan } = req.body;

    const updatedStudent = await Students.findByIdAndUpdate(id, { allocatedMan });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "Allocated Man Updated Successfully", updatedStudent });
  } catch (error) {
    return res.status(500).json({ message: "Error updating Allocated Man", error: error.message });
  }
});

router.get("/fetchAllStudents", verifyToken,checkRole(["receptionist", "operator"]), async (req, res) => {
  try {
    const students = await Students.find();

    return res.status(200).json({ message: "Students fetched successfully", students });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching students", error: error.message });
  }
});

module.exports = router;
