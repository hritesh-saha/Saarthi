import Location from "../models/locationModel.js";

// Tourist updates location
export const updateLocation = async (req, res) => {
  try {
    const { touristId, latitude, longitude } = req.body;

    let location = await Location.findOne({ touristId });

    if (!location) {
      location = new Location({
        touristId,
        lastCoordinates: { latitude, longitude },
        lastUpdated: Date.now()
      });
    } else {
      location.lastCoordinates = { latitude, longitude };
      location.lastUpdated = Date.now();
    }

    await location.save();

    res.status(200).json({ message: "✅ Location updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For admin/police → check latest location
export const getLastLocation = async (req, res) => {
  try {
    const { touristId } = req.params;
    const location = await Location.findOne({ touristId });

    if (!location) {
      return res.status(404).json({ message: "❌ No location found" });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
