export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    const payload = JSON.parse(atob(base64));
    
    return payload;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};
