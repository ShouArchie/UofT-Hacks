import db from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { username, password } = req.body;

      // Query the database for user credentials (example query)
      const [rows] = await db.query("SELECT * FROM users WHERE username = ? AND password = ?", [
        username,
        password,
      ]);

      if (rows.length > 0) {
        res.status(200).json({ message: "Login successful", user: rows[0] });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error accessing the database:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
