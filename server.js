const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("cross-fetch");

//start express for api calls out to steam
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get("/", function(req, res, next) {
  res.send("API is working properly");
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", router);

// Vanity URL
app.get("/v1/steam/resolveVanityURL/:vanityURL", async function(
  req,
  res,
  next
) {
  var vanityURL = req.params.vanityURL;
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_SECRET}&vanityurl=${vanityURL}&format=json`
  );
  const myJson = await response.json();
  res.send(myJson);
});

// Player summaries
app.get("/v1/steam/GetPlayerSummaries/:steamids", async function(
  req,
  res,
  next
) {
  var steamids = req.params.steamids;
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v1/?key=${process.env.STEAM_SECRET}&steamids=${steamids}&format=json`
  );

  const json = await response.json();

  console.log("player summary response");
  console.log(json);

  res.send(json);
});

// Player owned games
app.get(
  "/v1/steam/GetOwnedGames/:steamid&:include_appinfo&:include_played_free_games",
  async function(req, res, next) {
    var steamid = req.params.steamid;
    var include_appinfo = req.params.include_appinfo;
    var include_played_free_games = req.params.include_played_free_games;
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_SECRET}&steamid=${steamid}&include_appinfo=${include_appinfo}&include_played_free_games=${include_played_free_games}&format=json`
    );
    const json = await response.json();

    console.log("owned games response");
    console.log(json);

    res.send(json);
  }
);

// Game info
app.get("/v1/steam/GetAppDetails/:appids", async function(req, res, next) {
  let appids = req.params.appids;
  console.log(appids);
  const response = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${appids}&format=json`
  );
  const json = await response.json();

  console.log("app details response");
  console.log(json);

  res.send(json);
});

// START THE SERVER
app.listen(port);
console.log(`server listening on port ${port}`);

module.exports = router;
