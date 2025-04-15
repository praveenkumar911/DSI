const express = require("express");
const { Fellow } = require("../models/model");
const router = express.Router();

router.put("/update", async (req, res) => {
    try {
      const { name, email, mobile } = req.body;
      const findProfile = await Fellow.findOne({ email : email});
      const id = String(findProfile._id)
      const updatedProfile = await Fellow.updateOne(
        { _id: id },
        { $set: { name : name || findProfile.name, email : email || findProfile.email , mobile : mobile || findProfile.mobile } }
      );
      if (!updatedProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }
  
      res.status(200).json(updatedProfile);
    } catch (err) {
      console.error("Error in /update route:", err);
      res.status(500).json({ error: err.message });
    }
  });


module.exports = router;
