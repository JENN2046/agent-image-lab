const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.REVIEW_CONSOLE_PORT || process.argv[2] || 4173);
const root = path.resolve(__dirname, "..", "review_console", "static_prototype");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function resolveRequestPath(urlPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  } catch (_error) {
    return { errorStatus: 400, errorMessage: "Bad request" };
  }
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const absolutePath = path.resolve(root, relativePath);
  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    return { errorStatus: 403, errorMessage: "Forbidden" };
  }
  return { filePath: absolutePath };
}

const server = http.createServer((request, response) => {
  const resolved = resolveRequestPath(request.url || "/");
  if (resolved.errorStatus) {
    response.writeHead(resolved.errorStatus, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(resolved.errorMessage);
    return;
  }

  fs.readFile(resolved.filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[path.extname(resolved.filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(content);
  });
});

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`Review Console static preview: http://${host}:${port}/`);
    console.log("Serving local files only from review_console/static_prototype.");
  });
}

module.exports = {
  resolveRequestPath,
  server
};
