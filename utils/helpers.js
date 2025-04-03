

export const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };


export function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) return str; // Check if input is a string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const fetchWalletBalance = async (setWalletBalance,setLoading) => {
  try {

      const response = await axiosInstance.get('/users/profile');
      if (response.status === 200 && response.data.wallet) {
        setWalletBalance(response.data.wallet);
      }
  } catch (error) {
    console.error('Failed to fetch wallet balance:', error);
  } finally {
    setLoading(false);
  }
};

export const getIssueTypeLabel = (issueType) => {
  const issueTypeMapping = {
    shipment: "Shipment related issue (AWB mandatory)",
    tech: "Tech related issue",
    account: "Account or billing related issue",
    other: "Other issues",
  };

  return issueTypeMapping[issueType] || "Unknown issue type"; // Default to handle invalid issueType
};