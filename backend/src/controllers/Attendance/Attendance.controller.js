const Attendance = require("../../models/Attendance/Attendance.model");

exports.AttendanceLoginTime = async (req, res, next) => {
  try {
    const { user_id, loginLocation, loginImg, role } = req.body;

    if (!user_id || !loginLocation || !loginImg || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const attendance = new Attendance({
      user_id,
      loginLocation:loginLocation,
      logintime: new Date(),
      ispresent: true,
      role,
      loginImg,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Error saving attendance." });
  }
};

exports.AttendanceLogoutTime = async (req, res, next) => {
  const { id } = req.params; // ID of the attendance record

  try {
    // Destructure and validate required fields from the request body
    const { user_id, logoutLocation, logoutImg } = req.body;

    if (!user_id || !logoutLocation || !logoutImg) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Find and update the attendance record
    const attendance = await Attendance.findByIdAndUpdate(
      id, // ID of the attendance record
      {
        logoutLocation,
        logoutImg,
        logouttime: new Date(), // Automatically set logout time to the current date and time
      },
      { new: true } // Return the updated document
    );

    // If attendance is not found, send an appropriate error response
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    res.status(200).json(attendance); // Return the updated attendance record
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Error updating attendance." });
  }
};

exports.AttendanceGetAttendanceByUserId = async (req, res, next) => {
  const { user_id } = req.params; // ID of the user

  try {
    // Get the current date at midnight to compare against login times
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00.000 (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999 (end of the day)

    // Find the latest attendance record for the user today
    const attendance = await Attendance.find({
      user_id,
      logintime: { $gte: startOfDay, $lte: endOfDay }, // Filter for today's records
    })
      .sort({ loginTime: -1 }) // Sort by loginTime in descending order
      .limit(1); // Limit to the latest record of the day

    res.json(attendance);
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    res.status(500).json({ message: "Error retrieving attendance." });
  }
};

exports.getAllAttendanceUserById = async (req, res, next) => {
  const { user_id } = req.params; // ID of the user and by field

  try {
    const attendance = await Attendance.find({ user_id });
    res.json(attendance);
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    res.status(500).json({ message: "Error retrieving attendance." });
  }
};
