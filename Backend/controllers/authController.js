import bcrypt from "bcrypt";
import passport from "../config/passportConfig.js";
import db from "../config/database.js";
import { RegisterUserDTO, UserResponseDTO } from "../dtos/user.dto.js";

const saltRounds = 10;
const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{10,}$/;

export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ authenticated: false, message: "Server error" });
    }
    if (!user) {
      return res.status(401).json({ authenticated: false, message: info?.message || "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ authenticated: false, message: "Login failed" });
      }

      req.session.user = new UserResponseDTO(user, true);
      return res.json(req.session.user);
    });
  })(req, res, next);
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, confirm } = req.body;
    const registerDTO = new RegisterUserDTO(email, password, confirm);

    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [registerDTO.email]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!passwordRegex.test(registerDTO.password)) {
      return res.status(400).json({
        message: "Password must be at least 10 characters long, contain at least one uppercase letter, and one special character.",
      });
    }

    if (registerDTO.password !== registerDTO.confirm) {
      return res.status(400).json({ message: "Password confirmation does not match" });
    }

    const hashedPassword = await bcrypt.hash(registerDTO.password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [registerDTO.email, hashedPassword]
    );

    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error during login" });
      }
      req.session.user = new UserResponseDTO(user, true);
      return res.status(200).json(req.session.user);
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginGoogle = (req, res) => {
  if (!req.user) {
      return res.redirect("http://localhost:5174/portal");
  } else {

  req.session.user = new UserResponseDTO(req.user, true);
  res.redirect("http://localhost:5174/github-search");
  }
}

export const storeUserSession = (req, res) => {
  try {
    if (req.session?.user) {
      return res.json(req.session.user);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.json(new UserResponseDTO(null, false)); // Ensure authenticated: false
    });
  });
};



