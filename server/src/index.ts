import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createConnection } from 'mysql2/promise'
import adminRoutes from './routes/admin.js'
import projectRoutes from './routes/projects.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))
app.use(express.json())

// Database connection pool
let pool: any = null

async function initializeDatabase() {
  try {
    const mysql = await import('mysql2/promise')
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'projectpro',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })

    // Test connection
    const connection = await pool.getConnection()
    console.log('✓ Database connected')
    connection.release()
  } catch (error) {
    console.warn('⚠ Database connection failed, using mock data:', (error as any).message)
    // Continue without database, using mock data
  }
}

// Store pool in app for routes to access
app.locals.pool = pool

// Routes
app.use('/api/admin', adminRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  })
})

// Start server
async function start() {
  await initializeDatabase()
  
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`)
  })
}

start().catch(console.error)
