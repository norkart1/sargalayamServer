const Teams = require("../Model/teams");
const path = require("path");
const fs= require('fs')

// Function to add a new broker
const addBroker = async (teamData, teamImg,io) => {
  console.log(teamData)
  try {
    // Create a new instance of the Teams model with the provided data
    const newBroker = new Teams({
      name: teamData.name,
      ranking: teamData.ranking,
      link: teamData.link,
      score:teamData.score,
      location: teamData.location,
      image: teamImg ? teamImg.filename : null,
    });

    // Save the new broker to the database
    const savedBroker = await newBroker.save();
    io.emit('team_add')


    return savedBroker;
  } catch (error) {
    throw error;
  }
};

const getAllTeams = async () => {
  try {
    // Fetch all Teams from the database
    const Teams = await Teams.find();
    return Teams;
  } catch (error) {
    throw error;
  }
};

const getTeamById = async (id) => {
  try {
    // Find broker by ID in the database
    const broker = await Teams.findById(id);
    if (!broker) {
      throw new Error("Broker not found");
    }
    return broker;
  } catch (error) {
    throw error;
  }
};

const updateTeamById = async (id, newData, newImage,io) => {
  try {
    // Find broker by ID and update its data in the database
    const currentData = await Teams.findById(id);

    if (!currentData) {
      throw new Error("Broker not found");
    }

    currentData.name = newData.name;
    currentData.ranking = newData.ranking;
    currentData.location = newData.location;
    currentData.link = newData.link;

    if (newImage) {
      // Delete the old image file from the folder
      if (currentData.image) {
        const imagePath = path.join(
          __dirname,
          "../public/TeamsImages",
          currentData.image
        );

        fs.unlinkSync(imagePath);
      }

      currentData.image = newImage.filename;
    }

    await currentData.save();
    io.emit('broker_update')

    return currentData;
  } catch (error) {
    throw error;
  }
};

const deleteTeamById = async (id,io) => {
  try {
    // Find broker by ID and delete it from the database
    const deletedBroker = await Teams.findByIdAndDelete(id);
    if (!deletedBroker) {
      throw new Error("Broker not found");
    }

    // Retrieve the filename of the image associated with the franchise
    const imageUrl = deletedBroker.image;

    // Delete the image file from the folder
    if (imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../public/TeamsImages",
        imageUrl
      );
      fs.unlinkSync(imagePath);
    }

    io.emit('broker_delete')
    return deletedBroker;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBroker,
  getAllTeams,
  deleteTeamById,
  updateTeamById,
  getTeamById,
};
