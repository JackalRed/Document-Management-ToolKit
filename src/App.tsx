import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { LoginPage } from './components/LoginPage';
import { AgentGallery } from './components/AgentGallery';
import { AgentInterface } from './components/AgentInterface';
import { Toaster } from './components/ui/sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  avatar: string;
  capabilities: AgentCapability[];
  useCases: string[];
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalInteractions: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'failed';
  result?: any;
}

export interface AgentSettings {
  dataSource: 'local' | 'api' | 'database' | 'file';
  inputFormat: 'text' | 'json' | 'csv' | 'xml';
  outputFormat: 'text' | 'json' | 'table' | 'chart';
  maxTokens: number;
  temperature: number;
  autoExecute: boolean;
}

export interface CustomAgentRequest {
  requestorEmail: string;
  shortDescription: string;
  requiredCapabilities: string;
  dataSourceLocations: string[];
}

export type AppView = 'login' | 'gallery' | 'agent';

export interface AppState {
  currentView: AppView;
  user: User | null;
  selectedAgent: Agent | null;
  agents: Agent[];
}

const SAMPLE_AGENTS: Agent[] = [
  {
    id: 'data-analyst',
    name: 'Data Analyst Pro',
    description: 'Advanced data analysis and visualization specialist. Can process datasets, generate insights, and create compelling visualizations.',
    category: 'Analytics',
    avatar: '📊',
    capabilities: [
      { id: 'data-processing', name: 'Data Processing', description: 'Clean and transform raw data', category: 'Data' },
      { id: 'visualization', name: 'Data Visualization', description: 'Create charts and graphs', category: 'Visual' },
      { id: 'statistical-analysis', name: 'Statistical Analysis', description: 'Perform statistical calculations', category: 'Analytics' }
    ],
    useCases: [
      'Analyze sales performance trends',
      'Generate quarterly business reports',
      'Create customer segmentation analysis',
      'Build predictive models for forecasting'
    ],
    status: 'available',
    rating: 4.8,
    totalInteractions: 1247
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Professional writing and content generation expert. Specializes in business documentation, technical writing, and organizational communications.',
    category: 'Content',
    avatar: '✍️',
    capabilities: [
      { id: 'business-writing', name: 'Business Writing', description: 'Create professional business documents', category: 'Writing' },
      { id: 'technical-writing', name: 'Technical Writing', description: 'Write clear technical documentation', category: 'Writing' },
      { id: 'content-editing', name: 'Content Editing', description: 'Edit and improve existing content', category: 'Editorial' }
    ],
    useCases: [
      'Write comprehensive project proposals',
      'Create internal communication documents',
      'Draft training materials and guides',
      'Generate executive summaries and reports'
    ],
    status: 'available',
    rating: 4.6,
    totalInteractions: 892
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Research and information gathering specialist. Can conduct industry research, competitive analysis, and fact verification.',
    category: 'Research and Insights',
    avatar: '🔍',
    capabilities: [
      { id: 'industry-research', name: 'Industry Research', description: 'Conduct comprehensive industry analysis', category: 'Research' },
      { id: 'competitive-analysis', name: 'Competitive Analysis', description: 'Analyze competitive landscape', category: 'Business' },
      { id: 'fact-checking', name: 'Fact Verification', description: 'Verify information accuracy', category: 'Research' }
    ],
    useCases: [
      'Research industry trends and opportunities',
      'Analyze competitor strategies and positioning',
      'Gather stakeholder feedback and insights',
      'Validate business assumptions with data'
    ],
    status: 'available',
    rating: 4.7,
    totalInteractions: 743
  },
  {
    id: 'market-research-specialist',
    name: 'Market Research Specialist',
    description: 'Deep market intelligence and business analysis expert. Specializes in market sizing, trend analysis, and strategic insights.',
    category: 'Research and Insights',
    avatar: '📈',
    capabilities: [
      { id: 'market-sizing', name: 'Market Sizing', description: 'Calculate market size and potential', category: 'Research' },
      { id: 'business-analysis', name: 'Business Analysis', description: 'Analyze business patterns and opportunities', category: 'Analysis' },
      { id: 'trend-analysis', name: 'Trend Analysis', description: 'Identify industry and business trends', category: 'Insights' }
    ],
    useCases: [
      'Calculate total addressable market (TAM)',
      'Analyze business development opportunities',
      'Identify emerging industry trends',
      'Evaluate expansion opportunities'
    ],
    status: 'available',
    rating: 4.5,
    totalInteractions: 456
  },
  {
    id: 'automation-expert',
    name: 'Automation Expert',
    description: 'Process automation and workflow optimization specialist. Can design automated workflows and improve operational efficiency.',
    category: 'Automation',
    avatar: '⚙️',
    capabilities: [
      { id: 'workflow-design', name: 'Workflow Design', description: 'Design automated workflows', category: 'Process' },
      { id: 'efficiency-optimization', name: 'Efficiency Optimization', description: 'Optimize processes', category: 'Operations' },
      { id: 'integration', name: 'System Integration', description: 'Connect different systems', category: 'Technical' }
    ],
    useCases: [
      'Automate repetitive manual tasks',
      'Design approval workflows',
      'Create data synchronization processes',
      'Build notification and alert systems'
    ],
    status: 'busy',
    rating: 4.5,
    totalInteractions: 567
  },
  {
    id: 'process-automation-specialist',
    name: 'Process Automation Specialist',
    description: 'Enterprise process automation and digital transformation expert. Focuses on large-scale process optimization and RPA implementation.',
    category: 'Automation',
    avatar: '🤖',
    capabilities: [
      { id: 'rpa-implementation', name: 'RPA Implementation', description: 'Deploy robotic process automation', category: 'Automation' },
      { id: 'process-mapping', name: 'Process Mapping', description: 'Map and analyze business processes', category: 'Analysis' },
      { id: 'digital-transformation', name: 'Digital Transformation', description: 'Lead digital initiatives', category: 'Strategy' }
    ],
    useCases: [
      'Implement enterprise RPA solutions',
      'Map and optimize business processes',
      'Design digital transformation strategies',
      'Automate complex multi-step workflows'
    ],
    status: 'available',
    rating: 4.6,
    totalInteractions: 234
  },
  {
    id: 'knowledge-extraction',
    name: 'Knowledge Extraction',
    description: 'Advanced document intelligence and knowledge extraction specialist. Provides access to large document repositories and extracts specific insights from diverse document datasets.',
    category: 'Knowledge Extraction',
    avatar: '🧠',
    capabilities: [
      { id: 'document-parsing', name: 'Document Parsing', description: 'Extract data from various document formats', category: 'Extraction' },
      { id: 'knowledge-mining', name: 'Knowledge Mining', description: 'Discover insights from document collections', category: 'Intelligence' },
      { id: 'semantic-search', name: 'Semantic Search', description: 'Advanced search across document repositories', category: 'Search' }
    ],
    useCases: [
      'Extract key information from contract databases',
      'Search across technical documentation repositories',
      'Analyze patterns in regulatory documents',
      'Generate insights from research paper collections'
    ],
    status: 'available',
    rating: 4.8,
    totalInteractions: 678
  },
  {
    id: 'office-document-creator',
    name: 'Office Document Creator',
    description: 'Specialized in creating professional office documents including Word documents, Excel spreadsheets, and PowerPoint presentations using templates and structured data.',
    category: 'Document Creation',
    avatar: '📝',
    capabilities: [
      { id: 'word-generation', name: 'Word Document Generation', description: 'Create formatted Word documents', category: 'Office' },
      { id: 'excel-automation', name: 'Excel Automation', description: 'Generate complex spreadsheets and calculations', category: 'Office' },
      { id: 'powerpoint-creation', name: 'PowerPoint Creation', description: 'Design professional presentations', category: 'Office' }
    ],
    useCases: [
      'Generate business proposals and contracts',
      'Create financial reports and dashboards',
      'Build presentation decks from data',
      'Automate recurring office document workflows'
    ],
    status: 'available',
    rating: 4.4,
    totalInteractions: 523
  },
  {
    id: 'technical-document-creator',
    name: 'Technical Document Creator',
    description: 'Expert in creating technical documentation including High-Level Design (HLD), Low-Level Design (LLD), API documentation, and system specifications.',
    category: 'Document Creation',
    avatar: '📋',
    capabilities: [
      { id: 'hld-creation', name: 'HLD Creation', description: 'Generate high-level design documents', category: 'Technical' },
      { id: 'lld-creation', name: 'LLD Creation', description: 'Create detailed low-level designs', category: 'Technical' },
      { id: 'api-documentation', name: 'API Documentation', description: 'Document APIs and interfaces', category: 'Technical' }
    ],
    useCases: [
      'Create system architecture documents',
      'Generate API specification documents',
      'Build technical requirement specifications',
      'Document software design patterns'
    ],
    status: 'available',
    rating: 4.7,
    totalInteractions: 345
  },
  {
    id: 'pdf-report-generator',
    name: 'PDF & Report Generator',
    description: 'Professional PDF creation and report generation specialist. Creates formatted reports, compliance documents, and publication-ready PDFs.',
    category: 'Document Creation',
    avatar: '📄',
    capabilities: [
      { id: 'pdf-generation', name: 'PDF Generation', description: 'Create professional PDF documents', category: 'Publishing' },
      { id: 'report-formatting', name: 'Report Formatting', description: 'Format complex reports with charts and tables', category: 'Formatting' },
      { id: 'compliance-docs', name: 'Compliance Documentation', description: 'Generate regulatory compliance documents', category: 'Compliance' }
    ],
    useCases: [
      'Generate annual reports and financial statements',
      'Create compliance and audit documents',
      'Build formatted research publications',
      'Design business proposals and catalogs'
    ],
    status: 'available',
    rating: 4.6,
    totalInteractions: 287
  },
  {
    id: 'document-template-engine',
    name: 'Document Template Engine',
    description: 'Dynamic document generation using advanced templates and data integration. Specializes in mail merge, variable document creation, and bulk document processing.',
    category: 'Document Creation',
    avatar: '📊',
    capabilities: [
      { id: 'template-processing', name: 'Template Processing', description: 'Process dynamic document templates', category: 'Templates' },
      { id: 'data-integration', name: 'Data Integration', description: 'Merge data sources into documents', category: 'Integration' },
      { id: 'bulk-generation', name: 'Bulk Generation', description: 'Generate multiple documents from datasets', category: 'Automation' }
    ],
    useCases: [
      'Generate personalized business communications',
      'Create bulk invoices and statements',
      'Process mail merge campaigns',
      'Generate variable contract documents'
    ],
    status: 'available',
    rating: 4.5,
    totalInteractions: 412
  }
];

export default function App() {
  const [state, setState] = useState<AppState>({
    currentView: 'login',
    user: null,
    selectedAgent: null,
    agents: SAMPLE_AGENTS
  });

  const handleLogin = (userData: { email: string; password: string }) => {
    // Simulate login process
    const user: User = {
      id: '1',
      name: userData.email.split('@')[0],
      email: userData.email,
      avatar: '👤'
    };
    
    setState(prev => ({
      ...prev,
      user,
      currentView: 'gallery'
    }));
  };

  const handleSelectAgent = (agent: Agent) => {
    setState(prev => ({
      ...prev,
      selectedAgent: agent,
      currentView: 'agent'
    }));
  };

  const handleBackToGallery = () => {
    setState(prev => ({
      ...prev,
      selectedAgent: null,
      currentView: 'gallery'
    }));
  };

  const handleLogout = () => {
    setState(prev => ({
      ...prev,
      user: null,
      selectedAgent: null,
      currentView: 'login'
    }));
  };

  const handleCustomAgentRequest = (request: CustomAgentRequest) => {
    // Handle custom agent request
    console.log('Custom agent request:', request);
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-background">
        {state.currentView === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}
        
        {state.currentView === 'gallery' && (
          <AgentGallery 
            agents={state.agents}
            user={state.user!}
            onSelectAgent={handleSelectAgent}
            onLogout={handleLogout}
            onCustomAgentRequest={handleCustomAgentRequest}
          />
        )}
        
        {state.currentView === 'agent' && state.selectedAgent && (
          <AgentInterface 
            agent={state.selectedAgent}
            user={state.user!}
            onBack={handleBackToGallery}
            onLogout={handleLogout}
          />
        )}
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}