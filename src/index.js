import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
import newsRoutes from "./routes/news.route.js";
import typesRoutes from "./routes/news.route.js";

const app = express();

app.use(cors());

app.use("/api/news", newsRoutes);
app.use("/api/types", typesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
