export const decodeJWT = (token: string) => {
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

export const isSuperAdmin = (token: string): boolean | null => {
  try {
    const getTokenData = decodeJWT(token);

    if(getTokenData.nivel == 99) return true

    return false
  } catch( error ) {
    console.error('Erro ao identificar super admin:', error);
    return null;
  }
}