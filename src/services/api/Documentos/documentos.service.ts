import Api from "..";

const getAll = async () => {
  const token = localStorage.getItem('token');

  var options = {
    method: 'GET',
    url: '/documentos',
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = Api.request(options)

  return response
}

const createDoc = async (data: any) => {
  const token = localStorage.getItem('token')

  var options = {
    method: 'POST',
    url: '/documentos',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: data
  };

  Api.request(options)
}

export const DocumentosService = {
  getAll,
  createDoc,
}