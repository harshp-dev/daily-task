const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 3000;
const filePath = "./data.json";

// Read file asynchronously
const readFile = (callback) => {
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      callback([]);
    } else {
      await callback(JSON.parse(data));
    }
  });
};

// Write file asynchronously
const writeFile = (data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Data updated successfully!");
    }
    callback();
  });
};

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  if (pathname === "/" && method === "GET") {
    // GET - Read all users
    readFile((data) => {
      res.writeHead(200);
      res.end(JSON.stringify(data));
    });
  } else if (pathname === "/users" && method === "POST") {
    // POST - Create a new user
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);

      readFile((data) => {
        newUser.id = data.length + 1;
        data.push(newUser);

        writeFile(data, () => {
          res.writeHead(201);
          res.end(JSON.stringify({ message: "User added", newUser }));
        });
      });
    });
  } else if (pathname.startsWith("/users/") && method === "PUT") {
    // PUT - Update a user
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const userId = pathname.split("/")[2];

      readFile((data) => {
        let index = data.findIndex((user) => user.id == userId);
        if (index !== -1) {
          data[index] = { ...data[index], ...JSON.parse(body) };

          writeFile(data, () => {
            res.writeHead(200);
            res.end(
              JSON.stringify({ message: "User updated", user: data[index] })
            );
          });
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ message: "User not found" }));
        }
      });
    });
  } else if (pathname.startsWith("/users/") && method === "DELETE") {
    // DELETE - Remove a user
    const userId = pathname.split("/")[2];

    readFile((data) => {
      let newData = data.filter((user) => user.id != userId);

      if (newData.length !== data.length) {
        writeFile(newData, () => {
          res.writeHead(200);
          res.end(JSON.stringify({ message: "User deleted" }));
        });
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "User not found" }));
      }
    });
  } else {
    // Handle 404
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

console.log("Hello World");
