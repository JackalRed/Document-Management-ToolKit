import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  ExternalLink,
  BarChart3,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';
import { Agent  } from '@/types';

interface RightPanelProps {
  open: boolean;
  agent: Agent | undefined;
  onClose: () => void;
}

export function RightPanel({ open, agent, onClose }: RightPanelProps) {
  const mockMetrics = {
    cpuUsage: 45,
    memoryUsage: 67,
    networkActivity: 23,
    executionTime: 345000, // milliseconds
    stepsCompleted: 12,
    totalSteps: 18,
    screenshotsTaken: 8,
    errorsFound: 2
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Agent Details</span>
            </SheetTitle>
          </SheetHeader>

          {agent ? (
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Agent Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agent {agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge 
                        variant={
                          agent.status === 'completed' ? 'default' :
                          agent.status === 'running' ? 'secondary' :
                          agent.status === 'failed' ? 'destructive' : 'outline'
                        }
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{Math.round((agent.progress ?? 0))}%</span>
                      </div>
                      <Progress value={agent.progress} />
                    </div>

                    {agent.startTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Runtime</span>
                        <span className="text-sm">
                          {formatDuration(
                            (agent.endTime || new Date()).getTime() - agent.startTime.getTime()
                          )}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Cpu className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">CPU Usage</span>
                        </div>
                        <span className="text-sm">{mockMetrics.cpuUsage}%</span>
                      </div>
                      <Progress value={mockMetrics.cpuUsage} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <HardDrive className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Memory Usage</span>
                        </div>
                        <span className="text-sm">{mockMetrics.memoryUsage}%</span>
                      </div>
                      <Progress value={mockMetrics.memoryUsage} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Network className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">Network</span>
                        </div>
                        <span className="text-sm">{mockMetrics.networkActivity}%</span>
                      </div>
                      <Progress value={mockMetrics.networkActivity} />
                    </div>
                  </CardContent>
                </Card>

                {/* Execution Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {mockMetrics.stepsCompleted}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Steps Completed</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {mockMetrics.screenshotsTaken}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Screenshots</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {mockMetrics.totalSteps}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Total Steps</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {mockMetrics.errorsFound}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Errors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(agent.logs ?? []).slice(-5).map((log, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm">{log.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {((agent.logs ?? []).length) === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recent activity
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Debug Mode
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Activity className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No agent selected</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}