const fs = require("fs");

// Read the JSON file
fs.readFile("db.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const convertedData = { locations: [] };

    // Convert object format to array format
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        convertedData.locations.push({ id: key, ...jsonData[key] });
      }
    }

    // Save the transformed data
    fs.writeFile("data.json", JSON.stringify(convertedData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("✅ Data successfully converted and saved to db.json!");
      }
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});
