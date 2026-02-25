import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  title: String,
  price: Number,
  qty: Number,
  image: String
})

const schema = new mongoose.Schema({
  items: [itemSchema],
  total: Number
}, { timestamps: true })

export default mongoose.model('Order', schema)
