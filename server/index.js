import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Order from './models/Order.js'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/shop')
  .then(() => console.log('MongoDB connected'))

app.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
})

app.post('/orders', async (req, res) => {
  const order = await Order.create({ items: req.body.items, total: req.body.total })
  res.json(order)
})

app.listen(3001, () => console.log('Server running on port 3001'))
