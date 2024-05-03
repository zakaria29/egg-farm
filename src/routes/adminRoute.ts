import express from "express"
import { verifyToken } from "../middlewares/authorization"
import { authentication, createAdmin, dropAdmin, getAdmin, updateAdmin } from "../controllers/adminController"
import { verifyAddAdmin, verifyAuthentication, verifyEditAdmin } from "../middlewares/verifyAdmin"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, [verifyToken], getAdmin)

/** add middleware process to verify token and verify request data */
app.post(`/`, [verifyToken, verifyAddAdmin], createAdmin)

/** add middleware process to varify token and verify request data */
app.put(`/:id`, [verifyToken, verifyEditAdmin], updateAdmin)

/** add middleware process to verify token */
app.delete(`/:id`, [verifyToken], dropAdmin)

/** add middleware process to verify token */
app.post(`/auth`, [verifyAuthentication], authentication)
export default app