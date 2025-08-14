import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { Bot, Mail, FileText, Database, Send } from 'lucide-react';
import { CustomAgentRequest } from '../App';

interface CustomAgentRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: CustomAgentRequest) => void;
}

const DATA_SOURCE_OPTIONS = [
  { id: 'gcp', label: 'Google Cloud Platform (GCP)', icon: '☁️' },
  { id: 'sharepoint', label: 'Microsoft SharePoint', icon: '📁' },
  { id: 'datalake', label: 'Data Lake', icon: '🏞️' },
  { id: 'other', label: 'Other', icon: '📦' }
];

export function CustomAgentRequestDialog({ open, onOpenChange, onSubmit }: CustomAgentRequestDialogProps) {
  const [formData, setFormData] = useState<CustomAgentRequest>({
    requestorEmail: '',
    shortDescription: '',
    requiredCapabilities: '',
    dataSourceLocations: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataSourceChange = (sourceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dataSourceLocations: checked
        ? [...prev.dataSourceLocations, sourceId]
        : prev.dataSourceLocations.filter(id => id !== sourceId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requestorEmail || !formData.shortDescription || !formData.requiredCapabilities) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.dataSourceLocations.length === 0) {
      toast.error('Please select at least one data source location');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      toast.success('Custom agent request submitted successfully! Our team will review and get back to you within 2-3 business days.');
      onOpenChange(false);
      setFormData({
        requestorEmail: '',
        shortDescription: '',
        requiredCapabilities: '',
        dataSourceLocations: []
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      requestorEmail: '',
      shortDescription: '',
      requiredCapabilities: '',
      dataSourceLocations: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center border border-red-200">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl text-gray-900">Request Custom Agent</DialogTitle>
              <DialogDescription className="text-gray-600">
                Tell us about your specific requirements and we'll create a tailored agent for your needs.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Requestor Email */}
          <div className="space-y-2">
            <Label htmlFor="requestorEmail" className="text-gray-700 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Requestor Email *</span>
            </Label>
            <Input
              id="requestorEmail"
              type="email"
              placeholder="your.email@company.com"
              value={formData.requestorEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, requestorEmail: e.target.value }))}
              className="border-gray-200 focus:border-primary focus:ring-primary/20"
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDescription" className="text-gray-700 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Short Description of the Agent *</span>
            </Label>
            <Textarea
              id="shortDescription"
              placeholder="Describe what you want this agent to accomplish. For example: 'An agent that can analyze financial reports and generate executive summaries with key insights and recommendations.'"
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="border-gray-200 focus:border-primary focus:ring-primary/20 min-h-[100px]"
              required
            />
            <p className="text-xs text-gray-500">
              Provide a clear, concise description of the agent's primary function and objectives.
            </p>
          </div>

          {/* Required Capabilities */}
          <div className="space-y-2">
            <Label htmlFor="requiredCapabilities" className="text-gray-700 flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>What Capabilities Required *</span>
            </Label>
            <Textarea
              id="requiredCapabilities"
              placeholder="List the specific capabilities needed. For example: 'Data analysis, natural language processing, chart generation, email integration, automated reporting, multi-language support.'"
              value={formData.requiredCapabilities}
              onChange={(e) => setFormData(prev => ({ ...prev, requiredCapabilities: e.target.value }))}
              className="border-gray-200 focus:border-primary focus:ring-primary/20 min-h-[100px]"
              required
            />
            <p className="text-xs text-gray-500">
              Specify technical capabilities, integrations, data processing needs, and any special requirements.
            </p>
          </div>

          {/* Data Source Locations */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Data Source Location *</span>
            </Label>
            <p className="text-sm text-gray-600">
              Select all data sources the agent will need to access:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {DATA_SOURCE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={option.id}
                    checked={formData.dataSourceLocations.includes(option.id)}
                    onCheckedChange={(checked) => handleDataSourceChange(option.id, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">{option.icon}</span>
                    <Label htmlFor={option.id} className="text-gray-700 cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Our team will review your request within 1 business day</li>
              <li>• We'll contact you to discuss technical requirements and timeline</li>
              <li>• Development typically takes 3-5 business days</li>
              <li>• You'll receive testing access before full deployment</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="vodafone-gradient hover:opacity-90 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}