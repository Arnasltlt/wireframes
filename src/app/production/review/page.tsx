'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Add these imports:
import QAThread from '@/components/QAThread';
import DFMFeedback from '@/components/DFMFeedback';
import OfferVariations from '@/components/OfferVariations';
import RequirementConfirmation from '@/components/RequirementConfirmation';
import DocumentManagement from '@/components/DocumentManagement';
import ComplianceVerification from '@/components/ComplianceVerification';
import TimelineVisualization from '@/components/TimelineVisualization';
import DecisionSupport from '@/components/DecisionSupport';

// Mock data for supplier offers
const mockSupplierOffers = [
  {
    id: 1,
    supplierId: 1,
    supplierName: 'Precision Manufacturing Inc.',
    location: 'Chicago, IL',
    price: 4250.00,
    unitPrice: 8.50,
    leadTime: '3 weeks',
    moq: 500,
    notes: 'Can expedite to 2 weeks for additional 10% fee.',
    certifications: ['ISO 9001', 'AS9100'],
    rating: 4.8,
    onTimeDelivery: 98,
    qualityScore: 4.9,
    responseTime: 'Within 24 hours',
    documents: [
      { name: 'Quote_12345_Precision.pdf', size: 245 },
      { name: 'Material_Cert_SS304.pdf', size: 128 }
    ]
  },
  {
    id: 2,
    supplierId: 3,
    supplierName: 'Advanced Metal Works',
    location: 'Detroit, MI',
    price: 4100.00,
    unitPrice: 8.20,
    leadTime: '4 weeks',
    moq: 500,
    notes: 'Price includes standard packaging. Custom packaging available at additional cost.',
    certifications: ['ISO 9001', 'IATF 16949'],
    rating: 4.7,
    onTimeDelivery: 95,
    qualityScore: 4.8,
    responseTime: 'Within 24 hours',
    documents: [
      { name: 'Quote_12345_AMW.pdf', size: 210 },
      { name: 'DFM_Analysis.pdf', size: 350 }
    ]
  },
  {
    id: 3,
    supplierId: 5,
    supplierName: 'European Precision Components',
    location: 'Munich, Germany',
    price: 4800.00,
    unitPrice: 9.60,
    leadTime: '2 weeks',
    moq: 400,
    notes: 'Premium finish option available. All parts undergo 100% inspection.',
    certifications: ['ISO 9001', 'ISO 13485', 'AS9100'],
    rating: 4.9,
    onTimeDelivery: 99,
    qualityScore: 4.9,
    responseTime: 'Within 12 hours',
    documents: [
      { name: 'Quote_12345_EPC.pdf', size: 275 },
      { name: 'Quality_Plan.pdf', size: 420 }
    ]
  }
];

export default function ReviewAndSend() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  
  // Define sortable fields type
  type SortableField = 'supplierName' | 'price' | 'unitPrice' | 'leadTime' | 'rating';
  const [sortBy, setSortBy] = useState<SortableField>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // NEW: Tracks which enhancement tab is open
  const [activeTab, setActiveTab] = useState<
    'qa' | 'dfm' | 'variation' | 'requirement' | 'document' | 'compliance' | 'timeline' | 'decision'
  >('qa');
  
  // Sort offers based on current sort settings
  const sortedOffers = [...mockSupplierOffers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle special cases
    if (sortBy === 'leadTime') {
      // Convert "X weeks" to number of weeks
      aValue = parseInt(a.leadTime.split(' ')[0]);
      bValue = parseInt(b.leadTime.split(' ')[0]);
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });
  
  const handleSort = (field: SortableField) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const handleSelectOffer = (offerId: number) => {
    setSelectedOffer(offerId);
  };
  
  const handleFinalize = () => {
    if (!selectedOffer) {
      alert('Please select a supplier offer');
      return;
    }
    
    // In a real app, you would save the selected offer and create a production order
    console.log('Selected offer:', selectedOffer);
    alert('Production order created successfully!');
    router.push('/quote');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Review & Send - Quote #12345</h1>
          <Link href="/production/suppliers" className="text-blue-600 hover:text-blue-800">
            Back to Supplier Selection
          </Link>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-green-600 flex items-center justify-center text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-green-600">Technical Data</div>
            </div>
            <div className="flex-auto border-t-2 border-green-200"></div>
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-green-600 flex items-center justify-center text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-green-600">Supplier Selection</div>
            </div>
            <div className="flex-auto border-t-2 border-green-200"></div>
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-blue-600 flex items-center justify-center text-white">3</div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-blue-600">Review & Send</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Compare Supplier Offers</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('supplierName')}
                  >
                    <div className="flex items-center">
                      Supplier
                      {sortBy === 'supplierName' && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortBy === 'price' && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('unitPrice')}
                  >
                    <div className="flex items-center">
                      Unit Price
                      {sortBy === 'unitPrice' && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('leadTime')}
                  >
                    <div className="flex items-center">
                      Lead Time
                      {sortBy === 'leadTime' && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortBy === 'rating' && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOffers.map((offer) => (
                  <tr 
                    key={offer.id} 
                    className={selectedOffer === offer.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="radio"
                        name="selectedOffer"
                        checked={selectedOffer === offer.id}
                        onChange={() => handleSelectOffer(offer.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{offer.supplierName}</div>
                      <div className="text-sm text-gray-500">{offer.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${offer.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Total for 500 units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${offer.unitPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Per unit</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.leadTime}</div>
                      <div className="text-sm text-gray-500">MOQ: {offer.moq} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-900">{offer.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">On-time: {offer.onTimeDelivery}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {offer.documents.map((doc, index) => (
                        <div key={index} className="flex items-center text-blue-600 hover:text-blue-800">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span>{doc.name}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {selectedOffer && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Selected Supplier Details</h2>
            
            {(() => {
              const offer = mockSupplierOffers.find(o => o.id === selectedOffer);
              if (!offer) return null;
              
              return (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{offer.supplierName}</h3>
                      <p className="text-gray-600 mb-4">{offer.location}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          {offer.certifications.map((cert, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Performance Metrics</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="block text-gray-500">On-Time Delivery</span>
                            <span className="font-medium text-gray-800">{offer.onTimeDelivery}%</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Quality Score</span>
                            <span className="font-medium text-gray-800">{offer.qualityScore}/5.0</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Response Time</span>
                            <span className="font-medium text-gray-800">{offer.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Offer Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Price:</span>
                            <span className="font-medium">${offer.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Unit Price:</span>
                            <span className="font-medium">${offer.unitPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lead Time:</span>
                            <span className="font-medium">{offer.leadTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Order:</span>
                            <span className="font-medium">{offer.moq} units</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Supplier Notes</h4>
                        <p className="text-gray-600 text-sm p-3 border border-gray-200 rounded-md">
                          {offer.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* BEGIN: New tabs + components */}
            <div className="mt-8 border-t pt-4">
              {/* Tab buttons */}
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'qa' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Q&A
                </button>
                <button
                  onClick={() => setActiveTab('dfm')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'dfm' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  DFM
                </button>
                <button
                  onClick={() => setActiveTab('variation')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'variation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Variations
                </button>
                <button
                  onClick={() => setActiveTab('requirement')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'requirement' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Requirements
                </button>
                <button
                  onClick={() => setActiveTab('document')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'document' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'compliance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Compliance
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('decision')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'decision' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Decision Support
                </button>
              </div>

              {/* Conditionally render each enhancement component */}
              {activeTab === 'qa' && (
                <QAThread
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  messages={[]} // supply real messages data
                  onSendMessage={(supplierId, content, attachments) => {
                    // handle message send
                    console.log('Send QA message to:', supplierId, content, attachments);
                  }}
                />
              )}
              {activeTab === 'dfm' && (
                <DFMFeedback
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  suggestions={[]} // supply real suggestions data
                  onUpdateSuggestion={(suggestionId, status, comment) => {
                    // handle suggestion update
                    console.log('Update DFM suggestion:', suggestionId, status, comment);
                  }}
                />
              )}
              {activeTab === 'variation' && (
                <OfferVariations
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  variations={[]} // supply real variation data
                  onSelectVariation={(variationId) => {
                    console.log('Selected variation:', variationId);
                  }}
                />
              )}
              {activeTab === 'requirement' && (
                <RequirementConfirmation
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  requirements={[]} // supply real requirement data
                  onUpdateRequirement={(requirementId, confirmation) => {
                    console.log('Update requirement:', requirementId, confirmation);
                  }}
                />
              )}
              {activeTab === 'document' && (
                <DocumentManagement
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  documents={[]} // supply real documents data
                  onUploadDocument={(file, type) => {
                    console.log('Upload document:', file, type);
                  }}
                  onUpdateDocumentStatus={(documentId, status) => {
                    console.log('Document status update:', documentId, status);
                  }}
                  onAddComment={(documentId, comment) => {
                    console.log('Add comment to doc:', documentId, comment);
                  }}
                />
              )}
              {activeTab === 'compliance' && (
                <ComplianceVerification
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  requiredCertifications={[]} // supply real cert list
                  supplierCertifications={[]} // supply real certification statuses
                  onUpdateCertification={(certificationId, status, notes) => {
                    console.log('Certification updated:', certificationId, status, notes);
                  }}
                />
              )}
              {activeTab === 'timeline' && (
                <TimelineVisualization
                  supplierId={selectedOffer}
                  supplierName="(placeholder) Supplier Name"
                  milestones={[]} // supply real milestone data
                  startDate={new Date()}
                  endDate={new Date()}
                  onUpdateMilestone={(milestoneId, updates) => {
                    console.log('Milestone updated:', milestoneId, updates);
                  }}
                />
              )}
              {activeTab === 'decision' && (
                <DecisionSupport
                  criteria={[]} // supply real criteria
                  supplierScores={[]} // supply real supplier scores
                  teamVotes={[]} // supply real team votes
                  onUpdateCriterionWeight={(criterionId, weight) => {
                    console.log('Criterion weight updated:', criterionId, weight);
                  }}
                  onUpdateSupplierScore={(supplierId, criterionId, score) => {
                    console.log('Supplier score updated:', supplierId, criterionId, score);
                  }}
                  onAddVote={(preferredSupplierId, comment) => {
                    console.log('New vote:', preferredSupplierId, comment);
                  }}
                />
              )}
            </div>
            {/* END: New tabs + components */}
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Link href="/production/suppliers" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Back
          </Link>
          <button
            onClick={handleFinalize}
            className={`px-4 py-2 rounded-md ${
              selectedOffer
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!selectedOffer}
          >
            Finalize Production Order
          </button>
        </div>
      </div>
    </div>
  );
} 