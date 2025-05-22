import Api from "..";
import { decodeJWT } from "../../../Utils";

const create = async (data: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Token de autenticação não encontrado. Faça login novamente."
    );
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
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(
            data.message ||
              "Dados inválidos. Verifique os campos e tente novamente."
          );
        case 401:
          throw new Error("Não autorizado. Faça login novamente.");
        case 403:
          throw new Error(
            "Acesso negado. Você não tem permissão para realizar esta ação."
          );
        case 404:
          throw new Error("Recurso não encontrado.");
        case 500:
          throw new Error(
            "Erro interno no servidor. Tente novamente mais tarde."
          );
        default:
          throw new Error(
            data.message || `Erro desconhecido ao cadastrar empresa.${error}`
          );
      }
    } else if (error.request) {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    } else {
      throw new Error("Erro ao processar a requisição. Tente novamente.");
    }
  }
};


const getEmpresas = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if(!token){
        throw new Error('token não recuperado')
      }
      const isSuperAdmin = decodeJWT(token)

      if(isSuperAdmin.nivel === 99) {
        const options = {
          method: 'GET',
          url: '/empresas/all',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {}
        };

        const response = await Api.request(options)

        return response.data
      }
      
    } catch (error) {
      console.error(error)
    }
};

const getEmpresa = async () => {
  try {
    const token = localStorage.getItem('token')
    const options = {
      method: 'GET',
      url: '/empresas',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {}
    };

    const response = await Api.request(options)

    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const EmpresasService = {
  create,
  getEmpresa,
  getEmpresas,
};
