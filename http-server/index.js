const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

// Get the port number from command line arguments or use 3000 by default
const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

// Variables to store the HTML content
let homeContent = "";
let projectContent = "";
let registrationContent = "";

// Function to read a file and return its content
function loadFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf-8", (err, data) => {
            if (err) {
                console.log(`Could not read ${filename}:`, err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Load all the required files before starting the server
Promise.all([
    loadFile("home.html"),
    loadFile("project.html"),
    loadFile("registration.html")
])
    .then(([home, project, registration]) => {
        // Store the content in variables
        homeContent = home;
        projectContent = project;
        registrationContent = registration;

        // Create and start the server
        http.createServer((request, response) => {
            response.writeHead(200, { "Content-Type": "text/html" });

            // Handle different routes
            if (request.url === "/project") {
                response.write(projectContent);
            } else if (request.url === "/registration") {
                response.write(registrationContent);
            } else {
                response.write(homeContent);
            }
            
            response.end();
        }).listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(() => {
        console.log("Error: Server could not start.");
    });
