import { useMutation } from "@tanstack/react-query";
import Api from "../services/api";

export const useCreateEmpresa = () => {
  return useMutation({
    mutationKey: ["insert-business"],
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      const options = {
        method: "POST",
        url: "/empresas",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        data,
      };

      const response = await Api.request(options);
      return response.data;
    },
  });
};
