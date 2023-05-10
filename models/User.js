import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: Number,
    city: String,
    school: String,
    passwordHash: {
      type: String,
      required: true,
    },
    follows: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    avatarUrl: String,
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('User', UserSchema)
