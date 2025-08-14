import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { CustomAgentRequestDialog } from './CustomAgentRequest';
import { 
  Search, 
  Star, 
  Users, 
  LogOut, 
  Filter,
  ArrowRight,
  Bot,
  Plus,
  Sparkles
} from 'lucide-react';
import { Agent, User, CustomAgentRequest } from '../App';

interface AgentGalleryProps {
  agents: Agent[];
  user: User;
  onSelectAgent: (agent: Agent) => void;
  onLogout: () => void;
  onCustomAgentRequest: (request: CustomAgentRequest) => void;
}

export function AgentGallery({ agents, user, onSelectAgent, onLogout, onCustomAgentRequest }: AgentGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomAgentDialog, setShowCustomAgentDialog] = useState(false);

  // Updated categories with exact counts as requested
  const categories = [
    { id: 'all', label: 'All agents', count: 10 },
    { id: 'Analytics', label: 'Analytics', count: 1 },
    { id: 'Content', label: 'Content', count: 1 },
    { id: 'Knowledge Extraction', label: 'Knowledge Extraction', count: 1 },
    { id: 'Research and Insights', label: 'Research and Insights', count: 2 },
    { id: 'Document Creation', label: 'Document Creation', count: 4 },
    { id: 'Automation', label: 'Automation', count: 2 }
  ];
  
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-red-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Document Management Agents</h1>
            <p className="text-gray-600">Choose an AI agent to streamline your document workflows</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 font-medium">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="border-gray-200 hover:bg-red-50 hover:border-primary/50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-white/60 backdrop-blur-sm p-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <h3 className="text-gray-900 font-medium">Categories</h3>
              </div>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className={`w-full justify-start text-sm ${
                      selectedCategory === category.id 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                    <Badge 
                      variant={selectedCategory === category.id ? 'secondary' : 'outline'} 
                      className={`ml-auto text-xs ${
                        selectedCategory === category.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'border-gray-300'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Agent Request */}
            <div className="space-y-3">
              <h3 className="text-gray-900 font-medium">Custom Solutions</h3>
              <Card className="border-primary/20 bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-900 font-medium">Need something specific?</h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Request a custom agent tailored to your unique document workflow needs.
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setShowCustomAgentDialog(true)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Create Custom Agent
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl text-gray-900">
                      {selectedCategory === 'all' ? 'All Agents' : selectedCategory}
                    </h2>
                    <p className="text-gray-600">
                      {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>

                {/* Agent Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgents.map((agent) => (
                    <Card 
                      key={agent.id} 
                      className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-gray-200 bg-white/80 backdrop-blur-sm hover-lift"
                      onClick={() => onSelectAgent(agent)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center text-2xl border border-red-200">
                              {agent.avatar}
                            </div>
                            <div 
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(agent.status)} shadow-sm`}
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <CardTitle className="truncate text-gray-900">{agent.name}</CardTitle>
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                              {agent.category}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {getStatusText(agent.status)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {agent.description}
                        </p>

                        {/* Key Capabilities */}
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 font-medium">Key Capabilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 3).map((capability) => (
                              <Badge key={capability.id} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                {capability.name}
                              </Badge>
                            ))}
                            {agent.capabilities.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                +{agent.capabilities.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-gray-700 font-medium">{agent.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-500">{agent.totalInteractions.toLocaleString()}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 shadow-sm"
                              disabled={agent.status === 'offline'}
                            >
                              Connect <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAgents.length === 0 && (
                  <div className="text-center py-12">
                    <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">No agents found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Custom Agent Request Dialog */}
      <CustomAgentRequestDialog
        open={showCustomAgentDialog}
        onOpenChange={setShowCustomAgentDialog}
        onSubmit={onCustomAgentRequest}
      />
    </div>
  );
}