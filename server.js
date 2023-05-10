import express from 'express'
import mongoose from 'mongoose'
import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import multer from 'multer'
import cors from 'cors'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import 'dotenv/config.js'
import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({storage})

const PORT = process.env.PORT || 3004

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => console.log('db is fine'))
  .catch(console.log)

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.authMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.get('/users', checkAuth, UserController.getUsers)

app.patch('/follow/:id', checkAuth, UserController.followUser)

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`server runs on port ${PORT}`)
})
