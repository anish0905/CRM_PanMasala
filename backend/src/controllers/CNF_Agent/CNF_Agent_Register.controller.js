const CNFAgent = require("../../models/CNF_Agent/CNF_Agent.Model"); // Adjust the path based on your project structure

// Register a new CNF Agent
const registerCNFAgent = async (req, res) => {
  try {
    const { name, address, city, state, region, pincode, contact } = req.body;

    // Validate input
    if (!name || !address || !city || !state || !region || !pincode || !contact.email || !contact.phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert email to lowercase
    const email = contact.email.toLowerCase();

    // Check if the email is already in use
    const existingAgent = await CNFAgent.findOne({ "contact.email": email });
    if (existingAgent) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create a new CNFAgent
    const newAgent = new CNFAgent({
      name,
      address,
      city,
      state,
      region,
      pincode,
      contact: {
        email,
        phone: contact.phone,
      },
    });

    // Save to database
    const savedAgent = await newAgent.save();
    res.status(201).json({ message: "CNF Agent registered successfully.", data: savedAgent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { registerCNFAgent };
