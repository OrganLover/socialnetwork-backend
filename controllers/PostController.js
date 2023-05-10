import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось получить посты',
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    const post = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {viewsCount: 1},
      },
      {
        returnDocument: 'after',
      },
    )

    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось получить пост',
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось создать пост',
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    )

    if (!post) {
      res.status(404).json({
        msg: 'Пост не найден',
      })
    }

    res.json({
      msg: 'Пост успешно обновлен',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось обновить пост',
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    const postToDelete = await PostModel.findOneAndDelete({
      _id: postId,
    })

    if (!postToDelete) {
      return res.status(400).json({
        msg: 'Пост уже удален',
      })
    }

    res.json({
      msg: 'Пост успешно удален',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Не удалось удалить пост',
    })
  }
}
