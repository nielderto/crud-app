import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import dotenv from "dotenv/config";
import { PostRoute } from "./routes/post";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());


const PORT =  process.env.PORT || 3001;

app.use("/api/posts", PostRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});