import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'topSecret',
      {
        expiresIn: '30d',
      },
    )

    const {passwordHash, ...userData} = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось зарегистрироваться',
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email})

    if (!user) {
      return res.status(404).json({
        msg: 'Пользователь не найден',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
    if (!isValidPass) {
      return res.status(400).json({
        msg: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'topSecret',
      {
        expiresIn: '30d',
      },
    )

    const {passwordHash, ...userData} = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось авторизоваться',
    })
  }
}

export const authMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      res.status(404).json({
        msg: 'Пользователь не найден',
      })
    }

    const {passwordHash, ...userData} = user._doc

    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Нет доступа',
    })
  }
}

export const getUsers = async (req, res) => {
  try {
    let users = await UserModel.find().populate('follows').exec()

    users = users.filter((user) => user.id !== req.userId)

    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось получить список пользователей',
    })
  }
}

export const followUser = async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.userId
    const user = await UserModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {follows: id},
      },
    )

    if (!user) {
      res.status(404).json({
        msg: 'Пользователь не найден',
      })
    }

    res.json({
      msg: 'Подписка на пользователя прошла успешно',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось подписаться на пользователя',
    })
  }
}
