import Api from "..";

const insertClasse = async (data: { descricao: string; chave: string; }) => {
  const token = localStorage.getItem('token');

  const dataRaw = JSON.stringify({
    "descricao": data.descricao,
    "chave": data.chave
  })

  const options = {
    method: 'POST',
    data: dataRaw,
    url: `/classes`,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

const getClasses = async () => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    url: '/classes',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

const updateClasse = async (id: number, data: { descricao: string; chave: string; }) => {
  const token = localStorage.getItem('token');

  const dataRaw = JSON.stringify({
    "descricao": data.descricao,
    "chave": data.chave
  })

  const options = {
    method: 'PATCH',
    data: dataRaw,
    url: `/classes/${id}`,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

export const ClassesService = {
  insertClasse,
  getClasses,
  updateClasse,
}