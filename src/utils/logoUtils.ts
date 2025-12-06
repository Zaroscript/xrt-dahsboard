// Utility functions for handling company logos

// Get API base URL for logo - use the same configuration as the rest of the app
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getApiBaseUrl = (): string => {
  console.log('LogoUtils - API_URL:', API_URL);
  return API_URL;
};

// Construct full logo URL
export const getLogoUrl = (logoPath: string | undefined | null): string | undefined => {
  if (!logoPath) {
    console.log('No logo path provided');
    return undefined;
  }
  
  // If already a full URL, return as is
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    console.log('Logo path is already a full URL:', logoPath);
    return logoPath;
  }
  
  // If it's a relative path, prepend with base URL
  const baseUrl = getApiBaseUrl();
  const fullUrl = `${baseUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  // Add cache-busting parameter to prevent browser caching issues
  const cacheBustedUrl = `${fullUrl}?t=${Date.now()}`;
  console.log('Constructed logo URL:', cacheBustedUrl, 'from path:', logoPath);
  return cacheBustedUrl;
};

// Convert logo URL to data URL for PDF compatibility
export const convertToDataUrl = async (url: string): Promise<string | undefined> => {
  try {
    console.log('Attempting to fetch logo from:', url);
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch logo:', response.status, response.statusText);
      return undefined;
    }
    
    const blob = await response.blob();
    console.log('Logo blob size:', blob.size, 'type:', blob.type);
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('Data URL generated successfully, length:', result.length);
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        resolve(undefined);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert logo to data URL:', error);
    return undefined;
  }
};
