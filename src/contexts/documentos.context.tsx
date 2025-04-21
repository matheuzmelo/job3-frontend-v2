import React, { createContext, useEffect, useState } from "react";
import { TNotaFiscalGroup } from "../components/pages/nfe/TNotaFiscal.type";
import { ProdutosService } from "../services/api/Produtos/produtos.service";
import { TData } from "../types/TParametros.type";

interface IDocumentosContext {
  documentos: TNotaFiscalGroup;
  parametros: TData | null;
  setDocumentos: (documentos: TNotaFiscalGroup) => void;
  isLoading: boolean;
  setError: (error: any) => any;
  error: any;
  produtos: any;
}

const DocumentosContext = createContext<IDocumentosContext | undefined>(
  undefined
);

export const DocumentosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [documentos, setDocumentos] = useState<TNotaFiscalGroup>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [parametros, setParametros] = useState<TData | null>(null);
  const [produtos, setProdutos] = useState<any>([]);

  const getParametros = async () => {
    try {
      setIsLoading(true);
      const response = {
        success: true,
        data: {
          status: [
            {
              id: 1,
              chave: "PEDIDO",
              titulo: "PEDIDO",
              descricao: "Identifica o documento como Pedido.",
              model: "documentos",
            },
            {
              id: 2,
              chave: "NOTA_FISCAL",
              titulo: "NOTA FISCAL",
              descricao: "Identifica o documento como Nota Fiscal",
              model: "documentos",
            },
          ],
          cfop: [
            {
              cfop: "1.000",
              descricao: "ENTRADAS OU AQUISIÇÕES DE SERVIÇOS DO ESTADO",
              entrada_saida: "E",
            },
            {
              cfop: "2.000",
              descricao: "ENTRADAS OU AQUISIÇÕES DE SERVIÇOS DE OUTROS ESTADOS",
              entrada_saida: "E",
            },
            {
              cfop: "3.000",
              descricao: "ENTRADAS OU AQUISIÇÕES DE SERVIÇOS DO EXTERIOR",
              entrada_saida: "E",
            },
            {
              cfop: "5.000",
              descricao: "SAÍDAS OU PRESTAÇÕES DE SERVIÇOS PARA O ESTADO",
              entrada_saida: "S",
            },
            {
              cfop: "6.000",
              descricao: "SAÍDAS OU PRESTAÇÕES DE SERVIÇOS PARA OUTROS ESTADOS",
              entrada_saida: "S",
            },
            {
              cfop: "7.000",
              descricao: "SAÍDAS OU PRESTAÇÕES DE SERVIÇOS PARA O EXTERIOR",
              entrada_saida: "S",
            },
          ],
          proximo_numero_pedido: 5,
          proximo_numero_nota: 1,
        },
      };
      setIsLoading(false);
      if (response.success) {
        setParametros(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const getProdutos = async () => {
    try {
      setIsLoading(true);

      const { data } = await ProdutosService.getAll();
      console.log("produtos", data);
      setIsLoading(false);
      setProdutos(data);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    getProdutos();
    getParametros();
  }, []);

  return (
    <DocumentosContext.Provider
      value={{
        documentos,
        parametros,
        setDocumentos,
        isLoading,
        setError,
        error,
        produtos,
      }}
    >
      {children}
    </DocumentosContext.Provider>
  );
};

export const useDocumentosContext = () => {
  const context = React.useContext(DocumentosContext);
  if (context === undefined)
    throw new Error(
      "useDocumentosContext must be used within a DocumentosProvider"
    );
  return context;
};
