const fs = require("fs");
const path = require("path");

module.exports = (req, res, next) => {
  const dbPath = path.join(__dirname, "db.json"); // Path to your JSON database
  const rawData = fs.readFileSync(dbPath);
  const db = JSON.parse(rawData);

  // If request matches an existing key (e.g., /NOSAD, /NOSAU)
  const record = db[req.url.substring(1)]; // Remove leading "/"
  if (record) {
    return res.json(record);
  }

  next(); // Proceed with default handling
};
