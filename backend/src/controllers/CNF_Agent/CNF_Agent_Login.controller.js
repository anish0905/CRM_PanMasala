const CNFAgent = require("../../models/CNF_Agent/CNF_Agent.Model"); 

// Login Controller
const loginCNFAgent = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Validate input
    if (!email || !phone) {
      return res.status(400).json({ message: "Email and phone number are required." });
    }

    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase();

    // Find the CNFAgent with the provided email and phone
    const agent = await CNFAgent.findOne({
      "contact.email": normalizedEmail,
      "contact.phone": phone,
    });

    if (!agent) {
      return res.status(404).json({ message: "Invalid email or phone number." });
    }

    // Login successful
    res.status(200).json({ message: "Login successful.", data: agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { loginCNFAgent };
