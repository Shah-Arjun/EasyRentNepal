import express from "express";
import {authUser} from "../middleware/auth"
import {agencyReg} from "../controllers/agencyController"

const agencyRoute = express.Router()

agencyRouter.post('/' , authUser , agencyReg)

export default agencyRoute
