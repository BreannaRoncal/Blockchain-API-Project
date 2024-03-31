import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Sort prices from highest to lowest
function sortPrices(a, b) {
    return b.price_24h - a.price_24h;
}

app.get("/", async (req, res) => {
    const response = await axios.get("https://api.blockchain.com/v3/exchange/tickers");
    // Only get cryptocurrency in USD
    var responseUSD = response.data.filter(element => element.symbol.includes("-USD"));
    
    // Get top five prices
    var topFiveResponseUSD = responseUSD.sort(sortPrices).slice(0, 5);
    console.log(topFiveResponseUSD);
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
