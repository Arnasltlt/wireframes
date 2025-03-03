import { useState } from 'react';

// Define types for our component
interface Requirement {
  id: string;
  name: string;
  description: string;
  value: string;
  isCritical: boolean;
  supplierConfirmation?: {
    isConfirmed: boolean;
    alternativeValue?: string;
    notes?: string;
  };
}

interface RequirementConfirmationProps {
  supplierId: number;
  supplierName: string;
  requirements: Requirement[];
  readOnly?: boolean;
  onUpdateRequirement?: (requirementId: string, confirmation: { isConfirmed: boolean; alternativeValue?: string; notes?: string }) => void;
}

export default function RequirementConfirmation({ 
  supplierId, 
  supplierName, 
  requirements, 
  readOnly = false,
  onUpdateRequirement 
}: RequirementConfirmationProps) {
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);
  const [confirmationValues, setConfirmationValues] = useState<Record<string, { isConfirmed: boolean; alternativeValue: string; notes: string }>>({});
  
  // Initialize confirmation values from requirements
  useState(() => {
    const initialValues: Record<string, { isConfirmed: boolean; alternativeValue: string; notes: string }> = {};
    requirements.forEach(req => {
      initialValues[req.id] = {
        isConfirmed: req.supplierConfirmation?.isConfirmed || false,
        alternativeValue: req.supplierConfirmation?.alternativeValue || '',
        notes: req.supplierConfirmation?.notes || ''
      };
    });
    setConfirmationValues(initialValues);
  });
  
  const handleToggleConfirmation = (requirementId: string, isConfirmed: boolean) => {
    const updatedValues = {
      ...confirmationValues[requirementId],
      isConfirmed
    };
    
    setConfirmationValues({
      ...confirmationValues,
      [requirementId]: updatedValues
    });
    
    if (onUpdateRequirement) {
      onUpdateRequirement(requirementId, updatedValues);
    }
  };
  
  const handleUpdateAlternative = (requirementId: string, alternativeValue: string) => {
    setConfirmationValues({
      ...confirmationValues,
      [requirementId]: {
        ...confirmationValues[requirementId],
        alternativeValue
      }
    });
  };
  
  const handleUpdateNotes = (requirementId: string, notes: string) => {
    setConfirmationValues({
      ...confirmationValues,
      [requirementId]: {
        ...confirmationValues[requirementId],
        notes
      }
    });
  };
  
  const handleSaveRequirement = (requirementId: string) => {
    if (onUpdateRequirement) {
      onUpdateRequirement(requirementId, confirmationValues[requirementId]);
    }
    setEditingRequirement(null);
  };
  
  // Calculate confirmation stats
  const confirmedCount = requirements.filter(req => 
    req.supplierConfirmation?.isConfirmed || confirmationValues[req.id]?.isConfirmed
  ).length;
  
  const criticalRequirements = requirements.filter(req => req.isCritical);
  const criticalConfirmedCount = criticalRequirements.filter(req => 
    req.supplierConfirmation?.isConfirmed || confirmationValues[req.id]?.isConfirmed
  ).length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">Requirement Confirmation by {supplierName}</h3>
        <div className="text-sm">
          <span className={`font-medium ${confirmedCount === requirements.length ? 'text-green-600' : 'text-amber-600'}`}>
            {confirmedCount}/{requirements.length} confirmed
          </span>
          {criticalRequirements.length > 0 && (
            <span className={`ml-2 font-medium ${criticalConfirmedCount === criticalRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
              ({criticalConfirmedCount}/{criticalRequirements.length} critical)
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {requirements.map((requirement) => {
          const isEditing = editingRequirement === requirement.id;
          const confirmation = requirement.supplierConfirmation || confirmationValues[requirement.id] || { isConfirmed: false };
          
          return (
            <div key={requirement.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-800">{requirement.name}</h4>
                  {requirement.isCritical && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Critical
                    </span>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Confirmed</span>
                    <button
                      onClick={() => handleToggleConfirmation(requirement.id, !confirmation.isConfirmed)}
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        confirmation.isConfirmed ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          confirmation.isConfirmed ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600">{requirement.description}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">Required Value</span>
                </div>
                <p className="text-sm font-medium">{requirement.value}</p>
              </div>
              
              {!readOnly && (isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Alternative Value (if cannot meet requirement)
                    </label>
                    <input
                      type="text"
                      value={confirmationValues[requirement.id]?.alternativeValue || ''}
                      onChange={(e) => handleUpdateAlternative(requirement.id, e.target.value)}
                      className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Propose an alternative value..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={confirmationValues[requirement.id]?.notes || ''}
                      onChange={(e) => handleUpdateNotes(requirement.id, e.target.value)}
                      className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Add any clarifications or notes..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingRequirement(null)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveRequirement(requirement.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {(confirmation.alternativeValue || confirmation.notes) && (
                    <div className="border-t pt-3 mt-3">
                      {confirmation.alternativeValue && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500 block mb-1">Alternative Value</span>
                          <p className="text-sm">{confirmation.alternativeValue}</p>
                        </div>
                      )}
                      
                      {confirmation.notes && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 block mb-1">Notes</span>
                          <p className="text-sm">{confirmation.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!readOnly && (
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => setEditingRequirement(requirement.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {confirmation.alternativeValue || confirmation.notes ? 'Edit Response' : 'Add Response'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
} 