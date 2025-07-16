export const getStatusCodeColor = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300)
    return "text-green-600 bg-green-100";
  if (statusCode >= 300 && statusCode < 400)
    return "text-yellow-600 bg-yellow-100";
  if (statusCode >= 400 && statusCode < 500) return "text-red-600 bg-red-100";
  if (statusCode >= 500) return "text-purple-600 bg-purple-100";
  return "text-gray-600 bg-gray-100";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Queued":
      return "text-blue-800 bg-blue-100";
    case "Running":
      return "text-yellow-800 bg-yellow-100";
    case "Error":
      return "text-red-800 bg-red-100";
    case "Done":
      return "text-green-800 bg-green-100";
    default:
      return "text-gray-800 bg-gray-100";
  }
};
