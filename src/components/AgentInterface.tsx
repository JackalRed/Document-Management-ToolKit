import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  LogOut, 
  Send, 
  Settings, 
  MessageSquare,
  Bot,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Copy,
  Download,
  RefreshCw,
  Paperclip,
  Smile
} from 'lucide-react';
import { Agent, User, ChatMessage, AgentSettings } from '../App';

interface AgentInterfaceProps {
  agent: Agent;
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

export function AgentInterface({ agent, user, onBack, onLogout }: AgentInterfaceProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: `Hello ${user.name}! I'm ${agent.name}. I'm here to help you with ${agent.description.toLowerCase()}. What would you like me to help you with today?`,
      timestamp: new Date(),
      status: 'completed'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<AgentSettings>({
    dataSource: 'local',
    inputFormat: 'text',
    outputFormat: 'text',
    maxTokens: 2048,
    temperature: 0.7,
    autoExecute: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    // Simulate agent processing
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: generateAgentResponse(currentMessage, agent),
        timestamp: new Date(),
        status: 'completed',
        result: generateMockResult(currentMessage, agent)
      };

      setMessages(prev => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 2000 + Math.random() * 2000);
  };

  const generateAgentResponse = (userInput: string, agent: Agent): string => {
    const responses = {
      'data-analyst': [
        "I've analyzed the data you provided. Here are the key insights I found:",
        "Let me process this dataset and generate a comprehensive analysis for you.",
        "I've identified several trends in your data. Here's what stands out:"
      ],
      'content-creator': [
        "I've crafted some engaging content based on your requirements:",
        "Here's a creative approach to your content needs:",
        "I've generated several content variations for you to choose from:"
      ],
      'code-assistant': [
        "I've reviewed your code and found some areas for improvement:",
        "Here's a clean, optimized solution for your programming challenge:",
        "I've identified the issue and prepared a fix along with best practices:"
      ],
      'research-assistant': [
        "I've conducted thorough research on your topic. Here's what I found:",
        "Based on my analysis of current market data, here are the insights:",
        "I've gathered comprehensive information from reliable sources:"
      ],
      'automation-expert': [
        "I've designed an automated workflow to streamline this process:",
        "Here's an efficient automation solution for your needs:",
        "I've identified opportunities to optimize your workflow:"
      ],
      'customer-support': [
        "I understand your concern and I'm here to help resolve this issue:",
        "Let me guide you through the solution step by step:",
        "I've found the best approach to address your request:"
      ]
    };

    const agentResponses = responses[agent.id as keyof typeof responses] || [
      "I've processed your request and here's my response:",
      "Based on my analysis, here's what I recommend:",
      "I've completed the task you requested. Here are the results:"
    ];

    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const generateMockResult = (userInput: string, agent: Agent) => {
    // Generate mock results based on agent type
    switch (agent.id) {
      case 'data-analyst':
        return {
          type: 'analysis',
          insights: ['Revenue increased 23% QoQ', 'Customer retention improved', 'New market opportunities identified'],
          charts: ['Line chart showing growth trends', 'Pie chart of customer segments']
        };
      case 'content-creator':
        return {
          type: 'content',
          items: ['Blog post draft (1,200 words)', 'Social media posts (5 variants)', 'Email subject lines (10 options)']
        };
      case 'code-assistant':
        return {
          type: 'code',
          improvements: ['Reduced complexity by 40%', 'Fixed 3 potential bugs', 'Added error handling'],
          files: ['main.py', 'utils.py', 'tests.py']
        };
      default:
        return {
          type: 'general',
          summary: 'Task completed successfully',
          items: ['Generated comprehensive solution', 'Provided actionable recommendations']
        };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const getMessageStatusIcon = (status?: ChatMessage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                {agent.avatar}
              </div>
              <div>
                <h1 className="text-lg text-card-foreground">{agent.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">{agent.category}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground">{agent.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.avatar}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-card-foreground">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-6 pt-4">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6 max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback>
                            {message.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                          <Card className={`${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <CardContent className="p-4">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              
                              {message.result && (
                                <div className="mt-3 pt-3 border-t border-border/20">
                                  <div className="space-y-2">
                                    <p className="text-xs opacity-70">Result:</p>
                                    {message.result.type === 'analysis' && (
                                      <div className="space-y-1">
                                        {message.result.insights.map((insight: string, index: number) => (
                                          <div key={index} className="text-xs opacity-90">• {insight}</div>
                                        ))}
                                      </div>
                                    )}
                                    {message.result.type === 'content' && (
                                      <div className="space-y-1">
                                        {message.result.items.map((item: string, index: number) => (
                                          <div key={index} className="text-xs opacity-90">✓ {item}</div>
                                        ))}
                                      </div>
                                    )}
                                    {message.result.type === 'code' && (
                                      <div className="space-y-1">
                                        {message.result.improvements.map((improvement: string, index: number) => (
                                          <div key={index} className="text-xs opacity-90">⚡ {improvement}</div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {getMessageStatusIcon(message.status)}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-4 px-1 text-xs"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <Card className="bg-muted">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                              <span className="text-sm text-muted-foreground">Processing your request...</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        placeholder={`Ask ${agent.name} anything...`}
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isProcessing}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-2 flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Paperclip className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Smile className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isProcessing}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-xs text-muted-foreground">Quick actions:</span>
                    {agent.useCases.slice(0, 2).map((useCase, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => setCurrentMessage(useCase)}
                      >
                        {useCase}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full p-6">
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Data Source Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Source Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Data Source</Label>
                      <Select value={settings.dataSource} onValueChange={(value: any) => setSettings(prev => ({ ...prev, dataSource: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Files</SelectItem>
                          <SelectItem value="api">External API</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="file">File Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Input Format</Label>
                        <Select value={settings.inputFormat} onValueChange={(value: any) => setSettings(prev => ({ ...prev, inputFormat: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Output Format</Label>
                        <Select value={settings.outputFormat} onValueChange={(value: any) => setSettings(prev => ({ ...prev, outputFormat: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="table">Table</SelectItem>
                            <SelectItem value="chart">Chart</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Model Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Model Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Max Tokens: {settings.maxTokens}</Label>
                      <Slider
                        value={[settings.maxTokens]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokens: value[0] }))}
                        max={4096}
                        min={512}
                        step={256}
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher values allow for longer responses but may increase processing time.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Temperature: {settings.temperature}</Label>
                      <Slider
                        value={[settings.temperature]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value[0] }))}
                        max={1}
                        min={0}
                        step={0.1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower values make responses more focused, higher values more creative.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.autoExecute}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoExecute: checked }))}
                      />
                      <Label>Auto-execute compatible tasks</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Capabilities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {agent.capabilities.map((capability) => (
                        <div key={capability.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="text-sm">{capability.name}</h4>
                            <p className="text-xs text-muted-foreground">{capability.description}</p>
                          </div>
                          <Badge variant="outline">{capability.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Save Settings */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={() => toast.success('Settings saved successfully!')}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}