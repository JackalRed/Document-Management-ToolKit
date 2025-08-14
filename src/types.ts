export type AgentStatus = 'running' | 'completed' | 'failed' | 'paused'
export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'paused'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Agent {
  id: string
  name: string
  status: AgentStatus
  progress?: number
  startTime?: Date
  endTime?: Date | null
  logs?: { id: string; message: string; timestamp: Date }[]
  errors?: { id: string; message: string; timestamp: Date }[]
}

export interface Task {
  id: string
  name: string
  createdAt?: Date | string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  brands: string[]
  tags?: string[]
  estimatedDuration?: string | number
  uiValidation?: boolean
  agents: Agent[]
}