export const decryptBase64 = (value: string) => {
  try {
    return atob(value);
  } catch (error) {
    
  }
};
