"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Eye,
  Clock,
  User,
  Activity,
  Database,
  MessageSquare,
  Shield,
  Bot
} from 'lucide-react'

interface SystemLog {
  _id: string
  action: string
  userId?: string
  adminId?: string
  details: string
  severity: 'info' | 'warning' | 'error'
  timestamp: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
  user?: {
    username: string
    email: string
  }
  admin?: {
    username: string
    email: string
  }
}

interface LogsResponse {
  logs: SystemLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface DiscordWebhookStatus {
  isEnabled: boolean
  lastSent?: string
  status: 'connected' | 'disconnected' | 'error'
  message?: string
}

export function AdminLogsDashboard() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    severity: 'all',
    action: '',
    userId: '',
    startDate: '',
    endDate: ''
  })
  const [discordStatus, setDiscordStatus] = useState<DiscordWebhookStatus>({
    isEnabled: true,
    status: 'connected'
  })

  // Load logs
  const loadLogs = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      })

      const response = await fetch(`/api/admin/logs?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data: LogsResponse = await response.json()
        console.log('Logs data received:', data)
        // Ensure logs is an array and has valid structure
        if (Array.isArray(data.logs)) {
          // Validate each log entry
          const validLogs = data.logs.filter(log => {
            if (!log || typeof log !== 'object' || !log._id || !log.action) {
              console.warn('Invalid log entry:', log)
              return false
            }
            return true
          })
          console.log('Valid logs:', validLogs.length, 'out of', data.logs.length)
          setLogs(validLogs)
          setPagination(data.pagination)
        } else {
          console.error('Invalid logs data received:', data)
          setLogs([])
        }
      }
    } catch (error) {
      console.error('Failed to load logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load Discord webhook status
  const loadDiscordStatus = async () => {
    try {
      const response = await fetch('/api/admin/discord-status', {
        credentials: 'include'
      })
      if (response.ok) {
        const status = await response.json()
        setDiscordStatus(status)
      }
    } catch (error) {
      console.error('Failed to load Discord status:', error)
    }
  }

  // Clear logs
  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear these logs? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          severity: filters.severity === 'all' ? undefined : filters.severity,
          olderThan: filters.startDate || undefined
        })
      })

      if (response.ok) {
        loadLogs(1)
      }
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  // Export logs
  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Severity', 'Details', 'User', 'Admin', 'IP Address'],
      ...logs.map(log => [
        log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown',
        log.action || 'Unknown',
        log.severity || 'info',
        log.details || 'No details',
        log.user && typeof log.user === 'object' && typeof log.user.username === 'string' 
          ? log.user.username 
          : (log.userId || 'N/A'),
        log.admin && typeof log.admin === 'object' && typeof log.admin.username === 'string' 
          ? log.admin.username 
          : (log.adminId || 'N/A'),
        log.ipAddress || 'N/A'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Get severity icon and color
  const getSeverityIcon = (severity: string) => {
    if (!severity || typeof severity !== 'string') {
      return <Info className="h-4 w-4 text-blue-500" />
    }
    
    switch (severity.toLowerCase()) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('USER')) return <User className="h-4 w-4" />
    if (action.includes('CHAT')) return <MessageSquare className="h-4 w-4" />
    if (action.includes('ADMIN')) return <Shield className="h-4 w-4" />
    if (action.includes('SYSTEM')) return <Database className="h-4 w-4" />
    if (action.includes('SECURITY')) return <AlertCircle className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  useEffect(() => {
    loadLogs()
    loadDiscordStatus()
  }, [])

  useEffect(() => {
    loadLogs(1)
  }, [filters])

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Logs Dashboard</h1>
          <p className="text-gray-400">
            Monitor all system activities, user actions, and admin operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => loadLogs()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={clearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Discord Webhook Status */}
      <Card className="bg-[#111] border-[#333]">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Bot className="h-5 w-5 mr-2" />
            Discord Webhook Status
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time logging to Discord channel
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {discordStatus.status === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : discordStatus.status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className={`font-medium ${
                discordStatus.status === 'connected' ? 'text-green-400' :
                discordStatus.status === 'error' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {discordStatus.status === 'connected' ? 'Connected' :
                 discordStatus.status === 'error' ? 'Error' : 'Disconnected'}
              </span>
            </div>
            {discordStatus.lastSent && (
              <div className="text-sm text-gray-400">
                Last sent: {new Date(discordStatus.lastSent).toLocaleString()}
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadDiscordStatus}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </Button>
          </div>
                      {discordStatus.message && (
              <p className="text-sm text-gray-400 mt-2">
                {discordStatus.message}
              </p>
            )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-[#111] border-[#333]">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="severity" className="text-gray-300">Severity</Label>
              <select
                id="severity"
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full mt-1 p-2 border border-[#333] rounded-md bg-[#222] text-white"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
            </div>
            <div>
              <Label htmlFor="action" className="text-gray-300">Action</Label>
              <Input
                id="action"
                placeholder="Filter by action..."
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                className="bg-[#222] border-[#333] text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="userId" className="text-gray-300">User ID</Label>
              <Input
                id="userId"
                placeholder="Filter by user..."
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                className="bg-[#222] border-[#333] text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-[#111] border-[#333]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>System Logs</span>
            <span className="text-sm font-normal text-gray-400">
              {pagination.total} total logs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {Array.isArray(logs) && logs.length > 0 ? logs.map((log) => {
                // Safety check to ensure log has required properties
                if (!log || typeof log !== 'object' || !log._id || !log.action) {
                  console.warn('Invalid log entry in render:', log)
                  return null
                }
                
                // Additional safety check for populated user/admin objects
                if (log.user && (typeof log.user !== 'object' || typeof log.user.username !== 'string')) {
                  console.warn('Invalid user object in log:', log.user)
                  log.user = undefined
                }
                if (log.admin && (typeof log.admin !== 'object' || typeof log.admin.username !== 'string')) {
                  console.warn('Invalid admin object in log:', log.admin)
                  log.admin = undefined
                }
                
                // Ensure all required fields are strings or undefined
                const safeLog = {
                  ...log,
                  action: String(log.action || ''),
                  details: String(log.details || ''),
                  severity: String(log.severity || 'info'),
                  timestamp: log.timestamp || new Date().toISOString(),
                  userId: log.userId || undefined,
                  adminId: log.adminId || undefined,
                  ipAddress: log.ipAddress || undefined
                }
                
                return (
                                <div
                  key={safeLog._id}
                  className="p-4 border border-[#333] rounded-lg hover:bg-[#222]/50 transition-colors bg-[#111]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center space-x-2 mt-1">
                        {getSeverityIcon(safeLog.severity)}
                        {getActionIcon(safeLog.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm bg-[#333] text-white px-2 py-1 rounded">
                            {safeLog.action}
                          </span>
                                                     <span className={`text-xs px-2 py-1 rounded ${
                              safeLog.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                              safeLog.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                              safeLog.severity === 'success' ? 'bg-green-500/20 text-green-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                             {safeLog.severity ? safeLog.severity.toUpperCase() : 'INFO'}
                           </span>
                        </div>
                        <p className="text-sm text-white mb-2">{safeLog.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                                     <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{safeLog.timestamp ? new Date(safeLog.timestamp).toLocaleString() : 'Unknown'}</span>
                            </div>
                           {safeLog.userId && (
                             <div className="flex items-center space-x-1">
                               <User className="h-3 w-3" />
                               <span>
                                 {safeLog.user && typeof safeLog.user === 'object' && typeof safeLog.user.username === 'string' 
                                   ? safeLog.user.username 
                                   : safeLog.userId}
                               </span>
                             </div>
                           )}
                           {safeLog.adminId && (
                             <div className="flex items-center space-x-1">
                               <Shield className="h-3 w-3" />
                               <span>
                                 {safeLog.admin && typeof safeLog.admin === 'object' && typeof safeLog.admin.username === 'string' 
                                   ? safeLog.admin.username 
                                   : safeLog.adminId}
                               </span>
                             </div>
                           )}
                           {safeLog.ipAddress && (
                             <div className="flex items-center space-x-1">
                               <Activity className="h-3 w-3" />
                               <span>{safeLog.ipAddress}</span>
                             </div>
                           )}
                        </div>
                        {safeLog.metadata && Object.keys(safeLog.metadata).length > 0 && (
                          <div className="mt-2 p-2 bg-[#222] rounded text-xs border border-[#333]">
                            <strong className="text-white">Metadata:</strong>
                            <pre className="mt-1 overflow-x-auto text-gray-300">
                              {JSON.stringify(safeLog.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                )
                             }) : (
                 <div className="text-center py-8 text-gray-400">
                   {loading ? 'Loading logs...' : 'No logs found'}
                 </div>
               )}
             </div>
           </ScrollArea>

           {/* Pagination */}
           {pagination.totalPages > 1 && (
             <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333]">
               <div className="text-sm text-gray-400">
                 Page {pagination.page} of {pagination.totalPages}
               </div>
                             <div className="flex items-center space-x-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => loadLogs(pagination.page - 1)}
                   disabled={!pagination.hasPrev}
                   className="border-[#333] hover:bg-[#222] text-white"
                 >
                   Previous
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => loadLogs(pagination.page + 1)}
                   disabled={!pagination.hasNext}
                   className="border-[#333] hover:bg-[#222] text-white"
                 >
                   Next
                 </Button>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
