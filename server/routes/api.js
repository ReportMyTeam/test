const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'motdepasse',
    database: 'TP5'
   })

client.connect()

router.post('/register', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
  
    const result = await client.query({
      text: 'SELECT * FROM users WHERE email=$1',
      values: [email]
    })
  
    if (result.rows.length > 0) {
      res.status(401).json({
        message: 'user already exists'
      })
      return
    }
    // si on a pas trouvé l'utilisateur
    // alors on le crée
  
    const hash = await bcrypt.hash(password, 10)
  
    await client.query({
      text: `INSERT INTO users(email, password)
      VALUES ($1, $2)
      `,
      values: [email, hash]
    })
    res.send('ok')
  })
  