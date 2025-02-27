import Api from "..";

const create = async (data: any) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'POST',
    url: '/usuarios',
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
    url: '/usuarios',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

const getUser = async () => {
  const token = localStorage.getItem('token');

  const options = {
    method: 'GET',
    url: '/usuarios/dados-usuario',
    headers: {authorization: `Bearer ${token}`}
  };
  
  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

const updateById = async () => {

}

const deleteById = async () => {

}

export const UsuariosService = {
  create,
  getAll,
  getUser,
  updateById,
  deleteById
}