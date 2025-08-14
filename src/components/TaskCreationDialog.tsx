import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  Plus, 
  FileText, 
  Settings, 
  Globe,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface TaskCreationFormData {
  name: string;
  description: string;
  brands: string[];
  uiValidation: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: string;
  tags: string[];
}

interface BulkTaskData {
  name: string;
  description: string;
  brand: string;
}

interface TaskCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTask: (taskData: TaskCreationFormData) => void;
  onCreateBulkTasks: (tasks: BulkTaskData[]) => void;
}

const AVAILABLE_BRANDS = [
  'Amazon', 'eBay', 'Shopify', 'WooCommerce', 'Magento',
  'BigCommerce', 'Etsy', 'Alibaba', 'Walmart', 'Target',
  'Best Buy', 'Home Depot', 'Wayfair', 'Overstock', 'Newegg'
];

const COMMON_TAGS = [
  'E-commerce', 'Navigation', 'Search', 'Checkout', 'Product Pages',
  'User Registration', 'Login', 'Cart', 'Payment', 'Mobile', 'Desktop'
];

export function TaskCreationDialog({ 
  open, 
  onClose, 
  onCreateTask, 
  onCreateBulkTasks 
}: TaskCreationDialogProps) {
  const [activeTab, setActiveTab] = useState('single');
  const [formData, setFormData] = useState<TaskCreationFormData>({
    name: '',
    description: '',
    brands: [],
    uiValidation: true,
    priority: 'medium',
    estimatedDuration: '',
    tags: []
  });
  
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkTasks, setBulkTasks] = useState<BulkTaskData[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (formData.brands.length === 0) {
      newErrors.brands = 'At least one brand must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateTask(formData);
      handleClose();
      toast.success('Task created successfully!');
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      brands: [],
      uiValidation: true,
      priority: 'medium',
      estimatedDuration: '',
      tags: []
    });
    setBulkFile(null);
    setBulkTasks([]);
    setErrors({});
    onClose();
  };

  const handleBrandToggle = (brand: string) => {
    setFormData(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleFileUpload = (file: File) => {
    setBulkFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let tasks: BulkTaskData[] = [];
        
        if (file.name.endsWith('.json')) {
          tasks = JSON.parse(text);
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim());
              tasks.push({
                name: values[0] || `Task ${i}`,
                description: values[1] || '',
                brand: values[2] || 'Generic'
              });
            }
          }
        }
        
        setBulkTasks(tasks);
        toast.success(`Loaded ${tasks.length} tasks from file`);
      } catch (error) {
        toast.error('Error parsing file. Please check the format.');
      }
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.json'))) {
      handleFileUpload(file);
    } else {
      toast.error('Please upload a CSV or JSON file');
    }
  };

  const handleBulkSubmit = () => {
    if (bulkTasks.length > 0) {
      onCreateBulkTasks(bulkTasks);
      handleClose();
      toast.success(`Created ${bulkTasks.length} tasks successfully!`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Task</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Single Task</span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="single" className="flex-1 m-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-2xl">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg mb-4 flex items-center space-x-2">
                      <Info className="h-4 w-4" />
                      <span>Basic Information</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taskName">Task Name *</Label>
                    <Input
                      id="taskName"
                      placeholder="Enter task name..."
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskDescription">Task Description *</Label>
                    <Textarea
                      id="taskDescription"
                      placeholder="Describe what this task should accomplish in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className={`min-h-32 ${errors.description ? 'border-destructive' : ''}`}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Brand Selection */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg mb-4 flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Target Brands *</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Select brands to test against:</Label>
                    <div className="grid grid-cols-3 gap-2 p-4 border rounded-lg max-h-40 overflow-y-auto">
                      {AVAILABLE_BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={formData.brands.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                          />
                          <Label 
                            htmlFor={`brand-${brand}`} 
                            className="text-sm cursor-pointer"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    {formData.brands.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.brands.map((brand) => (
                          <Badge key={brand} variant="secondary" className="flex items-center space-x-1">
                            <span>{brand}</span>
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleBrandToggle(brand)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {errors.brands && (
                      <p className="text-sm text-destructive flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.brands}</span>
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Task Configuration */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg mb-4 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Configuration</span>
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uiValidation"
                      checked={formData.uiValidation}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, uiValidation: checked as boolean }))
                      }
                    />
                    <Label htmlFor="uiValidation" className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Perform UI Validation</span>
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value: 'low' | 'medium' | 'high') => 
                          setFormData(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="30"
                        value={formData.estimatedDuration}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                <div className="space-y-4">
                  <div>
                    <Label>Tags (Optional)</Label>
                    <p className="text-sm text-muted-foreground">Add relevant tags to categorize this task</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-4 border rounded-lg">
                    {COMMON_TAGS.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={formData.tags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                        />
                        <Label 
                          htmlFor={`tag-${tag}`} 
                          className="text-sm cursor-pointer"
                        >
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleTagToggle(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bulk" className="flex-1 m-0">
            <div className="p-6 space-y-6">
              {/* Upload Area */}
              <Card>
                <CardContent className="p-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg mb-2">Upload Bulk Tasks</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop a CSV or JSON file, or click to browse
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.csv,.json';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleFileUpload(file);
                        };
                        input.click();
                      }}
                    >
                      Browse Files
                    </Button>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Supported formats: CSV, JSON</p>
                      <p>CSV format: name, description, brand</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Preview */}
              {bulkFile && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{bulkFile.name}</span>
                        <Badge variant="secondary">{bulkTasks.length} tasks</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBulkFile(null);
                          setBulkTasks([]);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {bulkTasks.map((task, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-muted/30">
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">{task.brand}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === 'single' ? (
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.description}>
              Create Task
            </Button>
          ) : (
            <Button onClick={handleBulkSubmit} disabled={bulkTasks.length === 0}>
              Create {bulkTasks.length} Tasks
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}