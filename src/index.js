import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
import newsRoutes from "./routes/news.route.js";
import typesRoutes from "./routes/types.route.js";
import usersRoutes from "./routes/users.route.js";
import emailsRoutes from "./routes/emails.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/news", newsRoutes);
app.use("/api/types", typesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/emails", emailsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
