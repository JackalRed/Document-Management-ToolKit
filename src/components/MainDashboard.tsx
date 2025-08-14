import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Play, 
  Pause, 
  Video, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Activity,
  Loader2,
  Star,
  Globe,
  Tag,
  Shield,
  Timer
} from 'lucide-react';
import { Task, Agent  } from '@/types';

interface MainDashboardProps {
  task: Task | undefined;
  activeAgent: Agent | undefined;
  onAgentSelect: (agentId: string) => void;
  onPauseResume: (agentId: string) => void;
  onViewVideo: (videoUrl: string) => void;
  onOpenRightPanel: () => void;
}

export function MainDashboard({ 
  task, 
  activeAgent, 
  onAgentSelect, 
  onPauseResume, 
  onViewVideo,
  onOpenRightPanel 
}: MainDashboardProps) {
  const [logsExpanded, setLogsExpanded] = React.useState(true);
  const [errorsExpanded, setErrorsExpanded] = React.useState(false);

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h2 className="text-2xl text-foreground mb-2">Good day! How may I assist you today?</h2>
            <p className="text-muted-foreground">Select a task from the sidebar to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'paused':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

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

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-6 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl text-card-foreground">{task.name}</h1>
              <Star className={`h-5 w-5 ${getPriorityColor(task.priority)}`} />
              <Badge 
                variant={
                  task.status === 'completed' ? 'default' :
                  task.status === 'running' ? 'secondary' :
                  task.status === 'failed' ? 'destructive' : 'outline'
                }
              >
                {task.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{task.description}</p>
            
            {/* Task Metadata */}
            <div className="flex flex-wrap gap-4 text-sm">
              {/* Brands */}
              {task.brands.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Brands:</span>
                  <div className="flex space-x-1">
                    {task.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="text-xs">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* UI Validation */}
              {task.uiValidation && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">UI Validation Enabled</span>
                </div>
              )}

              {/* Estimated Duration */}
              {task.estimatedDuration && (
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Est. Duration:</span>
                  <span className="text-card-foreground">{task.estimatedDuration} min</span>
                </div>
              )}

              {/* Priority */}
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Priority:</span>
                <Badge 
                  variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {task.priority.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Tags */}
            {((task.tags ?? []).length) > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {(task.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {task.agents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Activity className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No agents assigned to this task yet</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <Tabs 
            value={activeAgent?.id || task.agents[0]?.id} 
            onValueChange={onAgentSelect}
            className="flex-1 flex flex-col"
          >
            {/* Agent Tabs */}
            <div className="border-b bg-card px-6 pt-4">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                {task.agents.map((agent) => (
                  <TabsTrigger
                    key={agent.id}
                    value={agent.id}
                    className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(agent.status)}
                      <span>{agent.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                        <span className="text-xs opacity-70">
                          {Math.round((agent.progress ?? 0))}%
                        </span>
                      </div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Agent Content */}
            <div className="flex-1 overflow-hidden">
              {task.agents.map((agent) => (
                <TabsContent 
                  key={agent.id} 
                  value={agent.id} 
                  className="flex-1 m-0 overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    {/* Agent Header */}
                    <div className="p-6 border-b bg-card">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl text-card-foreground">Agent {agent.name}</h3>
                            {getStatusIcon(agent.status)}
                            <Badge variant="outline">
                              {agent.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-card-foreground">{Math.round((agent.progress ?? 0))}%</span>
                            </div>
                            <Progress value={agent.progress} className="w-64" />
                          </div>
                          {agent.startTime && (
                            <p className="text-sm text-muted-foreground">
                              Started: {new Date(agent.startTime).toLocaleTimeString()}
                              {agent.endTime && ` • Ended: ${new Date(agent.endTime).toLocaleTimeString()}`}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => onViewVideo('sample-video-url')}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            View Agent Video
                          </Button>
                          <Button
                            variant={agent.status === 'paused' ? 'default' : 'secondary'}
                            onClick={() => onPauseResume(agent.id)}
                            disabled={agent.status === 'completed' || agent.status === 'failed'}
                          >
                            {agent.status === 'paused' ? (
                              <><Play className="h-4 w-4 mr-2" />Resume</>
                            ) : (
                              <><Pause className="h-4 w-4 mr-2" />Pause</>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={onOpenRightPanel}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Agent Content */}
                    <div className="flex-1 overflow-hidden p-6 space-y-6">
                      {/* Execution Logs */}
                      <Card>
                        <Collapsible open={logsExpanded} onOpenChange={setLogsExpanded}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                  <span>Execution Log</span>
                                  <Badge variant="secondary">{((agent.logs ?? []).length)} logs</Badge>
                                </CardTitle>
                                <ChevronDown className={`h-4 w-4 transition-transform ${logsExpanded ? '' : '-rotate-90'}`} />
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent>
                              <ScrollArea className="h-64">
                                <div className="space-y-2">
                                  {(agent.logs ?? []).map((log, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                      <div className="flex-1">
                                        \1{log.message}\2
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {new Date().toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {((agent.logs ?? []).length) === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                      No execution logs yet
                                    </p>
                                  )}
                                </div>
                              </ScrollArea>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>

                      {/* Errors */}
                      <Card>
                        <Collapsible open={errorsExpanded} onOpenChange={setErrorsExpanded}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                  <span>Errors</span>
                                  <Badge 
                                    variant={((agent.errors ?? []).length) > 0 ? "destructive" : "secondary"}
                                  >
                                    {((agent.errors ?? []).length)} errors
                                  </Badge>
                                </CardTitle>
                                <ChevronDown className={`h-4 w-4 transition-transform ${errorsExpanded ? '' : '-rotate-90'}`} />
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent>
                              <ScrollArea className="h-32">
                                <div className="space-y-2">
                                  {(agent.errors ?? []).map((error, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-destructive/10">
                                      <AlertCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                                      <div className="flex-1">
                                        <p className="text-sm text-foreground">{error.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {error.timestamp.toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {((agent.errors ?? []).length) === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                      No errors detected
                                    </p>
                                  )}
                                </div>
                              </ScrollArea>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}