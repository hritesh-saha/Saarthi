import location from "../models/locationModel.js";

// Tourist updates location
export const updateLocation = async (req, res) => {
  try {
    const { touristId, latitude, longitude } = req.body;

    let locations = await location.findOne({ touristId });

    if (!locations) {
      locations = new location({
        touristId,
        lastCoordinates: { latitude, longitude },
        lastUpdated: Date.now()
      });
    } else {
      locations.lastCoordinates = { latitude, longitude };
      locations.lastUpdated = Date.now();
    }

    await locations.save();

    res.status(200).json({ message: "✅ Location updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For admin/police → check latest location
export const getLastLocation = async (req, res) => {
  try {
    const { touristId } = req.params;
    const locations = await location.findOne({ touristId });

    if (!locations) {
      return res.status(404).json({ message: "❌ No location found" });
    }

    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocationsByPlace = async (req, res) => {
  try {
    const { lastVisitedPlace } = req.params; // Get from URL

    // Find locations matching the place
    const locations = await location.find({ lastVisitedPlace });

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations by place:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations by place",
      error: error.message,
    });
  }
};