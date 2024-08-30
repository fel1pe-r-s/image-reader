import express from "express";
import { Router } from "express";
import { configMulter } from "./lib/multer.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config.js";
import { controllerUpload } from "./controllerUpload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const routes = Router();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes upload
routes.post("/upload", configMulter.single("file"), controllerUpload);
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
app.use(routes);

// start server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
