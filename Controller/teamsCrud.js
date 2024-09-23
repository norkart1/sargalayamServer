const Brokers = require("../Models/brokers");
const path = require("path");
const fs= require('fs')

// Function to add a new broker
const addBroker = async (brokerData, brokerImg,io) => {
  console.log(brokerData)
  try {
    // Create a new instance of the Brokers model with the provided data
    const newBroker = new Brokers({
      name: brokerData.name,
      ranking: brokerData.ranking,
      link: brokerData.link,
      score:brokerData.score,
      location: brokerData.location,
      image: brokerImg ? brokerImg.filename : null,
    });

    // Save the new broker to the database
    const savedBroker = await newBroker.save();
    io.emit('broker_add')


    return savedBroker;
  } catch (error) {
    throw error;
  }
};

const getAllBrokers = async () => {
  try {
    // Fetch all brokers from the database
    const brokers = await Brokers.find();
    return brokers;
  } catch (error) {
    throw error;
  }
};

const getBrokerById = async (id) => {
  try {
    // Find broker by ID in the database
    const broker = await Brokers.findById(id);
    if (!broker) {
      throw new Error("Broker not found");
    }
    return broker;
  } catch (error) {
    throw error;
  }
};

const updateBrokerById = async (id, newData, newImage,io) => {
  try {
    // Find broker by ID and update its data in the database
    const currentData = await Brokers.findById(id);

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
          "../public/brokersImages",
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

const deleteBrokerById = async (id,io) => {
  try {
    // Find broker by ID and delete it from the database
    const deletedBroker = await Brokers.findByIdAndDelete(id);
    if (!deletedBroker) {
      throw new Error("Broker not found");
    }

    // Retrieve the filename of the image associated with the franchise
    const imageUrl = deletedBroker.image;

    // Delete the image file from the folder
    if (imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../public/brokersImages",
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
  getAllBrokers,
  deleteBrokerById,
  updateBrokerById,
  getBrokerById,
};
