const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "build"), {
  setHeaders: (res, path, stat) => {
    // use cookie to pass environment variables to react app
    // let react app to access this express server as api server
    res.cookie('api_server', '.');
    res.cookie('pusher_server', process.env.REACT_APP_PUSHER_SERVER);
    res.cookie('pusher_app_key', process.env.REACT_APP_PUSHER_APP_KEY);
  }
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const API_SERVER = process.env.REACT_APP_API_SERVER;
const LIST_ENDPOINT = '/api/v1/message/list.json';
const ROOM_ENDPOINT = '/api/v1/room/list.json';
const POST_ENDPOINT = '/api/v1/message.json';

const createRoute = (endpoint) => {
  app.get(endpoint, async (req, res) => {
    try {
      let response = await axios.get(API_SERVER + endpoint, {params: req.query});
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error)
      res.send(error);
    }
  });
};

createRoute(LIST_ENDPOINT);
createRoute(ROOM_ENDPOINT);

app.listen(process.env.PORT || 8080);
