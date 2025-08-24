'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Activity, 
  Settings, 
  Shield, 
  BarChart3, 
  MessageSquare,
  UserPlus,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AdminLogsDashboard } from '@/components/admin-logs-dashboard'

interface User {
  _id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'premium'
  isActive: boolean
  messageCount: number
  createdAt: string
  lastLogin: string
  lastReset: string
  lastLoginIP?: string
}

interface SystemLog {
  _id: string
  action: string
  userId?: string
  adminId?: string
  details: string
  timestamp: string
  severity: 'info' | 'warning' | 'error'
}

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalMessages: number
  newUsersToday: number
  messagesPerDay: number
  systemErrors: number
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<User[]>([])
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin' | 'premium'
  })
  const [creatingUser, setCreatingUser] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Load initial data
  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData()
    }
  }, [user])



  const loadDashboardData = async () => {
    setDataLoading(true)
    try {
      console.log('Loading dashboard data...')
      await Promise.all([
        loadUsers(),
        loadSystemLogs(),
        loadStats()
      ])
      console.log('Dashboard data loaded successfully')
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setDataLoading(false)
    }
  }

  const createUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('All fields are required')
      return
    }

    setCreatingUser(true)
    setError('')

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newUser)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      const result = await response.json()
      
      // Add the new user to the users list
      setUsers(prev => [result.user, ...prev])
      
      // Reset form and close modal
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'user'
      })
      setShowAddUserModal(false)
      
      // Reload users to get updated data
      await loadUsers()
      
    } catch (error) {
      console.error('Error creating user:', error)
      setError(error instanceof Error ? error.message : 'Failed to create user')
    } finally {
      setCreatingUser(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Users data received:', data)
        if (Array.isArray(data.users)) {
          setUsers(data.users)
        } else {
          console.error('Invalid users data received:', data)
          setUsers([])
        }
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const loadSystemLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Failed to load logs:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId))
        await loadStats() // Refresh stats
      } else {
        const error = await response.json()
        alert(`Failed to delete user: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !isActive })
      })
      
      if (response.ok) {
        setUsers(users.map(u => 
          u._id === userId ? { ...u, isActive: !isActive } : u
        ))
      } else {
        const error = await response.json()
        alert(`Failed to update user: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const filteredUsers = users.filter(user =>
    user && 
    typeof user === 'object' && 
    user.username && 
    user.email &&
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Debug users data
  useEffect(() => {
    if (users.length > 0) {
      console.log('Users loaded:', users)
      console.log('Filtered users:', filteredUsers)
    }
  }, [users, filteredUsers])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#333] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={loadDashboardData}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="border-[#333] hover:bg-[#222]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="sm"
              className="border-[#333] hover:bg-[#222]"
            >
              Back to App
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#111] border-r border-[#333] min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-accent text-black' : 'hover:bg-[#222]'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'users' ? 'bg-accent text-black' : 'hover:bg-[#222]'
                }`}
              >
                <Users className="h-5 w-5" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'logs' ? 'bg-accent text-black' : 'hover:bg-[#222]'
                }`}
              >
                <Activity className="h-5 w-5" />
                System Logs
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-accent text-black' : 'hover:bg-[#222]'
                }`}
              >
                <Settings className="h-5 w-5" />
                System Settings
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">System Overview</h2>
              
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-[#111] border-[#333] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Users</p>
                        <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-[#111] border-[#333] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active Users</p>
                        <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-[#111] border-[#333] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Messages</p>
                        <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-[#111] border-[#333] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">New Users Today</p>
                        <p className="text-2xl font-bold text-white">{stats.newUsersToday}</p>
                      </div>
                      <UserPlus className="h-8 w-8 text-yellow-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-[#111] border-[#333] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Messages/Day</p>
                        <p className="text-2xl font-bold text-white">{stats.messagesPerDay}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-cyan-400" />
                    </div>
                  </Card>
                  
                  <Card className="bg-[#111] border-[#333] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">System Errors</p>
                        <p className="text-2xl font-bold text-white">{stats.systemErrors}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                  </Card>
                </div>
              )}

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#111] border-[#333] p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map(user => (
                      <div key={user._id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-[#111] border-[#333] p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent System Logs</h3>
                  <div className="space-y-3">
                    {logs.slice(0, 5).map(log => (
                      <div key={log._id} className="py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            log.severity === 'error' ? 'bg-red-400' :
                            log.severity === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                          <p className="font-medium text-sm">{log.action}</p>
                        </div>
                        <p className="text-xs text-gray-400 ml-4">{log.details}</p>
                        <p className="text-xs text-gray-500 ml-4">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Button 
                  className="bg-accent hover:bg-accent/80 text-black"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#111] border-[#333] text-white"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-[#333] hover:bg-[#222]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-[#333] hover:bg-[#222]">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Users Table */}
              <Card className="bg-[#111] border-[#333]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#333]">
                        <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Messages</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Last Login</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Last IP</th>
                        <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => {
                        // Safety check to ensure user has required properties
                        if (!user || typeof user !== 'object' || !user._id || !user.username || !user.email) {
                          console.warn('Invalid user object:', user)
                          return null
                        }
                        
                        return (
                        <tr key={user._id} className="border-b border-[#333] hover:bg-[#222]/50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-white">{user.username}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                              user.role === 'premium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-300">{user.messageCount || 0}</td>
                          <td className="p-4 text-sm text-gray-300">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="p-4 text-sm text-gray-300">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-4 text-sm text-gray-300">
                            {user.lastLoginIP || 'Unknown'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#333] hover:bg-[#222] p-2"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#333] hover:bg-[#222] p-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                className="border-[#333] hover:bg-[#222] p-2"
                              >
                                <Ban className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(user._id)}
                                className="border-red-500 text-red-400 hover:bg-red-500/10 p-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div>
              <AdminLogsDashboard />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">System Settings</h2>
              
              <div className="grid gap-6">
                <Card className="bg-[#111] border-[#333] p-6">
                  <h3 className="text-lg font-semibold mb-4">Message Limits</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Daily message limit for free users</label>
                      <Input
                        type="number"
                        defaultValue="50"
                        className="w-24 bg-[#222] border-[#333] text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Daily message limit for premium users</label>
                      <Input
                        type="number"
                        defaultValue="500"
                        className="w-24 bg-[#222] border-[#333] text-white"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="bg-[#111] border-[#333] p-6">
                  <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="border-[#333] hover:bg-[#222]">
                      Clear System Cache
                    </Button>
                    <Button variant="outline" className="border-[#333] hover:bg-[#222]">
                      Reset Daily Message Counts
                    </Button>
                    <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                      Backup Database
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add New User</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-[#222] border-[#333] text-white"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#222] border-[#333] text-white"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-[#222] border-[#333] text-white"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' | 'premium' }))}
                  className="w-full bg-[#222] border border-[#333] text-white rounded-md px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="premium">Premium</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={createUser}
                  disabled={creatingUser}
                  className="flex-1 bg-accent hover:bg-accent/80 text-black"
                >
                  {creatingUser ? 'Creating...' : 'Create User'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 border-[#333] hover:bg-[#222] text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
