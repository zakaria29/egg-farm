import express from "express"
import path from "path"
import cors from "cors"
import EggRoute from "./routes/eggRoute"
import OrderRoute from "./routes/orderRoute"
import AdminRoute from "./routes/adminRoute"
import PackRoute from "./routes/packRoute"

const app = express()
const PORT: number = 8000

app.use(cors())

app.use(`/egg`, EggRoute)
app.use(`/sale`, OrderRoute)
app.use(`/admin`, AdminRoute)
app.use(`/pack`, PackRoute)
app.use(`/public`, express.static(path.join(__dirname, `public`)))
app.listen(PORT, () => console.log(`Server Egg Farm run on port ${PORT}`))