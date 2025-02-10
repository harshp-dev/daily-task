const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("hello world");
});

app.all("*", (req, res) => {
  res.send("This is start");
});
app.listen(3000, () => {
  console.log("server is running");
});
