import Api from "..";
import { ProdutoBody, ProdutoData } from "./produtos.type";

export const create = async (data: ProdutoData) => {
  const token = localStorage.getItem('token');

  const body: ProdutoBody = {
    codigo: data.codigo,
    descricao: data.descricao,
    classe_id: data.classe_id,
    unidade: data.unidade,
    valor_unidade: data.valor_unidade,
    valor_atacado: data.valor_atacado,
    valor_revenda: data.valor_revenda,
    valor_tabela4: data.valor_tabela4,
    ncm: Number( data.tributacao.ncm ),
    situacao_tributaria_icms_cst: data.tributacao.situacao_tributaria_icms_cst,
    csosn: data.tributacao.csosn,
    cst_ipi: data.tributacao.cst_ipi,
    enquadramento_ipi: data.tributacao.enquadramento_ipi,
    cst_pis: data.tributacao.cst_pis,
    cst_cofins: data.tributacao.cst_cofins,
    cest: data.tributacao.cest,
    cfop_interno: data.tributacao.cfop_interno,
    cfop_externo: data.tributacao.cfop_externo,
    codigo_beneficiarioa_tributo: data.tributacao.codigo_beneficiario,
    icms: data.tributacao.icms,
    icms_reduzidao: data.tributacao.icms_reduzidao,
    icms_diferido: data.tributacao.icms_diferido,
    mva: data.tributacao.mva,
    fcp: Number( data.tributacao.fcp ),
    valor_ultima_compra: data.valor_ultima_compra,
    custo: data.custo,
    peso_bruto: data.peso_bruto,
    peso_liquido: data.peso_liquido,
    estoque_minimo: data.estoque_minimo,
    continuacao_descricao: data.continuacao_descricao,
  };

  console.log(body);

  const options = {
    method: 'POST',
    url: '/produtos',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: body,
  };

  try {
    const { data: response } = await Api.request(options);
    return response;
  } catch (error: any) {
    console.error('Erro ao criar produto:', error.response?.data || error.message);
    throw error;
  }
};


const getAll = async () => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    url: '/produtos',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
  };

  try {
    const { data } = await Api.request(options);
    return data
  } catch (error) {
    console.error(error);
  }
}

const getById = async () => {

}

const updateById = async () => {

}

const deleteById = async () => {

}

export const ProdutosService = {
  create,
  getAll,
  getById,
  updateById,
  deleteById
}