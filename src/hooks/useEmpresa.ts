import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../services/api";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { decodeJWT } from "../Utils";

export const useEmpresas = () => {
  return useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const response = await EmpresasService.getEmpresas();
      
      return response.data;
    },
  });
};

export const useGetCurrentEmpresa = () => {
  return useQuery({
    queryKey: ["get-empresa"],
    queryFn: async () => {
      const response = await EmpresasService.getEmpresa()

      return response.data
    }
  })
}

export const useCreateEmpresa = () => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      const token = localStorage.getItem('token')
      
      if(!token){
        throw new Error('token não recuperado')
      }
      
      const isSuperAdmin = decodeJWT(token)

      if(isSuperAdmin.nivel === 99) queryClient.invalidateQueries({ queryKey: ["get-business"] });
    },
  });
};
