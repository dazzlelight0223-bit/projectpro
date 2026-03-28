// 完整的數據庫層 - 包含所有用戶和客戶數據

// 用戶數據 (10+ 用戶)
export const users = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin', createdAt: '2024-01-01' },
  { id: '2', email: 'manager1@example.com', name: 'Project Manager 1', role: 'manager', createdAt: '2024-01-02' },
  { id: '3', email: 'manager2@example.com', name: 'Project Manager 2', role: 'manager', createdAt: '2024-01-03' },
  { id: '4', email: 'user1@example.com', name: 'User One', role: 'user', createdAt: '2024-01-04' },
  { id: '5', email: 'user2@example.com', name: 'User Two', role: 'user', createdAt: '2024-01-05' },
  { id: '6', email: 'user3@example.com', name: 'User Three', role: 'user', createdAt: '2024-01-06' },
  { id: '7', email: 'user4@example.com', name: 'User Four', role: 'user', createdAt: '2024-01-07' },
  { id: '8', email: 'user5@example.com', name: 'User Five', role: 'user', createdAt: '2024-01-08' },
  { id: '9', email: 'user6@example.com', name: 'User Six', role: 'user', createdAt: '2024-01-09' },
  { id: '10', email: 'user7@example.com', name: 'User Seven', role: 'user', createdAt: '2024-01-10' },
  { id: '11', email: 'user8@example.com', name: 'User Eight', role: 'user', createdAt: '2024-01-11' },
  { id: '12', email: 'user9@example.com', name: 'User Nine', role: 'user', createdAt: '2024-01-12' },
  { id: '13', email: 'user10@example.com', name: 'User Ten', role: 'user', createdAt: '2024-01-13' },
]

// 客戶數據 (150 個客戶)
export const clients = Array.from({ length: 150 }, (_, i) => ({
  id: String(i + 1),
  name: `Client ${i + 1}`,
  email: `client${i + 1}@example.com`,
  phone: `+852 ${Math.floor(Math.random() * 10000000000)}`,
  company: `Company ${Math.floor(i / 10) + 1}`,
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
  createdAt: new Date(2024, 0, Math.floor(i / 5) + 1).toISOString().split('T')[0],
}))

// 項目數據 (15 個項目)
export const projects = [
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

// 數據庫操作函數
export const db = {
  getAllUsers: () => users,
  getUserById: (id: string) => users.find(u => u.id === id),
  getAllClients: () => clients,
  getClientById: (id: string) => clients.find(c => c.id === id),
  getAllProjects: () => projects,
  getProjectById: (id: string) => projects.find(p => p.id === id),
  getStats: () => ({
    projects: projects.length,
    users: users.length,
    clients: clients.length,
    notifications: 12,
  }),
}
