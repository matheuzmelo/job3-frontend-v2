import { CepService } from "../services/api/CEP/cep.service";
import { DadosCep } from "../types/TCep.type";

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

export const isSuperAdmin = (token: string): boolean => {
  try {
    const getTokenData = decodeJWT(token);

    if(getTokenData.nivel == 99) return true

    return false
  } catch( error ) {
    console.error('Erro ao identificar super admin:', error);
    return false;
  }
}

export const getDataCep = async (cep: string): Promise<DadosCep | undefined | any> => {
  try {
    const dados = await CepService.getCepData(cep);
    return dados;
  } catch (error) {
    return error;
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const currencyMask = (value: string): string => {
  const onlyDigits = value.replace(/[^\d]/g, "");

  const number = Number(onlyDigits) / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};