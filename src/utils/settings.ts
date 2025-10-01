export const loadCompanySettings = () => {
  const defaultSettings = {
    companyName: 'Your Company Name',
    address: '123 Business Street',
    city: 'City',
    state: 'ST',
    zip: '12345',
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    taxId: 'TAX-123456789',
  };

  try {
    const savedSettings = localStorage.getItem('companySettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  } catch (error) {
    console.error('Error loading company settings:', error);
    return defaultSettings;
  }
};

export const saveCompanySettings = (settings: any) => {
  try {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving company settings:', error);
    return false;
  }
};
