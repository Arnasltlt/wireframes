'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data for the quote
const mockQuoteData = {
  id: '12345',
  customer: 'Acme Corporation',
  product: 'Custom Metal Bracket',
  quantity: 500,
  total: 4250.00,
  material: 'Stainless Steel 304',
  dimensions: '120mm x 80mm x 15mm',
  finish: 'Brushed',
  tolerances: '±0.1mm',
};

export default function ProductionSetup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quoteId = searchParams.get('quoteId');
  
  const [formData, setFormData] = useState({
    material: mockQuoteData.material,
    dimensions: mockQuoteData.dimensions,
    finish: mockQuoteData.finish,
    tolerances: mockQuoteData.tolerances,
    criticalFeatures: '',
    specialInstructions: '',
    technicalDrawings: [] as File[],
  });
  
  const [activeTab, setActiveTab] = useState('technical');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        technicalDrawings: [...prev.technicalDrawings, ...Array.from(e.target.files as FileList)]
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this data and proceed to the next step
    console.log('Form submitted:', formData);
    // Navigate to supplier selection
    router.push('/production/suppliers');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Production Setup - Quote #{quoteId}</h1>
          <Link href="/quote" className="text-blue-600 hover:text-blue-800">
            Back to Quote
          </Link>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-blue-600 flex items-center justify-center text-white">1</div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-blue-600">Technical Data</div>
            </div>
            <div className="flex-auto border-t-2 border-blue-200"></div>
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center text-gray-600">2</div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-gray-600">Supplier Selection</div>
            </div>
            <div className="flex-auto border-t-2 border-gray-300"></div>
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center text-gray-600">3</div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-gray-600">Review & Send</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button 
                className={`inline-block p-4 ${activeTab === 'technical' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('technical')}
              >
                Technical Requirements
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 ${activeTab === 'quality' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('quality')}
              >
                Critical to Quality
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 ${activeTab === 'documents' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
            </li>
          </ul>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Technical Requirements Tab */}
          {activeTab === 'technical' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Technical Requirements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surface Finish</label>
                  <select
                    name="finish"
                    value={formData.finish}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Brushed">Brushed</option>
                    <option value="Polished">Polished</option>
                    <option value="Painted">Painted</option>
                    <option value="Anodized">Anodized</option>
                    <option value="Raw">Raw</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tolerances</label>
                  <input
                    type="text"
                    name="tolerances"
                    value={formData.tolerances}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add any special instructions or notes for the supplier..."
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Critical to Quality Tab */}
          {activeTab === 'quality' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Critical to Quality Features</h2>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Highlight the features that are critical to the quality and functionality of this part.
                  These will be specifically emphasized to the supplier.
                </p>
                
                <textarea
                  name="criticalFeatures"
                  value={formData.criticalFeatures}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Example: The 10mm hole must maintain a tolerance of ±0.01mm as it interfaces with a precision shaft."
                ></textarea>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Critical features will be highlighted to suppliers and may require additional verification during production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Technical Drawings & Documents</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Technical Drawings</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload files</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      CAD files, PDFs, or images up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {formData.technicalDrawings.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
                  <ul className="border rounded-md divide-y">
                    {formData.technicalDrawings.map((file, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">
                            {file.name}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="font-medium text-gray-500">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <Link href="/quote" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save & Continue to Supplier Selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 