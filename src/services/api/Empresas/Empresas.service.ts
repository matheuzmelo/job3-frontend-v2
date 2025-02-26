import Api from "..";

const create = async (data: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado. Faça login novamente.");
  }

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
    const response = await Api.request(options);
    return response; // Retorna os dados da resposta em caso de sucesso
  } catch (error: any) {
    throw new Error(`Erro ao cadastrar empresa: ${error}`);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(data.message || "Dados inválidos. Verifique os campos e tente novamente.");
        case 401:
          throw new Error("Não autorizado. Faça login novamente.");
        case 403:
          throw new Error("Acesso negado. Você não tem permissão para realizar esta ação.");
        case 404:
          throw new Error("Recurso não encontrado.");
        case 500:
          throw new Error("Erro interno no servidor. Tente novamente mais tarde.");
        default:
          throw new Error(data.message || "Erro desconhecido ao cadastrar empresa.");
      }
    } else if (error.request) {
      // Erros de rede ou servidor indisponível
      throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
    } else {
      // Erros gerais (ex: erro ao configurar a requisição)
      throw new Error("Erro ao processar a requisição. Tente novamente.");
    }
  }
};

const getAll = async () => {
  const token = localStorage.getItem("token");
  const options = {
    method: "GET",
    url: "/empresas/all",
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
