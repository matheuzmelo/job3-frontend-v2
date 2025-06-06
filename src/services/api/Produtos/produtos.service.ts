import Api from "..";

const create = async (data: any) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'POST',
    url: '/produtos',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    data: data
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
};

const getAll = async () => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    url: '/produtos',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

const getById = async () => {

}

const updateById = async () => {

}

const deleteById = async () => {

}

export const ProdutosService = {
  create,
  getAll,
  getById,
  updateById,
  deleteById
}