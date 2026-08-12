import express from 'express'
import { registerCompany, getCompany, getCompanyById, updateCompany } from '../controller/company.controller.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'

const router = express.Router()

router.post('/register', isAuthenticated, registerCompany)

router.get('/get/Companies', isAuthenticated, getCompany)

router.get('/get/Company/:id', isAuthenticated, getCompanyById)

router.put('/update/:id', isAuthenticated, singleUpload, updateCompany)

export default router