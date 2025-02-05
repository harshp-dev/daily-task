const http = require("http");

const TOTAL_REQUESTS = 200; // Total number of requests
const CONCURRENT_REQUESTS = 50; // Number of requests sent at the same time
const SERVER_URL = "http://localhost:3000/users"; // Target server URL

let completedRequests = 0;
let failedRequests = 0;
let startTime = Date.now();

const sendRequest = (requestId) => {
  const postData = JSON.stringify({
    name: `User${requestId}`,
    age: Math.floor(Math.random() * 50) + 20,
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/users",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      completedRequests++;
      console.log(
        `✅ Request ${requestId} completed with status: ${res.statusCode}`
      );

      if (completedRequests + failedRequests === TOTAL_REQUESTS) {
        let totalTime = (Date.now() - startTime) / 1000;
        console.log(`\n🚀 Load Test Completed!`);
        console.log(`✅ Successful Requests: ${completedRequests}`);
        console.log(`❌ Failed Requests: ${failedRequests}`);
        console.log(`⏳ Total Time Taken: ${totalTime} seconds`);
      }
    });
  });

  req.on("error", (err) => {
    failedRequests++;
    console.error(`❌ Request ${requestId} failed: ${err.message}`);
  });

  req.write(postData);
  req.end();
};

const startLoadTest = () => {
  console.log(`🚀 Starting Load Test: Sending ${TOTAL_REQUESTS} Requests...\n`);
  startTime = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_REQUESTS) {
    setTimeout(() => {
      for (let j = 0; j < CONCURRENT_REQUESTS && i + j < TOTAL_REQUESTS; j++) {
        sendRequest(i + j + 1);
      }
    }, i * 10); // Small delay to avoid instant request bursts
  }
};

startLoadTest();
