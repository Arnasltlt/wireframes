import { useState } from 'react';

// Define types for our component
interface OfferVariation {
  id: string;
  supplierId: number;
  name: string;
  description: string;
  price: number;
  unitPrice: number;
  leadTime: string;
  moq: number;
  material?: string;
  process?: string;
  benefits: string[];
  isDefault: boolean;
}

interface OfferVariationsProps {
  supplierId: number;
  supplierName: string;
  variations: OfferVariation[];
  onSelectVariation: (variationId: string) => void;
  selectedVariationId?: string;
}

export default function OfferVariations({ supplierId, supplierName, variations, onSelectVariation, selectedVariationId }: OfferVariationsProps) {
  const [activeTab, setActiveTab] = useState<string>(variations.find(v => v.isDefault)?.id || (variations[0]?.id || ''));
  
  // If a selected variation is passed in, use that as the active tab
  useState(() => {
    if (selectedVariationId) {
      setActiveTab(selectedVariationId);
    }
  });
  
  const handleTabChange = (variationId: string) => {
    setActiveTab(variationId);
    onSelectVariation(variationId);
  };
  
  if (variations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-center text-gray-500 py-8">
          <p>No offer variations available from this supplier.</p>
        </div>
      </div>
    );
  }
  
  const activeVariation = variations.find(v => v.id === activeTab) || variations[0];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">Offer Variations from {supplierName}</h3>
        {variations.length > 1 && (
          <span className="text-sm text-gray-500">{variations.length} variations available</span>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex border-b overflow-x-auto">
          {variations.map((variation) => (
            <button
              key={variation.id}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === variation.id 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(variation.id)}
            >
              {variation.name}
              {variation.isDefault && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Default</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Variation Details</h4>
            <p className="text-sm text-gray-600 mb-4">{activeVariation.description}</p>
            
            {activeVariation.benefits.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Benefits</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {activeVariation.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {(activeVariation.material || activeVariation.process) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {activeVariation.material && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Material</h5>
                    <p className="text-sm text-gray-600">{activeVariation.material}</p>
                  </div>
                )}
                {activeVariation.process && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Process</h5>
                    <p className="text-sm text-gray-600">{activeVariation.process}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Pricing & Delivery</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-medium">${activeVariation.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit Price:</span>
                <span className="font-medium">${activeVariation.unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lead Time:</span>
                <span className="font-medium">{activeVariation.leadTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Order:</span>
                <span className="font-medium">{activeVariation.moq} units</span>
              </div>
            </div>
            
            {variations.length > 1 && (
              <div className="mt-4 pt-4 border-t">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Comparison with Default</h5>
                {(() => {
                  const defaultVariation = variations.find(v => v.isDefault);
                  if (!defaultVariation || activeVariation.id === defaultVariation.id) {
                    return <p className="text-sm text-gray-600">This is the default offer.</p>;
                  }
                  
                  const priceDiff = activeVariation.price - defaultVariation.price;
                  const leadTimeParts = activeVariation.leadTime.split(' ');
                  const defaultLeadTimeParts = defaultVariation.leadTime.split(' ');
                  
                  let leadTimeDiff = 0;
                  if (leadTimeParts[1] === defaultLeadTimeParts[1]) { // Same unit (weeks, days, etc.)
                    leadTimeDiff = parseInt(leadTimeParts[0]) - parseInt(defaultLeadTimeParts[0]);
                  }
                  
                  return (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Difference:</span>
                        <span className={priceDiff > 0 ? 'text-red-600' : 'text-green-600'}>
                          {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(2)} ({((priceDiff / defaultVariation.price) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      
                      {leadTimeDiff !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lead Time Difference:</span>
                          <span className={leadTimeDiff > 0 ? 'text-red-600' : 'text-green-600'}>
                            {leadTimeDiff > 0 ? '+' : ''}{leadTimeDiff} {leadTimeParts[1]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSelectVariation(activeVariation.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Select This Variation
          </button>
        </div>
      </div>
    </div>
  );
} 