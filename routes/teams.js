const express = require("express");
const router = express.Router();

const teamController = require("../Controller/teamsCrud");
const upload = require("../Middlewares/multer");

router.post("/addteam", upload.single("image"), async (req, res) => {
  let io = req.io;

  try {
    // Call the teamController to add the team
    const response = await teamController.addTeam(req.body, req.file, io);

    // Send a success response back to the client
    res
      .status(200)
      .json({ message: "team added successfully", team: response });
  } catch (error) {
    // Handle any errors that occur during team addition
    console.error("Error adding team:", error);
    res
      .status(500)
      .json({ message: "Failed to add team", error: error.message });
  }
});

router.put("/updateteamBy/:id", upload.single("image"), async (req, res) => {
  let id = req.params.id;
  let teamData = req.body;
  let teamImage = req.file;
  let io = req.io;

  try {
    const response = await teamController.updateTeamById(
      id,
      teamData,
      teamImage,
      io
    );

    console.log("team updated successfully:", response);


    // Send a success response back to the client
    res
      .status(200)
      .json({ message: "team updated successfully", team: response });
  } catch (error) {
    console.error("Error updating team:", error);
    res
      .status(500)
      .json({ message: "Failed to update team", error: error.message });
  }
});

router.delete("/deleteteamBy/:id", async (req, res) => {
  const id = req.params.id;
  let io = req.io;

  try {
    // Call the deleteteam function from the controller to delete the team
    const deletedteam = await teamController.deleteTeamById(id, io);

    // If the team was successfully deleted, send a success response
    res.status(200).json({ message: "Franchise deleted successfully" });
  } catch (error) {
    // If an error occurs during deletion, send an error response
    console.error("Error deleting team:", error);
    res
      .status(500)
      .json({ message: "Failed to delete team", error: error.message });
  }
});


router.get("/getAllteams", async (req, res) => {
  
  try {
    const response = await teamController.getAllTeams()
    console.log("all teams", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch teams", error: error.message });
  }
});

module.exports = router;
