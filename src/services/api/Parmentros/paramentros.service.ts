import Api from "..";

const getDataByPage = async (page: string) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    url: `/parametros/${page}`,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

export const ParametrosService = {
  getDataByPage
}