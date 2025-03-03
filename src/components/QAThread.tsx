import { useState } from 'react';
import { format } from 'date-fns';

// Define types for our component
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'buyer' | 'supplier';
  };
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isRead: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface QAThreadProps {
  supplierId: number;
  supplierName: string;
  messages: Message[];
  onSendMessage: (supplierId: number, content: string, attachments: File[]) => void;
}

export default function QAThread({ supplierId, supplierName, messages, onSendMessage }: QAThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  
  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(supplierId, newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
      setShowAttachmentInput(false);
    }
  };
  
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-medium">Q&A with {supplierName}</h3>
        <div className="text-sm text-gray-500">
          {messages.filter(m => !m.isRead && m.sender.role === 'supplier').length > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {messages.filter(m => !m.isRead && m.sender.role === 'supplier').length} new
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-96">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation with {supplierName}.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender.role === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.sender.role === 'buyer' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{message.sender.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {format(message.timestamp, 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center text-xs bg-white p-1 rounded">
                        <svg className="h-4 w-4 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="border-t pt-3">
        {showAttachmentInput && (
          <div className="mb-2">
            <input
              type="file"
              multiple
              onChange={handleAttachmentChange}
              className="text-sm"
            />
          </div>
        )}
        
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                <span className="truncate max-w-xs">{file.name}</span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${supplierName} a question...`}
            className="flex-grow border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <div className="flex flex-col ml-2 space-y-2">
            <button
              onClick={() => setShowAttachmentInput(!showAttachmentInput)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Attach files"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0}
              className={`p-2 rounded-full ${
                !newMessage.trim() && attachments.length === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
              title="Send message"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 