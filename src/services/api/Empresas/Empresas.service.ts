import Api from "..";

const create = async (data: any) => {
  const token = localStorage.getItem("token");
  const options = {
    method: "POST",
    url: "/empresas",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    data: data,
  };

  try {
    const { data } = await Api.request(options);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const getAll = async () => {
  const token = localStorage.getItem("token");
  const options = {
    method: "GET",
    url: "/empresas",
    headers: {
      authorization: `Bearer ${token}`
    }
  };

  try {
    const { data } = await Api.request(options);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getById = async (id: number) => {
  const token = localStorage.getItem("token");
  const options = {
    method: "GET",
    url: `/empresa/${id}`,
    headers: {
      authorization: `Bearer ${token}`
    }
  };

  try {
    const { data } = await Api.request(options);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const updateById = async () => {};

const deleteById = async () => {};

export const EmpresasService = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
