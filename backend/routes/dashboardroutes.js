const express = require("express");
const Dashboard = require("../models/model").Dashboard;

const router = express.Router();

// 📝 Save a Note 
router.post("/save", async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const { day, month, year, note } = req.body;
  
      if (!day || !month || !year || !note) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const newNote = new Dashboard({ day, month, year, note });
      await newNote.save();
      console.log("Note saved successfully:", newNote);
      res.status(201).json({ message: "Note saved successfully", data: newNote });
    } catch (error) {
      console.error("Error saving note:", error);
      res.status(500).json({ message: "Error saving note", error });
    }
  });

// 📖 Get All Notes
router.get("/notes", async (req, res) => {
    try {
      console.log("Fetching notes from the database...");
      const notes = await Dashboard.find();
      console.log("Notes fetched:", notes);
      res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Error fetching notes", error });
    }
  });

// ✏️ Update a Note
router.put("/update/:id", async (req, res) => {
  try {
    const { note } = req.body;
    const updatedNote = await Dashboard.findByIdAndUpdate(
      req.params.id,
      { note },
      { new: true }
    );
    res.status(200).json({ message: "Note updated successfully", data: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
});

// ❌ Delete a Note
router.delete("/delete/:id", async (req, res) => {
  try {
    await Dashboard.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
});

module.exports = router;