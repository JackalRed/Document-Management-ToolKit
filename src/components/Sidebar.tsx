import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Plus, 
  Menu, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  Play, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Star,
  Globe,
  Tag
} from 'lucide-react';
import { Task  } from '@/types';

interface SidebarProps {
  tasks: Task[];
  activeTaskId: string | null;
  collapsed: boolean;
  onTaskSelect: (taskId: string) => void;
  onToggleCollapse: () => void;
  onCreateTask: () => void;
}

export function Sidebar({ 
  tasks, 
  activeTaskId, 
  collapsed, 
  onTaskSelect, 
  onToggleCollapse, 
  onCreateTask 
}: SidebarProps) {
  const [metricsOpen, setMetricsOpen] = React.useState(true);
  const [tasksOpen, setTasksOpen] = React.useState(true);

  const completedAgents = tasks.flatMap(task => task.agents).filter(agent => agent.status === 'completed').length;
  const activeAgents = tasks.flatMap(task => task.agents).filter(agent => agent.status === 'running').length;
  const runningAgents = tasks.flatMap(task => task.agents).filter(agent => agent.status === 'running').length;
  const failedAgents = tasks.flatMap(task => task.agents).filter(agent => agent.status === 'failed').length;

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    return <Star className={`h-3 w-3 ${getPriorityColor(priority)}`} />;
  };

  return (
    <div className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {!collapsed && (
            <h2 className="text-sidebar-foreground">QA Dashboard</h2>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Create Task Button */}
        {!collapsed && (
          <Button 
            onClick={onCreateTask}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}

        {collapsed && (
          <Button 
            onClick={onCreateTask}
            size="icon"
            className="w-8 h-8 mx-auto bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {/* Tasks Section */}
        <div className="space-y-2">
          <Collapsible open={tasksOpen} onOpenChange={setTasksOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto text-sidebar-foreground/70"
              >
                {collapsed ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                ) : (
                  <>
                    {tasksOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                    TASKS
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            
            {!collapsed && (
              <CollapsibleContent className="space-y-2 mt-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-sidebar-foreground/50 px-2">No tasks to display</p>
                ) : (
                  tasks.map((task) => (
                    <Card 
                      key={task.id}
                      className={`p-3 cursor-pointer transition-colors hover:bg-sidebar-accent ${
                        activeTaskId === task.id ? 'bg-sidebar-accent border-sidebar-primary' : ''
                      }`}
                      onClick={() => onTaskSelect(task.id)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getPriorityIcon(task.priority)}
                              <h4 className="truncate text-sidebar-foreground">{task.name}</h4>
                            </div>
                            <p className="text-xs text-sidebar-foreground/70 line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              task.status === 'completed' ? 'default' :
                              task.status === 'running' ? 'secondary' :
                              task.status === 'failed' ? 'destructive' : 'outline'
                            }
                            className="text-xs ml-2 flex-shrink-0"
                          >
                            {task.status}
                          </Badge>
                        </div>

                        {/* Brands */}
                        {task.brands.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3 text-sidebar-foreground/50" />
                            <div className="flex flex-wrap gap-1">
                              {task.brands.slice(0, 2).map((brand) => (
                                <Badge 
                                  key={brand} 
                                  variant="outline"
                                  className="text-xs px-1 py-0 h-5"
                                >
                                  {brand}
                                </Badge>
                              ))}
                              {task.brands.length > 2 && (
                                <Badge 
                                  variant="outline"
                                  className="text-xs px-1 py-0 h-5"
                                >
                                  +{task.brands.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {((task.tags ?? []).length) > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3 text-sidebar-foreground/50" />
                            <div className="flex flex-wrap gap-1">
                              {(task.tags ?? []).slice(0, 2).map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary"
                                  className="text-xs px-1 py-0 h-5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {((task.tags ?? []).length) > 2 && (
                                <Badge 
                                  variant="secondary"
                                  className="text-xs px-1 py-0 h-5"
                                >
                                  +{((task.tags ?? []).length) - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-sidebar-foreground/50">
                          <div className="flex items-center space-x-2">
                            <span>{task.agents.length} agents</span>
                            {task.uiValidation && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                UI
                              </Badge>
                            )}
                          </div>
                          <span>{new Date(task.createdAt ?? Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>

        {/* Metrics Overview */}
        <div className="space-y-2">
          <Collapsible open={metricsOpen} onOpenChange={setMetricsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto text-sidebar-foreground/70"
              >
                {collapsed ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                ) : (
                  <>
                    {metricsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                    METRICS OVERVIEW
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            
            {!collapsed && (
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-sidebar-foreground">Completed Agents</span>
                    </div>
                    <Badge variant="secondary">{completedAgents}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-sidebar-foreground">Active Agents</span>
                    </div>
                    <Badge variant="secondary">{activeAgents}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50">
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-sidebar-foreground">Running Agents</span>
                    </div>
                    <Badge variant="secondary">{runningAgents}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-sidebar-foreground">Failed Agents</span>
                    </div>
                    <Badge variant="destructive">{failedAgents}</Badge>
                  </div>
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>
      </div>
    </div>
  );
}