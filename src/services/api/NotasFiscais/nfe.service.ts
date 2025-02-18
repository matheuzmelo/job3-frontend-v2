import Api from "..";

const create = async (data: any) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'POST',
    url: '/notas-fiscais',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await Api.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAll = async () => {
  const token = localStorage.getItem('token');

  const options = {
    method: 'GET',
    url: '/notas-fiscais',
    headers: {authorization: `Bearer ${token}`}
  };
  
  try {
    const { data } = await Api.request(options);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const getById = async (id: number) => {
  const token = localStorage.getItem('token');

  const options = {
    method: 'GET',
    url: `/notas-fiscais/${id}`,
    headers: {authorization: `Bearer ${token}`}
  };
  
  try {
    const { data } = await Api.request(options);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const updateById = async () => {

}

const deleteById = async () => {

}

export const NotasFicaisService = {
  create,
  getAll,
  getById,
  updateById,
  deleteById
}