const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "asdfghjkl",
  database: "rarePull",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Helper function to calculate similarity score (higher score = more similar)
function calculateSimilarityScore(input, name) {
  if (name.toLowerCase() === input.toLowerCase()) return 1; // Exact match
  if (name.toLowerCase().includes(input.toLowerCase())) return 0.5; // Partial match
  return 0; // No match
}

// Fetch image from Pinata (this function already exists in your setup)
async function fetchImageFromPinata(ipfsHash) {
  const url = `https://ipfs.io/ipfs/${ipfsHash}`;
  return url;
}

// Serve the HTML and JavaScript directly from the server
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NFT Search</title>
    </head>
    <body>
      <h1>Search for an NFT</h1>
      <form id="nftForm">
        <label for="nftName">NFT Name:</label>
        <input type="text" id="nftName" name="nftName" required>
        <button type="submit">Search</button>
      </form>

      <h2>Search Results:</h2>
      <div id="results"></div>

      <script>
        document.getElementById("nftForm").addEventListener("submit", async function (event) {
          event.preventDefault();
          
          const nftName = document.getElementById("nftName").value;

          try {
            const response = await fetch("/search-nft", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ nftName }),
            });
            
            const data = await response.json();

            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";

            if (data.length) {
              for (const nft of data) {
                // Fetch image from IPFS and display it
                const imageUrl = await fetchImage(nft.ipfsHash);
                const nftItem = document.createElement("div");
                nftItem.innerHTML = \`<p>NFT: \${nft.name}</p><img src="\${imageUrl}" alt="NFT Image" width="200"/>\`;
                resultsDiv.appendChild(nftItem);
              }
            } else {
              resultsDiv.textContent = "No matching results found.";
            }
          } catch (error) {
            console.error("Error fetching search results:", error);
          }
        });

        // Function to fetch image from Pinata
        async function fetchImage(ipfsHash) {
          return \`https://ipfs.io/ipfs/\${ipfsHash}\`;
        }
      </script>
    </body>
    </html>
  `);
});

// Endpoint to handle the NFT search and return IPFS hashes for images
app.post("/search-nft", (req, res) => {
  const userInput = req.body.nftName;

  const query = "SELECT name, ipfsHash FROM allNFT";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query error" });
      return;
    }

    // Calculate similarity score for each NFT and sort by score in descending order
    const sortedResults = results
      .map((nft) => ({
        ...nft,
        similarityScore: calculateSimilarityScore(userInput, nft.name),
      }))
      .filter((nft) => nft.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    // Only return name and ipfsHash fields
    res.json(sortedResults.map(({ name, ipfsHash }) => ({ name, ipfsHash })));
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
