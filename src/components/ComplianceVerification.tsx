import { useState, useEffect } from 'react';

// Define types for our component
interface Certification {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  category: 'quality' | 'environmental' | 'safety' | 'industry' | 'other';
}

interface SupplierCertification {
  certificationId: string;
  status: 'verified' | 'pending' | 'missing' | 'expired';
  expiryDate?: Date;
  documentId?: string;
  documentUrl?: string;
  notes?: string;
}

interface ComplianceVerificationProps {
  supplierId: number;
  supplierName: string;
  requiredCertifications: Certification[];
  supplierCertifications: SupplierCertification[];
  onUpdateCertification: (certificationId: string, status: SupplierCertification['status'], notes?: string) => void;
}

export default function ComplianceVerification({ 
  supplierId, 
  supplierName, 
  requiredCertifications, 
  supplierCertifications,
  onUpdateCertification
}: ComplianceVerificationProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'required' | 'verified' | 'issues'>('all');
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  
  // Add placeholder usage of supplierId
  useEffect(() => {
    // In the future, this will fetch certification data for the supplier
    console.log(`Fetching certification data for supplier ${supplierId}`);
  }, [supplierId]);
  
  // Create a map of certification status for easier access
  const certificationStatusMap = supplierCertifications.reduce((acc, cert) => {
    acc[cert.certificationId] = cert;
    return acc;
  }, {} as Record<string, SupplierCertification>);
  
  const filteredCertifications = requiredCertifications.filter(cert => {
    const status = certificationStatusMap[cert.id]?.status || 'missing';
    
    if (activeTab === 'all') return true;
    if (activeTab === 'required') return cert.isRequired;
    if (activeTab === 'verified') return status === 'verified';
    if (activeTab === 'issues') return status === 'missing' || status === 'expired';
    
    return true;
  });
  
  // Group certifications by category
  const certificationsByCategory = filteredCertifications.reduce((acc, cert) => {
    if (!acc[cert.category]) {
      acc[cert.category] = [];
    }
    acc[cert.category].push(cert);
    return acc;
  }, {} as Record<Certification['category'], Certification[]>);
  
  const handleEditNotes = (certId: string) => {
    const currentNotes = certificationStatusMap[certId]?.notes || '';
    setEditNotes(currentNotes);
    setEditingCertId(certId);
  };
  
  const handleSaveNotes = (certId: string) => {
    const currentStatus = certificationStatusMap[certId]?.status || 'missing';
    onUpdateCertification(certId, currentStatus, editNotes);
    setEditingCertId(null);
  };
  
  const handleUpdateStatus = (certId: string, status: SupplierCertification['status']) => {
    const currentNotes = certificationStatusMap[certId]?.notes || '';
    onUpdateCertification(certId, status, currentNotes);
  };
  
  const getCategoryLabel = (category: Certification['category']) => {
    switch (category) {
      case 'quality': return 'Quality Management';
      case 'environmental': return 'Environmental Compliance';
      case 'safety': return 'Safety Standards';
      case 'industry': return 'Industry-Specific';
      case 'other': return 'Other Certifications';
      default: return 'Certifications';
    }
  };
  
  const getStatusBadge = (status: SupplierCertification['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Pending Verification
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <svg className="mr-1.5 h-2 w-2 text-orange-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Expired
          </span>
        );
      case 'missing':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Missing
          </span>
        );
    }
  };
  
  // Calculate compliance stats
  const requiredCertCount = requiredCertifications.filter(cert => cert.isRequired).length;
  const verifiedRequiredCount = requiredCertifications
    .filter(cert => cert.isRequired && certificationStatusMap[cert.id]?.status === 'verified')
    .length;
  
  const compliancePercentage = requiredCertCount > 0 
    ? Math.round((verifiedRequiredCount / requiredCertCount) * 100) 
    : 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">Compliance Verification for {supplierName}</h3>
        <div className="text-sm">
          <div className="flex items-center">
            <div className="mr-2 w-24 bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  compliancePercentage >= 90 ? 'bg-green-600' : 
                  compliancePercentage >= 70 ? 'bg-yellow-500' : 
                  'bg-red-600'
                }`}
                style={{ width: `${compliancePercentage}%` }}
              ></div>
            </div>
            <span className={`font-medium ${
              compliancePercentage >= 90 ? 'text-green-600' : 
              compliancePercentage >= 70 ? 'text-yellow-500' : 
              'text-red-600'
            }`}>
              {compliancePercentage}% Compliant
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All ({requiredCertifications.length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'required' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('required')}
          >
            Required ({requiredCertCount})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'verified' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('verified')}
          >
            Verified ({supplierCertifications.filter(c => c.status === 'verified').length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'issues' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('issues')}
          >
            Issues ({supplierCertifications.filter(c => c.status === 'missing' || c.status === 'expired').length})
          </button>
        </div>
      </div>
      
      {Object.keys(certificationsByCategory).length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No certifications in this category.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(certificationsByCategory).map(([category, certifications]) => (
            <div key={category}>
              <h4 className="text-md font-medium text-gray-800 mb-3">
                {getCategoryLabel(category as Certification['category'])}
              </h4>
              
              <div className="space-y-3">
                {certifications.map((certification) => {
                  const certStatus = certificationStatusMap[certification.id] || { status: 'missing' };
                  
                  return (
                    <div key={certification.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <h5 className="text-sm font-medium text-gray-800">{certification.name}</h5>
                            {certification.isRequired && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{certification.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(certStatus.status)}
                        </div>
                      </div>
                      
                      {certStatus.expiryDate && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">Expiry Date:</span>{' '}
                          <span className={new Date(certStatus.expiryDate) < new Date() ? 'text-red-600' : ''}>
                            {new Date(certStatus.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {certStatus.documentUrl && (
                        <div className="mt-2">
                          <a 
                            href={certStatus.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            View Certificate Document
                          </a>
                        </div>
                      )}
                      
                      {editingCertId === certification.id ? (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                              rows={2}
                              placeholder="Add notes about this certification..."
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingCertId(null)}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(certification.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {certStatus.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <span className="block text-xs font-medium text-gray-700 mb-1">Notes</span>
                              <p className="text-sm text-gray-600">{certStatus.notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-3 pt-3 border-t flex justify-between">
                            <div>
                              <button
                                onClick={() => handleEditNotes(certification.id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                {certStatus.notes ? 'Edit Notes' : 'Add Notes'}
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              {certStatus.status !== 'verified' && (
                                <button
                                  onClick={() => handleUpdateStatus(certification.id, 'verified')}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                                >
                                  Mark Verified
                                </button>
                              )}
                              {certStatus.status !== 'pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(certification.id, 'pending')}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200"
                                >
                                  Mark Pending
                                </button>
                              )}
                              {certStatus.status !== 'missing' && (
                                <button
                                  onClick={() => handleUpdateStatus(certification.id, 'missing')}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                                >
                                  Mark Missing
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 