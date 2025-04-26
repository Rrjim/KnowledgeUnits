export const isAuthenticated = (req, res, next) => {
    console.log("Checking authentication..."); // Debugging log
    console.log("Session user:", req.session?.user); // Check session data
  
    if (req.session?.user) {
      console.log("✅ User is authenticated:", req.session.user);
      return next(); // Allow access
    } else {
      console.log("❌ User is NOT authenticated");
      return res.status(401).json({ authenticated: false, message: "Unauthorized" });
    }
  };
  