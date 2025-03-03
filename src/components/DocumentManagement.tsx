import { useState, useEffect } from 'react';

// Define types for our component
interface Document {
  id: string;
  name: string;
  type: 'quote' | 'certification' | 'dfm' | 'drawing' | 'specification' | 'other';
  size: number;
  uploadedBy: {
    id: string;
    name: string;
    role: 'buyer' | 'supplier';
  };
  uploadedAt: Date;
  version: number;
  url: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  comments?: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'buyer' | 'supplier';
  content: string;
  timestamp: Date;
}

interface DocumentManagementProps {
  supplierId: number;
  supplierName: string;
  documents: Document[];
  onUploadDocument: (file: File, type: Document['type']) => void;
  onUpdateDocumentStatus: (documentId: string, status: Document['status']) => void;
  onAddComment: (documentId: string, comment: string) => void;
}

export default function DocumentManagement({ 
  supplierId, 
  supplierName, 
  documents, 
  onUploadDocument,
  onUpdateDocumentStatus,
  onAddComment
}: DocumentManagementProps) {
  const [activeTab, setActiveTab] = useState<Document['type'] | 'all'>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadType, setUploadType] = useState<Document['type']>('other');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedDocumentId, setExpandedDocumentId] = useState<string | null>(null);
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [commentText, setCommentText] = useState<string>('');
  
  // Add placeholder usage of supplierId
  useEffect(() => {
    // In the future, this will fetch document data for the supplier
    console.log(`Fetching documents for supplier ${supplierId}`);
  }, [supplierId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onUploadDocument(selectedFile, uploadType);
      setSelectedFile(null);
      setShowUploadForm(false);
    }
  };
  
  const handleCommentChange = (documentId: string, comment: string) => {
    setNewComments({
      ...newComments,
      [documentId]: comment
    });
  };
  
  const handleAddComment = (documentId: string) => {
    const comment = newComments[documentId];
    if (comment && comment.trim()) {
      onAddComment(documentId, comment);
      setNewComments({
        ...newComments,
        [documentId]: ''
      });
    }
  };
  
  const filteredDocuments = documents.filter(doc => 
    activeTab === 'all' || doc.type === activeTab
  );
  
  // Group documents by type for the sidebar counts
  const documentCounts = documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {} as Record<Document['type'], number>);
  
  const getDocumentTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'quote': return 'Quotes';
      case 'certification': return 'Certifications';
      case 'dfm': return 'DFM Reports';
      case 'drawing': return 'Drawings';
      case 'specification': return 'Specifications';
      case 'other': return 'Other Documents';
      default: return 'Documents';
    }
  };
  
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'quote':
        return (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'certification':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'dfm':
        return (
          <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        );
      case 'drawing':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'specification':
        return (
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  const getStatusBadgeColor = (status: Document['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">Documents from {supplierName}</h3>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload Document
        </button>
      </div>
      
      {showUploadForm && (
        <div className="p-4 bg-gray-50 border-b">
          <h4 className="text-sm font-medium mb-2">Upload New Document</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as Document['type'])}
                className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="quote">Quote</option>
                <option value="certification">Certification</option>
                <option value="dfm">DFM Report</option>
                <option value="drawing">Drawing</option>
                <option value="specification">Specification</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setShowUploadForm(false)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedFile
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 border-r">
          <div className="p-4">
            <button
              className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                All Documents
              </span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {documents.length}
              </span>
            </button>
            
            {(['quote', 'certification', 'dfm', 'drawing', 'specification', 'other'] as Document['type'][]).map((type) => (
              <button
                key={type}
                className={`flex items-center justify-between w-full px-3 py-2 mt-1 text-sm font-medium rounded-md ${
                  activeTab === type ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(type)}
              >
                <span className="flex items-center">
                  {getDocumentIcon(type)}
                  <span className="ml-2">{getDocumentTypeLabel(type)}</span>
                </span>
                {documentCounts[type] > 0 && (
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {documentCounts[type]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No documents in this category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedDocumentId(expandedDocumentId === document.id ? null : document.id)}
                  >
                    <div className="flex items-center">
                      {getDocumentIcon(document.type)}
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>
                            {document.uploadedBy.role === 'supplier' ? 'Uploaded by supplier' : 'Uploaded by you'} • 
                            {' '}{new Date(document.uploadedAt).toLocaleDateString()} • 
                            {' '}{(document.size / 1024).toFixed(1)} KB
                          </span>
                          {document.version > 1 && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                              v{document.version}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(document.status)}`}>
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </span>
                      <svg 
                        className={`ml-2 h-5 w-5 text-gray-400 transform transition-transform ${expandedDocumentId === document.id ? 'rotate-180' : ''}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {expandedDocumentId === document.id && (
                    <div className="border-t p-4">
                      <div className="flex justify-between mb-4">
                        <div className="flex space-x-2">
                          <a 
                            href={document.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            View
                          </a>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Annotate
                          </button>
                        </div>
                        
                        <div className="flex space-x-2">
                          {document.status !== 'approved' && (
                            <button 
                              onClick={() => onUpdateDocumentStatus(document.id, 'approved')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                            >
                              Approve
                            </button>
                          )}
                          {document.status !== 'rejected' && (
                            <button 
                              onClick={() => onUpdateDocumentStatus(document.id, 'rejected')}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {document.comments && document.comments.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Comments</h5>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {document.comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-medium">{comment.userName}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Add Comment</h5>
                        <div className="flex">
                          <textarea
                            value={newComments[document.id] || ''}
                            onChange={(e) => handleCommentChange(document.id, e.target.value)}
                            className="flex-grow border rounded-l-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                            placeholder="Add a comment about this document..."
                          />
                          <button
                            onClick={() => handleAddComment(document.id)}
                            disabled={!newComments[document.id]?.trim()}
                            className={`px-4 rounded-r-md ${
                              newComments[document.id]?.trim()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 