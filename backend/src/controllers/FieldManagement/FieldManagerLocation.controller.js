const Location = require("../../models/FieldManagement/fieldManagerLocation.model");

// Save or update a delivery boy's location
const saveLocation = async (req, res) => {
  const {  FieldManagerId, longitude, latitude } = req.body;

  try {
    let location = await Location.findOne({  FieldManagerId });

    if (location) {
      // Add new location to the existing locations arrays
      location.locations.push({ longitude, latitude });
    } else {
      // Create a new location document if it doesn't exist
      location = new Location({
        FieldManagerId,
        locations: [{ longitude, latitude }],
      });
    }

    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to save location", error: error.message });
  }
};

// Get locations of a specific delivery boy
const getLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findOne({  FieldManagerId: id });

    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to get location", error: error.message });
  }
};

module.exports = { saveLocation, getLocation };
