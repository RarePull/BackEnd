//idt this will be used but have kept it here

const axios = require("axios");
const express = require("express");

const app = express();
const port = 3000;

async function fetchImageFromPinata(cid) {
  const url = `https://ipfs.io/ipfs/${cid}`; //link to the server

  try {
    // Fetch the image stream
    const response = await axios.get(url, { responseType: "stream" });

    // Serve the image when a request is made
    app.get("/image", (req, res) => {
      res.set("Content-Type", "image/png"); // Set the appropriate content type
      response.data.pipe(res); // Pipe the image stream to the response
    });

    console.log(`Image will be served at http://localhost:${port}/image`);
  } catch (error) {
    console.error("Error fetching image:", error.message);
  }
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = { fetchImageFromPinata };
