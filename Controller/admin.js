const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AdminSession = require("../Model/admin");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Pre-configured admin credentials (stored as hashed password)
      const ADMIN_EMAIL = "samastha@gmail.com";
      // This is the bcrypt hash of "Password1" 
      const ADMIN_PASSWORD_HASH = "$2b$10$LLIthfkgxQ1ZvHYqK7VaZOX9/H7RMuG5HCcjmdW0FL0pkZdJnKBH2";
      const ADMIN_NAME = "Admin User";
      
      // Check if email matches
      if (email !== ADMIN_EMAIL) {
        console.log("Invalid email");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Hash the provided password and compare with stored hash
      let isPasswordValid = false;
      try {
        // Use bcrypt to compare the password with stored hash
        isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      } catch (error) {
        console.log("Password comparison error:", error);
        isPasswordValid = false;
      }
      
      if (!isPasswordValid) {
        console.log("Invalid password");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if the user is already logged in
      const existingSession = await AdminSession.findOne({ emailID: email });

      if (existingSession) {
        console.log("existingSession", existingSession);
        
        // If the session exists, check if it's expired
        const currentTime = new Date();
        const sessionExpiration = new Date(existingSession.updatedAt);
        sessionExpiration.setHours(sessionExpiration.getHours() + 24); // Assuming session expires after 24 hours

        if (currentTime > sessionExpiration) {
          // If the session is expired, delete the session record
          await AdminSession.findOneAndDelete({ emailID: email });
        } else {
          // If the session is not expired, return an error
          console.log("Admin is already logged in");
          return res.status(401).json({
            message: `Admin with email ${email} is already logged in`,
          });
        }
      }

      // Generate access token
      const token = jwt.sign({ 
        email: email, 
        id: "admin_001",
        role: "admin"
      }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      // Store session identifier in the database (using upsert to avoid collection limit issues)
      try {
        await AdminSession.findOneAndUpdate(
          { emailID: email },
          { 
            emailID: email,
            accessToken: token,
            createdAt: new Date()
          },
          { upsert: true, new: true }
        );
      } catch (dbError) {
        console.log("Session storage failed, continuing without session storage:", dbError.message);
        // Continue without storing session - authentication still valid
      }

      console.log("Login success");
      return res.status(200).json({ 
        token: token,
        user: {
          id: "admin_001",
          email: email,
          name: ADMIN_NAME,
          role: "admin"
        }
      });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  logout: async (req, res) => {
    const { token } = req.body;

    try {
      const session = await AdminSession.findOneAndDelete({
        accessToken: token,
      });

      if (!session) {
        // If no session found, return an error response
        return res.status(404).json({ success: false, message: "Session not found" });
      }

      // Respond with success message
      res
        .status(200)
        .json({ success: true, message: "Admin logged out successfully" });
    } catch (error) {
      console.error("Error logging out super admin:", error);
      //return { success: false, message: "Internal server error" };
      res
        .status(401)
        .json({ success: false, message: "Internal server error" });
    }
  },
};