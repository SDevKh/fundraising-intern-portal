const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const cors = require('cors')
const bcrypt = require('bcrypt')
require("dotenv").config({path: "./config.env"})

console.log('Starting server...')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

let db

console.log('Attempting MongoDB connection...')
MongoClient.connect(process.env.ATLAS_URL)
  .then(client => {
    console.log('Connected to MongoDB')
    db = client.db('intern')
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' })
})

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request:', req.body)
    const { name, email, password } = req.body
    
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      referralCode,
      createdAt: new Date()
    })
    
    console.log('User created:', result.insertedId)
    res.status(201).json({ message: 'User created successfully', userId: result.insertedId })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login request:', req.body)
    const { email, password } = req.body
    
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    console.log('Login successful for:', email)
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get user profile
app.get('/api/user/:id', async (req, res) => {
  try {
    console.log('Get user request for ID:', req.params.id)
    const { id } = req.params
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
        if (!user.referralCode) {
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: { referralCode } }
      )
      user.referralCode = referralCode
    }
    console.log('User found:', user.name)
    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update user name
app.put('/api/user/:id', async (req, res) => {
  try {
    console.log('Update user request:', req.params.id, req.body)
    const { id } = req.params
    const { name } = req.body
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, updatedAt: new Date() } }
    )
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('User updated successfully')
    res.json({ message: 'Name updated successfully' })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: error.message })
  }
})
// Add to server.js as a one-time endpoint
app.post('/api/generate-referral-codes', async (req, res) => {
  try {
    const users = await db.collection('users').find({ referralCode: { $exists: false } }).toArray()
    
    for (const user of users) {
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { referralCode } }
      )
    }
    
    res.json({ message: `Generated referral codes for ${users.length} users` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

console.log('Server setup complete')
