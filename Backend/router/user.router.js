import express from 'express'
import { register, login, logout, updateprofile, changePassword } from '../controller/user.controller.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'


const router = express.Router()

router.post('/register',singleUpload ,register)

router.post('/login', login)

router.get('/logout', logout)

router.post('/profile/update',isAuthenticated, updateprofile)

router.post('/changePassword', changePassword)

export default router