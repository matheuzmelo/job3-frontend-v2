// contexts/documentos.context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DocumentosService } from '../services/api/Documentos/documentos.service';

type Produto = {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  total_produto: number;
  valor_desconto: number;
  percentual_desconto: number;
  observacoes: string;
};

type Documento = {
  id?: number;
  numero_pedido: number;
  pessoa_id: number;
  total: number;
  observacoes: string;
  movimenta_estoque: boolean;
  tipo_documento: string;
  produtos: Produto[];
  cliente?: string; // Adicionado para compatibilidade com a listagem
};

type DocumentoListagem = {
  id: number;
  numero_pedido: number;
  cliente: string;
  tipo_documento: string;
  total: number;
};

type DocumentoContextType = {
  documentos: DocumentoListagem[];
  currentDocumento: Documento | null;
  isLoading: boolean;
  error: Error | null;
  fetchDocumentos: () => Promise<void>;
  getDocumentoById: (id: number) => Promise<Documento>;
  addDocumento: (documento: Documento) => Promise<void>;
  setCurrentDocumento: (documento: Documento | null) => void;
};

const DocumentoContext = createContext<DocumentoContextType>({} as DocumentoContextType);

export const DocumentoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documentos, setDocumentos] = useState<DocumentoListagem[]>([]);
  const [currentDocumento, setCurrentDocumento] = useState<Documento | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocumentos = async () => {
    setIsLoading(true);
    try {
      const response = await DocumentosService.getAll();

      if (response.success) {
        setDocumentos(response.data);
      } else {
        throw new Error(response.message || 'Erro ao buscar documentos');
      }
    } catch (err) {
      setError(err as Error);
      toast.error('Erro ao carregar documentos');
      console.error('Erro no fetchDocumentos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentoById = async (id: number): Promise<Documento> => {
    setIsLoading(true);
    try {
      const response = await DocumentosService.getById(id);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao buscar documento');
      }
    } catch (err) {
      setError(err as Error);
      toast.error('Erro ao carregar documento');
      console.error('Erro no getDocumentoById:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addDocumento = async (documento: Documento) => {
    setIsLoading(true);
    try {
      const response = await DocumentosService.create(documento);

      if (response.success) {
        toast.success('Documento criado com sucesso!');
        await fetchDocumentos();
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao criar documento');
      }
    } catch (err) {
      setError(err as Error);
      toast.error((err as Error).message || 'Erro ao criar documento');
      console.error('Erro no addDocumento:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  return (
    <DocumentoContext.Provider
      value={{
        documentos,
        currentDocumento,
        isLoading,
        error,
        fetchDocumentos,
        getDocumentoById,
        addDocumento,
        setCurrentDocumento,
      }}
    >
      {children}
    </DocumentoContext.Provider>
  );
};

export const useDocumentosContext = () => {
  const context = useContext(DocumentoContext);
  if (!context) {
    throw new Error('useDocumentosContext deve ser usado dentro de um DocumentoProvider');
  }
  return context;
};