const fs = require("fs");
const http = require("http");
const { type } = require("os");
const url = require("url");
const PORT = 3000;
const filePath = "./data.json";

// Read file synchronously
const readFile = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

// Write file synchronously
const writeFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data updated successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }
};
// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");

  if (method === "GET" && pathname === "/") {
    res.writeHead(200);
    res.end(JSON.stringify(readFile()));
  } else if (method === "POST" && pathname === "/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let data = readFile();
      let newUser = { id: data.length + 1, ...JSON.parse(body) };
      data.push(newUser);
      writeFile(data);
      res.writeHead(201);
      res.end(JSON.stringify({ message: "User added", newUser }));
    });
  } else if (method === "PUT" && pathname.startsWith("/users/")) {
    let id = pathname.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let data = readFile();
      let index = data.findIndex((user) => user.id == id);
      if (index !== -1) {
        data[index] = { ...data[index], ...JSON.parse(body) };
        writeFile(data);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "User updated", user: data[index] }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "User not found" }));
      }
    });
  } else if (method === "DELETE" && pathname.startsWith("/users/")) {
    let id = pathname.split("/")[2];
    let data = readFile();
    let newData = data.filter((user) => user.id != id);
    if (newData.length !== data.length) {
      writeFile(newData);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "User deleted" }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "User not found" }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
