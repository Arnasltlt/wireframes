'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuotePage() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quote #12345</h1>
        
        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">Acme Corporation</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">Custom Metal Bracket</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">500 units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">$4,250.00</span>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            Actions
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                <li>
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      alert('Sending RFQ...');
                      setIsOpen(false);
                    }}
                  >
                    Send RFQ
                  </button>
                </li>
                <li>
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      router.push('/production/setup?quoteId=12345');
                      setIsOpen(false);
                    }}
                  >
                    Set up production
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 