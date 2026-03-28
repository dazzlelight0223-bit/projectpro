import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Mock data - 使用 let 以便修改
let mockProjects = [
  { id: '1', name: 'Project A', fullName: 'Project Alpha', shortName: 'PA', createdAt: '2024-01-15' },
  { id: '2', name: 'Project B', fullName: 'Project Beta', shortName: 'PB', createdAt: '2024-01-16' },
  { id: '3', name: 'Project C', fullName: 'Project Gamma', shortName: 'PC', createdAt: '2024-01-17' },
  { id: '4', name: 'Project D', fullName: 'Project Delta', shortName: 'PD', createdAt: '2024-01-18' },
  { id: '5', name: 'Project E', fullName: 'Project Epsilon', shortName: 'PE', createdAt: '2024-01-19' },
  { id: '6', name: 'Project F', fullName: 'Project Zeta', shortName: 'PF', createdAt: '2024-01-20' },
  { id: '7', name: 'Project G', fullName: 'Project Eta', shortName: 'PG', createdAt: '2024-01-21' },
  { id: '8', name: 'Project H', fullName: 'Project Theta', shortName: 'PH', createdAt: '2024-01-22' },
  { id: '9', name: 'Project I', fullName: 'Project Iota', shortName: 'PI', createdAt: '2024-01-23' },
  { id: '10', name: 'Project J', fullName: 'Project Kappa', shortName: 'PJ', createdAt: '2024-01-24' },
  { id: '11', name: 'Project K', fullName: 'Project Lambda', shortName: 'PK', createdAt: '2024-01-25' },
  { id: '12', name: 'Project L', fullName: 'Project Mu', shortName: 'PL', createdAt: '2024-01-26' },
  { id: '13', name: 'Project M', fullName: 'Project Nu', shortName: 'PM', createdAt: '2024-01-27' },
  { id: '14', name: 'Project N', fullName: 'Project Xi', shortName: 'PN', createdAt: '2024-01-28' },
  { id: '15', name: 'Project O', fullName: 'Project Omicron', shortName: 'PO', createdAt: '2024-01-29' },
]

let mockUsers = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin', createdAt: '2024-01-01' },
  { id: '2', email: 'user1@example.com', name: 'User One', role: 'user', createdAt: '2024-01-02' },
  { id: '3', email: 'user2@example.com', name: 'User Two', role: 'user', createdAt: '2024-01-03' },
]

// Try to initialize Supabase
let supabase: any = null
let useSupabase = false

async function initSupabase() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.SUPABASE_URL || 'https://ummonlogvmwzcalywuth.supabase.co'
    const supabaseKey = process.env.SUPABASE_KEY || ''

    if (!supabaseKey) {
      console.log('⚠ SUPABASE_KEY not found. Using mock data.')
      return
    }

    supabase = createClient(supabaseUrl, supabaseKey)
    useSupabase = true
    console.log('✓ Supabase initialized')
  } catch (error) {
    console.log('⚠ Supabase initialization failed. Using mock data.')
  }
}

// Initialize Supabase on startup
initSupabase()

// Login endpoint
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'admin@example.com' && password === 'password') {
    const token = jwt.sign(
      { id: '1', email, role: 'admin' },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '24h' }
    )
    res.json({ token, user: { id: '1', email, role: 'admin' } })
  } else {
    res.status(401).json({ message: '登入失敗' })
  }
})

// Get stats
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    projects: mockProjects.length,
    users: mockUsers.length,
    clients: 5,
    notifications: 12
  })
})

// Get projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return res.json(data || [])
    }
    res.json(mockProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.json(mockProjects)
  }
})

// Get single project
router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return res.json(data)
    }
    
    const project = mockProjects.find(p => p.id === id)
    if (project) {
      res.json(project)
    } else {
      res.status(404).json({ message: '項目不存在' })
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ message: '獲取項目失敗' })
  }
})

// Create project
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const { name, fullName, shortName } = req.body

    // Validate input
    if (!name || !fullName || !shortName) {
      return res.status(400).json({ message: '缺少必要字段' })
    }

    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name,
          fullName,
          shortName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single()
      
      if (error) throw error
      return res.status(201).json(data)
    }

    // Fallback to mock data
    const newId = String(Math.max(...mockProjects.map(p => parseInt(p.id) || 0)) + 1)
    const newProject = {
      id: newId,
      name,
      fullName,
      shortName,
      createdAt: new Date().toISOString().split('T')[0]
    }

    mockProjects.push(newProject)
    res.status(201).json(newProject)
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ message: '創建項目失敗', error: (error as any).message })
  }
})

// Update project
router.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, fullName, shortName } = req.body

    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: name || undefined,
          fullName: fullName || undefined,
          shortName: shortName || undefined,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return res.json(data)
    }

    // Fallback to mock data
    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      return res.status(404).json({ message: '項目不存在' })
    }

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      name: name || mockProjects[projectIndex].name,
      fullName: fullName || mockProjects[projectIndex].fullName,
      shortName: shortName || mockProjects[projectIndex].shortName,
    }

    res.json(mockProjects[projectIndex])
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ message: '更新項目失敗', error: (error as any).message })
  }
})

// Delete project
router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (useSupabase && supabase) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return res.json({ message: '項目已刪除' })
    }

    // Fallback to mock data
    const index = mockProjects.findIndex(p => p.id === id)
    if (index > -1) {
      mockProjects.splice(index, 1)
      res.json({ message: '項目已刪除' })
    } else {
      res.status(404).json({ message: '項目不存在' })
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ message: '刪除項目失敗' })
  }
})

// Get users
router.get('/users', async (req: Request, res: Response) => {
  try {
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return res.json(data || [])
    }
    res.json(mockUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.json(mockUsers)
  }
})

// Get single user
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return res.json(data)
    }
    
    const user = mockUsers.find(u => u.id === id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: '用戶不存在' })
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: '獲取用戶失敗' })
  }
})

// Create user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, name, role } = req.body

    if (!email || !name) {
      return res.status(400).json({ message: '缺少必要字段' })
    }

    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email,
          name,
          role: role || 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastSignedIn: new Date().toISOString(),
          isActive: true
        }])
        .select()
        .single()
      
      if (error) throw error
      return res.status(201).json(data)
    }

    // Fallback to mock data
    const newId = String(Math.max(...mockUsers.map(u => parseInt(u.id) || 0)) + 1)
    const newUser = {
      id: newId,
      email,
      name,
      role: role || 'user',
      createdAt: new Date().toISOString().split('T')[0]
    }

    mockUsers.push(newUser)
    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: '創建用戶失敗', error: (error as any).message })
  }
})

// Update user
router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { email, name, role } = req.body

    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: email || undefined,
          name: name || undefined,
          role: role || undefined,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return res.json(data)
    }

    // Fallback to mock data
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return res.status(404).json({ message: '用戶不存在' })
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      email: email || mockUsers[userIndex].email,
      name: name || mockUsers[userIndex].name,
      role: role || mockUsers[userIndex].role,
    }

    res.json(mockUsers[userIndex])
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: '更新用戶失敗', error: (error as any).message })
  }
})

// Delete user
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (useSupabase && supabase) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return res.json({ message: '用戶已刪除' })
    }

    // Fallback to mock data
    const index = mockUsers.findIndex(u => u.id === id)
    if (index > -1) {
      mockUsers.splice(index, 1)
      res.json({ message: '用戶已刪除' })
    } else {
      res.status(404).json({ message: '用戶不存在' })
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: '刪除用戶失敗' })
  }
})

export default router
