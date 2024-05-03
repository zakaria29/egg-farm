import express from "express"
import { verifyToken } from "../middlewares/authorization"
import { createSale, dropSale, getAllSales } from "../controllers/saleController"
import { verifyAddSale } from "../middlewares/verifySale"
const app = express()

app.use(express.json())
app.get(`/`, [verifyToken], getAllSales)
app.post(`/`, [verifyToken, verifyAddSale], createSale)
app.delete(`/:id`, [verifyToken], dropSale)
export default app