const Program = require("../Model/program");
const path = require("path");
const fs = require("fs");

module.exports = {
  addProgram: async (req, res) => {
    const { value, label } = req.body;

    console.log("value", value);
    console.log("label", label);

    const newProgram = new Program({ value, label, types: [] });

    try {
      await newProgram.save();
      res.status(201).json(newProgram);
    } catch (error) {
      console.error("Error saving program:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addType: async (req, res) => {
    const { programValue, value, label } = req.body;

    console.log("rebodoy", req.body);

    try {
      const program = await Program.findOne({ value: programValue });

      if (!program) {
        return res.status(404).json({ error: "program not found" });
      }

      // Check if the type already exists
      const typeExists = program.types.some((type) => type.value === value);
      if (typeExists) {
        return res.status(400).json({ error: "Type already exists" });
      }

      // Add the new type to the program's types array
      program.types.push({ value: value, label: label });
      await program.save();

      res.status(200).json(program);
    } catch (error) {
      console.error("Error adding type:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllPrograms: async (req, res) => {
    console.log("calling");
    try {
      const programs = await Program.find();

      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteProgramById: async (req, res) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "program not found" });
      }

      const imageUrl = program.image;

      // Delete the image file from the folder
      if (imageUrl) {
        const imagePath = path.join(
          __dirname,
          "../public/programImg",
          imageUrl
        );

        fs.unlinkSync(imagePath);
      }

      await program.deleteOne();

      res.status(200).json({ message: "program deleted successfully" });
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: error.message });
    }
  },

  updateProgramById: async (req, res) => {
    const { value, label } = req.body;

    try {
      const foundProgram = await Program.findOne({ value: value });

      if (foundProgram) {
        foundProgram.value = value;
        foundProgram.label = label;

        await foundProgram.save();
        res.json(foundProgram);
      } else {
        res.status(404).json({ error: "Program Not Found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
