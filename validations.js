import {body} from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не меньше 8 символов').isLength({min: 8}),
  body('fullName', 'Имя должно быть не меньше 3 символов').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
]

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не меньше 8 символов').isLength({min: 8}),
]

export const postCreateValidation = [
  body('title', 'Название должно содержать не меньше 3 символов').isLength({min: 3}).isString(),
  body('text', 'Текст должен быть не меньше 3 символов').isLength({min: 3}).isString(),
  body('tags', 'Неверный формат тегов').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
