'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock supplier data
const mockSuppliers = [
  {
    id: 1,
    name: 'Precision Manufacturing Inc.',
    location: 'Chicago, IL',
    rating: 4.8,
    certifications: ['ISO 9001', 'AS9100'],
    capabilities: ['CNC Machining', 'Sheet Metal', 'Injection Molding'],
    materials: ['Stainless Steel', 'Aluminum', 'Titanium'],
    pastPerformance: {
      onTimeDelivery: 98,
      qualityScore: 4.9,
      responseTime: 'Within 24 hours'
    }
  },
  {
    id: 2,
    name: 'Global Parts Solutions',
    location: 'Shenzhen, China',
    rating: 4.5,
    certifications: ['ISO 9001', 'ISO 14001'],
    capabilities: ['CNC Machining', 'Die Casting', '3D Printing'],
    materials: ['Aluminum', 'Steel', 'Plastics'],
    pastPerformance: {
      onTimeDelivery: 92,
      qualityScore: 4.6,
      responseTime: 'Within 48 hours'
    }
  },
  {
    id: 3,
    name: 'Advanced Metal Works',
    location: 'Detroit, MI',
    rating: 4.7,
    certifications: ['ISO 9001', 'IATF 16949'],
    capabilities: ['CNC Machining', 'Metal Stamping', 'Welding'],
    materials: ['Steel', 'Stainless Steel', 'Aluminum'],
    pastPerformance: {
      onTimeDelivery: 95,
      qualityScore: 4.8,
      responseTime: 'Within 24 hours'
    }
  },
  {
    id: 4,
    name: 'Tech Precision Engineering',
    location: 'Bangalore, India',
    rating: 4.3,
    certifications: ['ISO 9001'],
    capabilities: ['CNC Machining', 'Sheet Metal', 'Laser Cutting'],
    materials: ['Aluminum', 'Steel', 'Copper'],
    pastPerformance: {
      onTimeDelivery: 90,
      qualityScore: 4.4,
      responseTime: 'Within 36 hours'
    }
  },
  {
    id: 5,
    name: 'European Precision Components',
    location: 'Munich, Germany',
    rating: 4.9,
    certifications: ['ISO 9001', 'ISO 13485', 'AS9100'],
    capabilities: ['CNC Machining', 'Precision Grinding', 'EDM'],
    materials: ['Stainless Steel', 'Titanium', 'Inconel'],
    pastPerformance: {
      onTimeDelivery: 99,
      qualityScore: 4.9,
      responseTime: 'Within 12 hours'
    }
  }
];

export default function SupplierSelection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  
  // Get all unique capabilities, materials, and certifications for filters
  const allCapabilities = Array.from(new Set(mockSuppliers.flatMap(s => s.capabilities)));
  const allMaterials = Array.from(new Set(mockSuppliers.flatMap(s => s.materials)));
  const allCertifications = Array.from(new Set(mockSuppliers.flatMap(s => s.certifications)));
  
  // Filter suppliers based on search and filters
  const filteredSuppliers = mockSuppliers.filter(supplier => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Capability filter
    const matchesCapabilities = selectedCapabilities.length === 0 || 
      selectedCapabilities.every(cap => supplier.capabilities.includes(cap));
    
    // Material filter
    const matchesMaterials = selectedMaterials.length === 0 || 
      selectedMaterials.every(mat => supplier.materials.includes(mat));
    
    // Certification filter
    const matchesCertifications = selectedCertifications.length === 0 || 
      selectedCertifications.every(cert => supplier.certifications.includes(cert));
    
    return matchesSearch && matchesCapabilities && matchesMaterials && matchesCertifications;
  });
  
  const toggleCapability = (capability: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability) 
        : [...prev, capability]
    );
  };
  
  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material) 
        : [...prev, material]
    );
  };
  
  const toggleCertification = (certification: string) => {
    setSelectedCertifications(prev => 
      prev.includes(certification) 
        ? prev.filter(c => c !== certification) 
        : [...prev, certification]
    );
  };
  
  const toggleSupplierSelection = (supplierId: number) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId) 
        : [...prev, supplierId]
    );
  };
  
  const handleContinue = () => {
    if (selectedSuppliers.length === 0) {
      alert('Please select at least one supplier');
      return;
    }
    
    // In a real app, you would save the selected suppliers and proceed
    console.log('Selected suppliers:', selectedSuppliers);
    // Navigate to review page
    router.push('/production/review');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Supplier Selection - Quote #12345</h1>
          <Link href="/production/setup?quoteId=12345" className="text-blue-600 hover:text-blue-800">
            Back to Setup
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
              <div className="rounded-full h-12 w-12 bg-blue-600 flex items-center justify-center text-white">2</div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-blue-600">Supplier Selection</div>
            </div>
            <div className="flex-auto border-t-2 border-gray-300"></div>
            <div className="flex items-center relative">
              <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center text-gray-600">3</div>
              <div className="absolute top-0 -ml-4 text-center mt-14 w-32 text-xs font-medium text-gray-600">Review & Send</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="font-semibold text-lg mb-4">Search Suppliers</h2>
              <input
                type="text"
                placeholder="Search by name or location"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Capabilities</h3>
                <div className="space-y-2">
                  {allCapabilities.map((capability, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`capability-${index}`}
                        checked={selectedCapabilities.includes(capability)}
                        onChange={() => toggleCapability(capability)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`capability-${index}`} className="ml-2 text-sm text-gray-700">
                        {capability}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Materials</h3>
                <div className="space-y-2">
                  {allMaterials.map((material, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`material-${index}`}
                        checked={selectedMaterials.includes(material)}
                        onChange={() => toggleMaterial(material)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`material-${index}`} className="ml-2 text-sm text-gray-700">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Certifications</h3>
                <div className="space-y-2">
                  {allCertifications.map((certification, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`certification-${index}`}
                        checked={selectedCertifications.includes(certification)}
                        onChange={() => toggleCertification(certification)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`certification-${index}`} className="ml-2 text-sm text-gray-700">
                        {certification}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Supplier Recommendations</h3>
              <p className="text-sm text-blue-700 mb-2">
                Based on your requirements, we recommend these suppliers:
              </p>
              <ul className="text-sm text-blue-800 list-disc pl-5">
                <li>Precision Manufacturing Inc.</li>
                <li>European Precision Components</li>
              </ul>
            </div>
          </div>
          
          {/* Supplier list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Available Suppliers ({filteredSuppliers.length})</h2>
                <span className="text-sm text-gray-500">
                  {selectedSuppliers.length} selected
                </span>
              </div>
              
              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No suppliers match your current filters
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSuppliers.map((supplier) => (
                    <div 
                      key={supplier.id} 
                      className={`border rounded-lg p-4 transition-colors ${
                        selectedSuppliers.includes(supplier.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{supplier.name}</h3>
                          <p className="text-gray-600 text-sm">{supplier.location}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-gray-700">{supplier.rating}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedSuppliers.includes(supplier.id)}
                            onChange={() => toggleSupplierSelection(supplier.id)}
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase">Certifications</h4>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {supplier.certifications.map((cert, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase">Capabilities</h4>
                          <p className="mt-1 text-sm text-gray-700">
                            {supplier.capabilities.join(', ')}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase">Materials</h4>
                          <p className="mt-1 text-sm text-gray-700">
                            {supplier.materials.join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Past Performance</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="block text-gray-500">On-Time Delivery</span>
                            <span className="font-medium text-gray-800">{supplier.pastPerformance.onTimeDelivery}%</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Quality Score</span>
                            <span className="font-medium text-gray-800">{supplier.pastPerformance.qualityScore}/5.0</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Response Time</span>
                            <span className="font-medium text-gray-800">{supplier.pastPerformance.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link href="/production/setup?quoteId=12345" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Back
              </Link>
              <button
                onClick={handleContinue}
                className={`px-4 py-2 rounded-md ${
                  selectedSuppliers.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedSuppliers.length === 0}
              >
                Continue to Review & Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 