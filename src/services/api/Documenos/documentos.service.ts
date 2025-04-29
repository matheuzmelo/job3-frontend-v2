import Api from "..";

const create = async (id: number,data: any) => {
  const token = localStorage.getItem('token');
  console.log(data)
  const options = {
    method: 'POST',
    url: `/documentos/`,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    data: data
  };

  try {
    await Api.request(options);
  } catch (error) {
    console.error(error);
  }
};

const getAll = async (data: any | null) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    url: '/documentos',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    data: data
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
}