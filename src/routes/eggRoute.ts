import express from "express"
import { verifyToken } from "../middlewares/authorization"
import { createEgg, dropEgg, getAllEggs, updateEgg } from "../controllers/eggController"
import uploadFile from "../middlewares/uploadImageOfEgg"
import { verifyAddEgg, verifyEditEgg } from "../middlewares/verifyEgg"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, [verifyToken], getAllEggs)

/** add middleware process to varify token, upload an image, and verify request data */
app.post(`/`, [verifyToken, uploadFile.single("image"), verifyAddEgg], createEgg)

/** add middleware process to varify token, upload an image, and verify request data */
app.put(`/:id`, [verifyToken, uploadFile.single("image"), verifyEditEgg], updateEgg)

/** add middleware process to verify token */
app.delete(`/:id`, [verifyToken], dropEgg)
export default app