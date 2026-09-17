import express from "express";
import cors from "cors";
import productRouter from "./routes/products";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API is running'
  });
});

app.use('/api/products', productRouter);

app.listen(PORT, () => {
  console.log('SERVER RUNNING ON PORT ', PORT);
})
