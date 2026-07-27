require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})