import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "webcontainerbuild")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "webcontainerbuild", "index.html"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server is running on http://localhost:${port}`);
});
