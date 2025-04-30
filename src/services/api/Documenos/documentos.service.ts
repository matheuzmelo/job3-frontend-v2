import Api from "..";

const create = async (data: any): Promise<any> => {
  const token = localStorage.getItem('token');
  console.log(data)
  const options = {
    method: 'POST',
    url: `/documentos`,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    data: data
  };

  try {
    return await Api.request(options);
  } catch (error) {
    console.error(error);
  }
};

const createNFE = async (id: number,data: any): Promise<any> => {
  const token = localStorage.getItem('token');
  console.log(data)
  const options = {
    method: 'POST',
    url: `/documentos/emissao-nota/${id}`,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    data: data
  };

  try {
    return await Api.request(options);
  } catch (error) {
    console.error(error);
  }
};

const getAll = async () => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    url: '/documentos',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

export const DocumentosService = {
  create,
  getAll,
  createNFE,
}