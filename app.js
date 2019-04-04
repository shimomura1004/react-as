const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json())

app.use(express.static(path.join(__dirname, "dist"), {
  setHeaders: (res, path, stat) => {
    // use cookie to pass environment variables to react app
    // let react app to access this express server as api server
    res.cookie('api_server', '.');
    res.cookie('original_api_server', process.env.REACT_APP_API_SERVER);
    res.cookie('pusher_server', process.env.REACT_APP_PUSHER_SERVER);
    res.cookie('pusher_app_key', process.env.REACT_APP_PUSHER_APP_KEY);
  }
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const API_SERVER = process.env.REACT_APP_API_SERVER;
const LIST_ENDPOINT = '/api/v1/message/list.json';
const ROOM_ENDPOINT = '/api/v1/room/list.json';
const POST_ENDPOINT = '/api/v1/message.json';
const USER_ENDPOINT = '/api/v1/user.json';
const MESSAGE_ENDPOINT = '/api/v1/message/:messageId.json';

const createGetRoute = (endpoint) => {
  app.get(endpoint, async (req, res) => {
    try {
      let response = await axios.get(API_SERVER + req.originalUrl, {params: req.query});
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error)
      res.send(error);
    }
  });
};

createGetRoute(LIST_ENDPOINT);
createGetRoute(ROOM_ENDPOINT);
createGetRoute(USER_ENDPOINT);

const createPostRoute = (endpoint) => {
  app.post(endpoint, async (req, res) => {
    try {
      let response = await axios.post(API_SERVER + req.originalUrl.split("?")[0], req.body);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error)
      res.send(error);
    }
  });
};

createPostRoute(POST_ENDPOINT);
createPostRoute(MESSAGE_ENDPOINT);

const createPutRoute = (endpoint) => {
  app.put(endpoint, async (req, res) => {
    try {
      let response = await axios.put(API_SERVER + req.originalUrl.split("?")[0], req.body);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error)
      res.send(error);
    }
  });
};

createPutRoute(MESSAGE_ENDPOINT);

const createDeleteRoute = (endpoint) => {
  app.delete(endpoint, async (req, res) => {
    try {
      let response = await axios.delete(API_SERVER + req.originalUrl.split("?")[0], {data: req.query});
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error)
      res.send(error);
    }
  });
};

createDeleteRoute(MESSAGE_ENDPOINT);

app.listen(process.env.PORT || 8080);
