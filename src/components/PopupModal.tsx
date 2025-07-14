import { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const PopupModal = ({showAddURLModal, onData, onHandleCloseModal}) => {
  const modalRef = useRef();
  const [newUrl, setNewUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
    
  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal()            
        }
        if(event.key === 'Enter') {
            handleSubmitUrl()
        }
    };
    const handleClickOutside = (event) => {
        if (showAddURLModal && modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const closeModal = () => {
    onHandleCloseModal();
    setNewUrl('');
    setUrlError('');
    setIsValidating(false);
  };

  const handleSubmitUrl = async () => {
    if (!newUrl.trim()) {
      setUrlError('URL is required');
      return;
    }

    setIsValidating(true);
    setUrlError('');

    try {
      const validation = validateUrl(newUrl.trim());
      
      if (!validation.isValid) {
        setUrlError(validation.error);
        setIsValidating(false);
        return;
      }

      // TODO call backend to store data and analyse 
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEntry = {
        id: Date.now(),
        url: validation.url,
        title: 'Analyzing...',
        htmlVersion: 'Pending',
        internalLinks: 0,
        externalLinks: 0,
        status: 'Processing'
      };

      // add to table rows
      onData(newEntry);
      closeModal();
      console.log('URL added successfully:', validation.url);
    } catch (error) {
      setUrlError('Failed to add URL. Please try again.');
      console.error('Error adding URL:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const validateUrl = (url) => {   
    try {
      const newUrl = new URL(url);
      if( newUrl.protocol === 'http:' || newUrl.protocol === 'https:'){
        return { isValid: true, url };
      }
      return { isValid: false, error: 'Invalid URL format' };
    } catch (err) {
        console.log('Error', err)
        return { isValid: false, error: 'Invalid URL format' };
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" ref={modalRef}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New URL</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
            disabled={isValidating}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                urlError ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isValidating}
            />
            {urlError && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {urlError}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isValidating}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitUrl}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                'Add URL'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;