import { useState } from 'react';

// Define types for our component
interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
  isCriticalPath: boolean;
  responsibleParty: 'supplier' | 'buyer' | 'both';
}

interface TimelineVisualizationProps {
  supplierId: number;
  supplierName: string;
  milestones: Milestone[];
  startDate: Date;
  endDate: Date;
  onUpdateMilestone: (milestoneId: string, updates: Partial<Milestone>) => void;
}

export default function TimelineVisualization({ 
  supplierId, 
  supplierName, 
  milestones, 
  startDate, 
  endDate,
  onUpdateMilestone
}: TimelineVisualizationProps) {
  const [viewMode, setViewMode] = useState<'gantt' | 'list'>('gantt');
  const [priorityMode, setPriorityMode] = useState<'balanced' | 'speed' | 'cost'>('balanced');
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  
  // Sort milestones by start date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  // Calculate the total duration in days
  const totalDuration = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate the position and width for each milestone in the Gantt chart
  const calculatePosition = (milestone: Milestone) => {
    const start = new Date(milestone.startDate).getTime();
    const end = new Date(milestone.endDate).getTime();
    
    const startOffset = Math.ceil(
      (start - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const startPercent = (startOffset / totalDuration) * 100;
    const widthPercent = (duration / totalDuration) * 100;
    
    return {
      left: `${startPercent}%`,
      width: `${widthPercent}%`,
    };
  };
  
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'not_started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };
  
  const getStatusText = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'delayed': return 'Delayed';
      case 'not_started': return 'Not Started';
      default: return 'Unknown';
    }
  };
  
  const getResponsiblePartyText = (party: Milestone['responsibleParty']) => {
    switch (party) {
      case 'supplier': return 'Supplier';
      case 'buyer': return 'Your Team';
      case 'both': return 'Both Parties';
      default: return 'Unknown';
    }
  };
  
  const handleStatusChange = (milestoneId: string, status: Milestone['status']) => {
    onUpdateMilestone(milestoneId, { status });
  };
  
  const handlePriorityChange = (mode: 'balanced' | 'speed' | 'cost') => {
    setPriorityMode(mode);
    
    // In a real application, this would adjust the timeline based on the selected priority
    // For this demo, we'll just show the UI change
  };
  
  // Generate month labels for the Gantt chart
  const generateMonthLabels = () => {
    const labels = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const currentDate = new Date(start);
    currentDate.setDate(1); // Start at the beginning of the month
    
    while (currentDate <= end) {
      const month = currentDate.toLocaleString('default', { month: 'short' });
      const year = currentDate.getFullYear();
      
      const startOfMonth = new Date(currentDate);
      const daysFromStart = Math.ceil(
        (startOfMonth.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const positionPercent = (daysFromStart / totalDuration) * 100;
      
      labels.push({
        label: `${month} ${year}`,
        position: `${positionPercent}%`
      });
      
      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return labels;
  };
  
  const monthLabels = generateMonthLabels();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">Production Timeline with {supplierName}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            ({totalDuration} days)
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${viewMode === 'gantt' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('gantt')}
          >
            Gantt Chart
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Priority:</span>
          <div className="flex space-x-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${priorityMode === 'balanced' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handlePriorityChange('balanced')}
            >
              Balanced
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${priorityMode === 'speed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handlePriorityChange('speed')}
            >
              Speed
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${priorityMode === 'cost' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handlePriorityChange('cost')}
            >
              Cost
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
            <span>Delayed</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-1"></span>
            <span>Not Started</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 border-2 border-red-500 bg-white rounded-full mr-1"></span>
            <span>Critical Path</span>
          </div>
        </div>
      </div>
      
      {viewMode === 'gantt' ? (
        <div className="mt-6">
          <div className="relative mb-2">
            {monthLabels.map((label, index) => (
              <div 
                key={index} 
                className="absolute text-xs text-gray-500"
                style={{ left: label.position, transform: 'translateX(-50%)' }}
              >
                {label.label}
              </div>
            ))}
          </div>
          
          <div className="relative h-8 bg-gray-100 rounded mb-4">
            {monthLabels.map((label, index) => (
              <div 
                key={index} 
                className="absolute h-full border-l border-gray-300"
                style={{ left: label.position }}
              ></div>
            ))}
          </div>
          
          <div className="space-y-6">
            {sortedMilestones.map((milestone) => {
              const position = calculatePosition(milestone);
              
              return (
                <div key={milestone.id} className="relative">
                  <div className="flex items-center mb-1">
                    <h4 className="text-sm font-medium">{milestone.name}</h4>
                    {milestone.isCriticalPath && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Critical Path
                      </span>
                    )}
                  </div>
                  
                  <div className="relative h-8 bg-gray-100 rounded">
                    <div 
                      className={`absolute h-full rounded ${getStatusColor(milestone.status)} ${
                        milestone.isCriticalPath ? 'border-2 border-red-500' : ''
                      }`}
                      style={{ left: position.left, width: position.width }}
                      onClick={() => setExpandedMilestoneId(expandedMilestoneId === milestone.id ? null : milestone.id)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                        {milestone.name}
                      </div>
                    </div>
                  </div>
                  
                  {expandedMilestoneId === milestone.id && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      <p className="mb-2">{milestone.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Start Date:</span>{' '}
                          {new Date(milestone.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">End Date:</span>{' '}
                          {new Date(milestone.endDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>{' '}
                          <select
                            value={milestone.status}
                            onChange={(e) => handleStatusChange(milestone.id, e.target.value as Milestone['status'])}
                            className="ml-1 border rounded p-1 text-xs"
                          >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="delayed">Delayed</option>
                          </select>
                        </div>
                        <div>
                          <span className="font-medium">Responsible:</span>{' '}
                          {getResponsiblePartyText(milestone.responsibleParty)}
                        </div>
                      </div>
                      
                      {milestone.dependencies.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium">Dependencies:</span>{' '}
                          {milestone.dependencies.map(depId => {
                            const dep = milestones.find(m => m.id === depId);
                            return dep ? dep.name : 'Unknown';
                          }).join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMilestones.map((milestone) => (
            <div key={milestone.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">{milestone.name}</h4>
                    {milestone.isCriticalPath && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Critical Path
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusText(milestone.status)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>{' '}
                  {new Date(milestone.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium text-gray-700">End Date:</span>{' '}
                  {new Date(milestone.endDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>{' '}
                  {Math.ceil(
                    (new Date(milestone.endDate).getTime() - new Date(milestone.startDate).getTime()) / (1000 * 60 * 60 * 24)
                  )} days
                </div>
                <div>
                  <span className="font-medium text-gray-700">Responsible:</span>{' '}
                  {getResponsiblePartyText(milestone.responsibleParty)}
                </div>
              </div>
              
              {milestone.dependencies.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <span className="text-sm font-medium text-gray-700">Dependencies:</span>{' '}
                  <span className="text-sm">
                    {milestone.dependencies.map(depId => {
                      const dep = milestones.find(m => m.id === depId);
                      return dep ? dep.name : 'Unknown';
                    }).join(', ')}
                  </span>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t flex justify-end">
                <select
                  value={milestone.status}
                  onChange={(e) => handleStatusChange(milestone.id, e.target.value as Milestone['status'])}
                  className="border rounded p-1 text-sm"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 