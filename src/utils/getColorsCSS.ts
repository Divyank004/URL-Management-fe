export  const getStatusCodeColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600 bg-green-100';
    if (statusCode >= 300 && statusCode < 400) return 'text-yellow-600 bg-yellow-100';
    if (statusCode >= 400 && statusCode < 500) return 'text-red-600 bg-red-100';
    if (statusCode >= 500) return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

export const getStatusColor = (status) => {
    switch (status) {
      case 'Queued':
        return 'text-orange-600 bg-orange-100';
      case 'Running':
        return 'text-green-600 bg-green-100';
      case 'Error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };