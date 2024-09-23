const jwt = require("jsonwebtoken");
const AdminSession = require("../Model/admin");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (email === "admin@gmail.com" && password === "password1") {
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
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "24hr",
        });

        // Store session identifier in the database
        await AdminSession.create({
          emailID: email,
          accessToken: token,
        });

        console.log("Login success");
        return res.status(200).json({ token: token });
      } else {
        console.log("Invalid credentials");
        return res.status(400).json({ message: "Invalid credentials" });
      }
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
        return { success: false, message: "Session not found" };
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