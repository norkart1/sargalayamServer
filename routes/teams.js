const express = require("express");
const router = express.Router();

const teamController = require("../Controller/teamsCrud");
const upload = require("../Middlewares/multer");

router.post("/addBroker", upload.single("image"), async (req, res) => {
  let io = req.io;

  try {
    // Call the teamController to add the broker
    const response = await teamController.addBroker(req.body, req.file, io);

    // Send a success response back to the client
    res
      .status(200)
      .json({ message: "Broker added successfully", broker: response });
  } catch (error) {
    // Handle any errors that occur during broker addition
    console.error("Error adding broker:", error);
    res
      .status(500)
      .json({ message: "Failed to add broker", error: error.message });
  }
});

router.put("/updateBrokerBy/:id", upload.single("image"), async (req, res) => {
  let id = req.params.id;
  let brokerData = req.body;
  let brokerImage = req.file;
  let io = req.io;

  try {
    const response = await teamController.updateBrokerById(
      id,
      brokerData,
      brokerImage,
      io
    );

    console.log("Broker updated successfully:", response);


    // Send a success response back to the client
    res
      .status(200)
      .json({ message: "Broker updated successfully", broker: response });
  } catch (error) {
    console.error("Error updating broker:", error);
    res
      .status(500)
      .json({ message: "Failed to update broker", error: error.message });
  }
});

router.delete("/deleteBrokerBy/:id", async (req, res) => {
  const id = req.params.id;
  let io = req.io;

  try {
    // Call the deleteBroker function from the controller to delete the broker
    const deletedBroker = await teamController.deleteBrokerById(id, io);

    // If the broker was successfully deleted, send a success response
    res.status(200).json({ message: "Franchise deleted successfully" });
  } catch (error) {
    // If an error occurs during deletion, send an error response
    console.error("Error deleting broker:", error);
    res
      .status(500)
      .json({ message: "Failed to delete broker", error: error.message });
  }
});


router.get("/getAllBrokers", async (req, res) => {
  try {
    const response = await teamController.getAllBrokers();
    console.log("all brokers", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching brokers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch brokers", error: error.message });
  }
});

module.exports = router;
