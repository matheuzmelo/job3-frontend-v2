import Api from "..";

const getCepData = async (cep: string) => {
  const options = {
    method: 'GET',
    url: `https://brasilapi.com.br/api/cep/v1/${cep}`,
    headers: {Accept: '*/*'}
  };
  
  try {
    const {data} = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

export const CepService = {
  getCepData
}