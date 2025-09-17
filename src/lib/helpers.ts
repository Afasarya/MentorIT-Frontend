// Helper functions for the application

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

/**
 * Get the full URL for a thumbnail image
 * @param thumbnail - The thumbnail path from backend
 * @returns Full URL or fallback image
 */
export const getThumbnailUrl = (thumbnail: string | null | undefined): string => {
  if (!thumbnail) return '/images/course.png';
  if (thumbnail.startsWith('http')) return thumbnail;
  
  // Handle different thumbnail path formats from backend
  let cleanPath = thumbnail;
  if (thumbnail.startsWith('uploads/')) {
    cleanPath = thumbnail;
  } else if (!thumbnail.startsWith('/')) {
    cleanPath = `uploads/${thumbnail}`;
  }
  
  return `${API_BASE_URL}/${cleanPath}`;
};

/**
 * Format price to Indonesian Rupiah
 * @param price - Price in number
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Format date to readable format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get level color class for badges
 * @param level - Course level
 * @returns Tailwind CSS classes
 */
export const getLevelColor = (level: string): string => {
  switch (level?.toLowerCase()) {
    case 'mudah':
      return 'bg-green-100 text-green-800';
    case 'sedang':
      return 'bg-yellow-100 text-yellow-800';
    case 'sulit':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};