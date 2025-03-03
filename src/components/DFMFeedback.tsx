import { useState } from 'react';

// Define types for our component
interface DFMSuggestion {
  id: string;
  supplierId: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
  area: string;
  imageUrl?: string;
  annotations?: Annotation[];
  status: 'pending' | 'accepted' | 'rejected';
  responseComment?: string;
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
}

interface DFMFeedbackProps {
  supplierId: number;
  supplierName: string;
  suggestions: DFMSuggestion[];
  onUpdateSuggestion: (suggestionId: string, status: 'accepted' | 'rejected', comment?: string) => void;
}

export default function DFMFeedback({ supplierId, supplierName, suggestions, onUpdateSuggestion }: DFMFeedbackProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');
  const [responseComments, setResponseComments] = useState<Record<string, string>>({});
  
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return suggestion.status === 'pending';
    if (activeTab === 'resolved') return suggestion.status === 'accepted' || suggestion.status === 'rejected';
    return true;
  });
  
  const handleCommentChange = (suggestionId: string, comment: string) => {
    setResponseComments({
      ...responseComments,
      [suggestionId]: comment
    });
  };
  
  const handleUpdateStatus = (suggestionId: string, status: 'accepted' | 'rejected') => {
    onUpdateSuggestion(suggestionId, status, responseComments[suggestionId]);
    // Clear the comment after submission
    setResponseComments({
      ...responseComments,
      [suggestionId]: ''
    });
  };
  
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: 'pending' | 'accepted' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">DFM Feedback from {supplierName}</h3>
        <div className="text-sm text-gray-500">
          {suggestions.filter(s => s.status === 'pending').length > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {suggestions.filter(s => s.status === 'pending').length} pending
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All ({suggestions.length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({suggestions.filter(s => s.status === 'pending').length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'resolved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({suggestions.filter(s => s.status === 'accepted' || s.status === 'rejected').length})
          </button>
        </div>
      </div>
      
      {filteredSuggestions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No DFM suggestions in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                  </span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                    {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">Area: {suggestion.area}</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
              
              {suggestion.imageUrl && (
                <div className="mb-3 relative">
                  <img 
                    src={suggestion.imageUrl} 
                    alt="DFM suggestion visualization" 
                    className="border rounded-md max-h-64 object-contain"
                  />
                  
                  {suggestion.annotations && suggestion.annotations.map((annotation) => (
                    <div 
                      key={annotation.id}
                      className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
                      title={annotation.text}
                    >
                      <span>!</span>
                    </div>
                  ))}
                </div>
              )}
              
              {suggestion.status === 'pending' ? (
                <div className="mt-3 border-t pt-3">
                  <div className="mb-2">
                    <label htmlFor={`comment-${suggestion.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Your Response
                    </label>
                    <textarea
                      id={`comment-${suggestion.id}`}
                      value={responseComments[suggestion.id] || ''}
                      onChange={(e) => handleCommentChange(suggestion.id, e.target.value)}
                      className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Add your comments here..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(suggestion.id, 'accepted')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                    >
                      Accept Suggestion
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(suggestion.id, 'rejected')}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                    >
                      Reject Suggestion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 border-t pt-3">
                  <div className="text-sm">
                    <span className="font-medium">Response:</span> {suggestion.responseComment || 'No comment provided'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 