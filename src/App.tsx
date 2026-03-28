import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

interface Project {
  id?: number
  name: string
  fullName: string
  shortName: string
  mentor: string
  website: string
  description: string
}

interface User {
  id?: number
  name: string
  phone: string
  email: string
  bank_name: string
  account_number: string
  role: string
  leader_id: number | null
  isActive: boolean
}

interface Client {
  id?: number
  name: string
  phone: string
  email: string
  gender: string
  age: number
  occupation: string
  project_id: number
  admin_status: string
  source: string
  initial_date: string
  prep_status: string
  funnel_optin: string
}

interface Plan {
  id?: number
  project_id: number
  plan_name: string
  plan_price: number
}

interface SalesKit {
  id?: number
  project_id: number
  title: string
  description: string
  order: number
  fileUrl: string
  fileType: string
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [salesKits, setSalesKits] = useState<SalesKit[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTable, setEditingTable] = useState<'projects' | 'users' | 'clients' | 'salesKits' | 'plans'>('projects')
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes, clientsRes, salesKitsRes, plansRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('users').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('salesKitItems').select('*'),
        supabase.from('plans').select('*'),
      ])

      setProjects(projectsRes.data || [])
      setUsers(usersRes.data || [])
      setClients(clientsRes.data || [])
      setSalesKits(salesKitsRes.data || [])
      setPlans(plansRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const openAddModal = (table: 'projects' | 'users' | 'clients' | 'salesKits' | 'plans') => {
    setEditingTable(table)
    setModalType('add')
    setEditingId(null)
    setFormData({})
    setShowModal(true)
  }

  const openEditModal = (table: 'projects' | 'users' | 'clients' | 'salesKits' | 'plans', item: any) => {
    setEditingTable(table)
    setModalType('edit')
    setEditingId(item.id)
    setFormData(item)
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      let tableName: string = editingTable
      if (editingTable === 'salesKits') tableName = 'salesKitItems'
      
      if (modalType === 'add') {
        const { error } = await supabase.from(tableName).insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase.from(tableName).update(formData).eq('id', editingId)
        if (error) throw error
      }
      setShowModal(false)
      fetchData()
    } catch (error) {
      console.error('Error saving data:', error)
      alert('保存失敗：' + (error as any).message)
    }
  }

  const handleDelete = async (table: 'projects' | 'users' | 'clients' | 'salesKits' | 'plans', id: number) => {
    if (!confirm('確定要刪除嗎？')) return
    try {
      let tableName: string = table
      if (table === 'salesKits') tableName = 'salesKitItems'
      
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting data:', error)
      alert('刪除失敗：' + (error as any).message)
    }
  }

  const renderFormFields = () => {
    if (editingTable === 'projects') {
      return (
        <>
          <div className="form-group">
            <label>名稱 *</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>全名 *</label>
            <input type="text" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="form-group">
            <label>簡稱 *</label>
            <input type="text" value={formData.shortName || ''} onChange={(e) => setFormData({...formData, shortName: e.target.value})} />
          </div>
          <div className="form-group">
            <label>導師</label>
            <input type="text" value={formData.mentor || ''} onChange={(e) => setFormData({...formData, mentor: e.target.value})} />
          </div>
          <div className="form-group">
            <label>網站</label>
            <input type="text" value={formData.website || ''} onChange={(e) => setFormData({...formData, website: e.target.value})} />
          </div>
          <div className="form-group">
            <label>描述</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
        </>
      )
    } else if (editingTable === 'users') {
      return (
        <>
          <div className="form-group">
            <label>名稱 *</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>電話 *</label>
            <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>郵箱 *</label>
            <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>銀行名稱</label>
            <input type="text" value={formData.bank_name || ''} onChange={(e) => setFormData({...formData, bank_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>賬號</label>
            <input type="text" value={formData.account_number || ''} onChange={(e) => setFormData({...formData, account_number: e.target.value})} />
          </div>
          <div className="form-group">
            <label>角色 *</label>
            <select value={formData.role || ''} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="">選擇角色</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Admin">Admin</option>
              <option value="Leader">Leader</option>
              <option value="Closer">Closer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Leader ID</label>
            <input type="number" value={formData.leader_id || ''} onChange={(e) => setFormData({...formData, leader_id: e.target.value ? parseInt(e.target.value) : null})} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={formData.isActive || false} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
              激活
            </label>
          </div>
        </>
      )
    } else if (editingTable === 'clients') {
      return (
        <>
          <div className="form-group">
            <label>名稱 *</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>電話 *</label>
            <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>郵箱 *</label>
            <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>性別</label>
            <select value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="">選擇性別</option>
              <option value="M">男</option>
              <option value="F">女</option>
            </select>
          </div>
          <div className="form-group">
            <label>年齡</label>
            <input type="number" value={formData.age || ''} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>職業</label>
            <input type="text" value={formData.occupation || ''} onChange={(e) => setFormData({...formData, occupation: e.target.value})} />
          </div>
          <div className="form-group">
            <label>項目 ID *</label>
            <input type="number" value={formData.project_id || ''} onChange={(e) => setFormData({...formData, project_id: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>Admin 狀態</label>
            <input type="text" value={formData.admin_status || ''} onChange={(e) => setFormData({...formData, admin_status: e.target.value})} />
          </div>
          <div className="form-group">
            <label>來源</label>
            <input type="text" value={formData.source || ''} onChange={(e) => setFormData({...formData, source: e.target.value})} />
          </div>
          <div className="form-group">
            <label>初始日期</label>
            <input type="date" value={formData.initial_date || ''} onChange={(e) => setFormData({...formData, initial_date: e.target.value})} />
          </div>
          <div className="form-group">
            <label>準備狀態</label>
            <select value={formData.prep_status || ''} onChange={(e) => setFormData({...formData, prep_status: e.target.value})}>
              <option value="">選擇準備狀態</option>
              <option value="Pending">待機中</option>
              <option value="Prepared">已準備</option>
              <option value="No Answer">無回應</option>
              <option value="Reschedule">重新安排</option>
              <option value="Cancel">取消</option>
              <option value="Invalid">無效</option>
            </select>
          </div>
          <div className="form-group">
            <label>Funnel/Optin/Event/Other</label>
            <input type="text" value={formData.funnel_optin || ''} onChange={(e) => setFormData({...formData, funnel_optin: e.target.value})} />
          </div>
        </>
      )
    } else if (editingTable === 'plans') {
      return (
        <>
          <div className="form-group">
            <label>項目 ID *</label>
            <input type="number" value={formData.project_id || ''} onChange={(e) => setFormData({...formData, project_id: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>計劃名稱 *</label>
            <input type="text" value={formData.plan_name || ''} onChange={(e) => setFormData({...formData, plan_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>計劃價格</label>
            <input type="number" step="0.01" value={formData.plan_price || ''} onChange={(e) => setFormData({...formData, plan_price: parseFloat(e.target.value)})} />
          </div>
        </>
      )
    } else if (editingTable === 'salesKits') {
      return (
        <>
          <div className="form-group">
            <label>項目 ID *</label>
            <input type="number" value={formData.project_id || ''} onChange={(e) => setFormData({...formData, project_id: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>標題 *</label>
            <input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>描述</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-group">
            <label>順序</label>
            <input type="number" value={formData.order || ''} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>文件 URL</label>
            <input type="text" value={formData.fileUrl || ''} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} />
          </div>
          <div className="form-group">
            <label>文件類型</label>
            <input type="text" value={formData.fileType || ''} onChange={(e) => setFormData({...formData, fileType: e.target.value})} />
          </div>
        </>
      )
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>ProjectPro</h1>
          <p>管理後台</p>
        </div>
        
        <nav className="menu">
          <button 
            className={`menu-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            儀表板
          </button>
          <button 
            className={`menu-item ${currentPage === 'projects' ? 'active' : ''}`}
            onClick={() => setCurrentPage('projects')}
          >
            項目 <span className="count">{projects.length}</span>
          </button>
          <button 
            className={`menu-item ${currentPage === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentPage('users')}
          >
            用戶 <span className="count">{users.length}</span>
          </button>
          <button 
            className={`menu-item ${currentPage === 'clients' ? 'active' : ''}`}
            onClick={() => setCurrentPage('clients')}
          >
            客戶 <span className="count">{clients.length}</span>
          </button>
          <button 
            className={`menu-item ${currentPage === 'salesKits' ? 'active' : ''}`}
            onClick={() => setCurrentPage('salesKits')}
          >
            Sales Kit <span className="count">{salesKits.length}</span>
          </button>
          <button 
            className={`menu-item ${currentPage === 'plans' ? 'active' : ''}`}
            onClick={() => setCurrentPage('plans')}
          >
            計劃 <span className="count">{plans.length}</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <div className="page">
            <h2>儀表板</h2>
            <div className="stats">
              <div className="stat-card">
                <div className="stat-value">{projects.length}</div>
                <div className="stat-label">項目</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">用戶</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{clients.length}</div>
                <div className="stat-label">客戶</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{plans.length}</div>
                <div className="stat-label">計劃</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{salesKits.length}</div>
                <div className="stat-label">Sales Kit</div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'projects' && (
          <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>項目管理</h2>
              <button 
                className="action-btn"
                onClick={() => openAddModal('projects')}
                style={{ background: '#4CAF50' }}
              >
                + 新增項目
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名稱</th>
                    <th>全名</th>
                    <th>簡稱</th>
                    <th>導師</th>
                    <th>網站</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.id}</td>
                      <td>{project.name}</td>
                      <td>{project.fullName}</td>
                      <td>{project.shortName}</td>
                      <td>{project.mentor}</td>
                      <td>{project.website}</td>
                      <td>
                        <button className="action-btn" onClick={() => openEditModal('projects', project)}>編輯</button>
                        <button className="action-btn delete" onClick={() => handleDelete('projects', project.id!)}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'users' && (
          <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>用戶管理</h2>
              <button 
                className="action-btn"
                onClick={() => openAddModal('users')}
                style={{ background: '#4CAF50' }}
              >
                + 新增用戶
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名稱</th>
                    <th>電話</th>
                    <th>郵箱</th>
                    <th>角色</th>
                    <th>激活</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.isActive ? '是' : '否'}</td>
                      <td>
                        <button className="action-btn" onClick={() => openEditModal('users', user)}>編輯</button>
                        <button className="action-btn delete" onClick={() => handleDelete('users', user.id!)}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'clients' && (
          <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>客戶管理</h2>
              <button 
                className="action-btn"
                onClick={() => openAddModal('clients')}
                style={{ background: '#4CAF50' }}
              >
                + 新增客戶
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名稱</th>
                    <th>電話</th>
                    <th>郵箱</th>
                    <th>性別</th>
                    <th>年齡</th>
                    <th>職業</th>
                    <th>準備狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>{client.name}</td>
                      <td>{client.phone}</td>
                      <td>{client.email}</td>
                      <td>{client.gender}</td>
                      <td>{client.age}</td>
                      <td>{client.occupation}</td>
                      <td>{client.prep_status}</td>
                      <td>
                        <button className="action-btn" onClick={() => openEditModal('clients', client)}>編輯</button>
                        <button className="action-btn delete" onClick={() => handleDelete('clients', client.id!)}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'plans' && (
          <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>計劃管理</h2>
              <button 
                className="action-btn"
                onClick={() => openAddModal('plans')}
                style={{ background: '#4CAF50' }}
              >
                + 新增計劃
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>項目 ID</th>
                    <th>計劃名稱</th>
                    <th>計劃價格</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.id}</td>
                      <td>{plan.project_id}</td>
                      <td>{plan.plan_name}</td>
                      <td>${plan.plan_price}</td>
                      <td>
                        <button className="action-btn" onClick={() => openEditModal('plans', plan)}>編輯</button>
                        <button className="action-btn delete" onClick={() => handleDelete('plans', plan.id!)}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'salesKits' && (
          <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Sales Kit 管理</h2>
              <button 
                className="action-btn"
                onClick={() => openAddModal('salesKits')}
                style={{ background: '#4CAF50' }}
              >
                + 新增 Sales Kit
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>項目 ID</th>
                    <th>標題</th>
                    <th>描述</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {salesKits.map((kit) => (
                    <tr key={kit.id}>
                      <td>{kit.id}</td>
                      <td>{kit.project_id}</td>
                      <td>{kit.title}</td>
                      <td>{kit.description}</td>
                      <td>
                        <button className="action-btn" onClick={() => openEditModal('salesKits', kit)}>編輯</button>
                        <button className="action-btn delete" onClick={() => handleDelete('salesKits', kit.id!)}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === 'add' ? '新增' : '編輯'}</h3>
            <div className="modal-content">
              {renderFormFields()}
            </div>
            <div className="modal-buttons">
              <button className="btn-save" onClick={handleSave}>保存</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
