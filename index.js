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
    var responseUSDT = response.data.filter(element => element.symbol.includes("-USDT"));
    
    // Get top five prices
    var topFiveResponseUSDT = responseUSDT.sort(sortPrices).slice(0, 5);
    console.log(topFiveResponseUSDT);
    res.render("index.ejs", { topFive: topFiveResponseUSDT });
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
