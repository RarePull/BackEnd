//for search part as an interaction between node and html, you mi8 have to make stuff like this for other files asw
document
  .getElementById("nftForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nftName = document.getElementById("nftName").value;

    try {
      const response = await fetch("http://localhost:3000/search-nft", {
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
        data.forEach((nft) => {
          const nftItem = document.createElement("p");
          nftItem.textContent = `NFT: ${nft.name} - Similarity Score: ${nft.similarityScore}`;
          resultsDiv.appendChild(nftItem);
        });
      } else {
        resultsDiv.textContent = "No matching results found.";
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  });
