import Api from "..";

const getByName = async (name: string) => {
  const token = localStorage.getItem('token');

  var options = {
    method: 'GET',
    url: `/parametros/${name}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {}
  };

  const response = Api.request(options)

  return response
}

export const ParametrosTelasService = {
  getByName,
}