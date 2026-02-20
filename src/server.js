import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Middlewares globales


// Permitir peticiones desde el frontend
app.use(cors());

app.use(express.json());

// Rutas
app.use("/api", routes);
/* app.use("/api/employees", employeeRoutes); */


// Ruta de servidor
app.get("/", (req, res) => {
  res.json({ message: "API corriendo correctamente" });
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
