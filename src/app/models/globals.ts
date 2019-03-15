import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Injectable()
export class Globals {
    logged: LoggedUser;
    varsIO: VarsIO;
}


// this.globals.varsIO.loading = false;
// this.globals.varsIO.selecaoEmpresa = false;
// this.globals.varsIO.pagsAbertos = 0;
// this.globals.varsIO.pagsAbertosMes = 0;
// this.globals.varsIO.cpnsDesconto = 0;
// this.globals.varsIO.dashPedLen = true;
// this.globals.varsIO.historicoPagina = 0;

export class VarsIO {
    tmp_od_cilladd_y: Array<OPCCODY>;
    tmp_oe_cilladd_y: Array<OPCCODY>;
    loading = false as boolean;
    loading_num = 0 as number;
    loading_frete = 0 as number;
    selecaoEmpresa = false as boolean;
    pagsAbertos = 0 as number;
    pagsAbertosMes = 0 as number;
    cpnsDesconto = 0 as number;
    dashPedLen = true as boolean;
    historicoPagina = 0 as number;
    financeiroPagina = 0 as number;
    LenteIO: Lente;
    FAQ: Array<FAQ>;
    Downloads: Array<Download>;
    CondPag: Array<CondPag>;
    papTemMontagem = false as boolean;
    total_lentes_check = 0 as number;
    bad_login = false as boolean;
    naoAtendida: Array<ListaFalta>;
    EnderecoIO: Endereco;
    UsuarioIO: Usuario;
    pedidoFechado = false as boolean;
    empenhoPAP: PedidoPAP;
    _passError = false as boolean;
    _passErrorTXT = '';
    altSenhaIO = false as boolean;
    Otimizacoes: Array<Otimizacao>;
    SugestaoOtimizacao: SugereOtimizacao;
}

export class LoggedUser {
    User: Usuario;
    Company_active: Company;
    Companies: Array<Company>;
    Tickets: Array<Ticket>;
    Lentes: Array<Lente>;
    Historicos: Array<Historico>;
    TotalHistoricos: number;
    Financeiros: Array<Financeiro>;
    TotalFinanceiros: number;
    Representantes: Array<Representante>;
    Enderecos: Array<Endereco>;
    Usuarios: Array<Usuario>;
    FormasPGTO: Array<FormaPGTO>;
    Pedido_Final: PedidoFinal;

    Pedido_pode_pap: boolean;
    Pedido_pode_grade: boolean;
    Pedido_condpag: CondPag;
    Pedido_num: string;
    Pedido_novo: boolean;
    Pedido_total_lentes = 0 as number;
    Pedido_valor_total_lentes = 0 as number;
    Pedido_valor_frete = 0 as number;
    Pedido_peso_bruto = 0 as number;
    Pedido_grade: Array<PedidoGrade>;
    Pedido_pap: Array<PedidoPAP>;
    Pedido_frete: Array<Frete>;
    Pedido_transps: Array<Transportadora>;
    Pedido_ticket: string;

}

export class Usuario {
    ATIVO = false as boolean;
    BLOQUEADO = false as boolean;
    EMAIL: string;
    GERENCIAL = false as boolean;
    ID: number;
    LOGIN: string;
    NOME: string;
    SETOR: string;
    TOKEN: string;
    TROCARSENHA = false as boolean;
    ULTTRANSPORTADORA: string;
    _IDUSUARIOMASTER: number;
    _inclNovoEndereco = false as boolean;
    _inclPedido = false as boolean;
    _recEmailPedido = false as boolean;
    _recEmailatraso = false as boolean;
    _recEmailembarque = false as boolean;
    _recEmailnegativar = false as boolean;
    _recEmailtresdias = false as boolean;
    _recebEmailBoleto = false as boolean;
    _recebEmailDanf = false as boolean;
    _visuCobranca = false as boolean;
}

export class Company {
    A1_CGC: string;
    A1_COD: string;
    A1_NOME: string;
    A1_NREDUZ: string;
    LIBERADO: boolean;
    PODEMONTAGEM: boolean;
    PODEPARAPAR: boolean;
    PRECODINAMICO: boolean;
}

export class Ticket {
    CODIGO_CLIENTE: string;
    CONDICAO_PAGAMENTO: string;
    CUPOM_DESCONTO_CODIGO: number;
    FIM_VIGENCIA: string;
    FRETE_GRATIS: boolean;
    INICIO_VIGENCIA: string;
    NOME_CLIENTE: string;
    NUMERO_CUPOM: string;
    TIPO_CUPOM: string;
    USO: string;
}

export class Lente {
    FILTRO_AZUL: string;
    GRADE: boolean;
    INDICADA: boolean;
    LENS_NAME: string;
    MAIS_VENDIDA: boolean;
    BLOCO: boolean;
    MULTIFOCAL: boolean;
    PAR_A_PAR: boolean;
    PRODUTO: string;
    PROGRESSIVA: boolean;
    VISAO_SIMPLES: boolean;
    URL: SafeUrl;
    MATERIAL: string;
    CARAC_PRINCIPAL: string;
    CARAC_SEGUNDARIA: string;
    CARAC_TERCIARIA: string;
    CARAC_QUARTENARIA: string;
    CARAC_QUINTENARIA: string;
    CORDOSITE: string;
    GradesOPCODE: Array<GradeOPCODE>;
    Parapars: PedidoPAP;
    Precos: Array<Preco>;
    MAISCANAIS = false as boolean;
    total_lentes = 0 as number;
    valor_total_lentes = 0 as number;
    Atendidas = true as boolean;
    Popup = false as boolean;
    Detalhes: Array<LenteDetails>;
}

export class LenteDetails {
    DIAMETRO: string;
    MEDIDA1: string;
    MEDIDA2: string;
    TIPMED1: string;
    TIPMED2: string;
}
export class Preco {
    TIPO: number;
    CHAVE_1: number;
    CHAVE_2: number;
}

export class GradeOPCODE {
    GRADE: string;
    EIXO_X_NOME: string;
    EIXO_X: Array<OPCCOD>;
    EIXO_X_QTD: number;
    PRODUTO: string;
    EXIBE: boolean;
}
export class OPCCOD {
    ESFERICO: number;
    EIXO_Y_QTD: number;
    EIXO_Y: Array<OPCCODY>;
}
export class OPCCODY {
    EIXO: number;
    OPCCOD: string;
    CHAVE = 1 as number;
    QTD: number;
    ATENDIDA = true as boolean;
    QTD_SOLICITADA = 0;
}

export class ListaFalta {
    Diametro: number;
    Grau: string;
    QtdAtendida: number;
    QtdSolicitada: number;
}

export class Historico {
    COUNT_PED: number;
    Data_pedido: string;
    Data_prevista: string;
    Entrega: number;
    Hora_pedido: string;
    Link: string;
    Nfe: string;
    PedCli: string;
    Pedhtk: string;
    Pedstatus: string;
    Qtd: string;
    Transportadora: string;
    Valor: number;
    PARAPAR: boolean;
    PedDetalhes: Array<any>;   // PedDetalhePAP ou PedDetalheGrade
    PedRastreio: PedRastreio;
    Boletos: Array<Boleto>;
    Danfes: Array<Danfe>;
    LOADING: Number;
}

export class Financeiro {
    ID: number;
    BANCO: string;
    BOLETO: string;
    CLIENTE: string;
    COUNT_TITULO: number;
    EMISSAO: string;
    NDEN: string;
    NOTAS_FISCAIS: string;
    NREDUZ: string;
    NUMERO: string;
    PARCELA: string;
    RECNO_SE1: number;
    SALDO: number;
    VALOR: number;
    VENCIMENTO: string;
    _STATUS: string;
    LINK: string;
    Detalhes: Array<FinanceiroDetalhes>;
    LOADING: Number;
}

export class FinanceiroDetalhes {
    Cod_tramspo: string;
    DANFE: string;
    LINK_DANFE: string;
    Data_pedido: string;
    Hora_pedido: string;
    Nfe: string;
    PedCli: string;
    Pedhtk: string;
    TRANSPORTADORA: string;
    Valornfe: number;
    _XML: string;
    LINK_XML: string;
}

export class Boleto {
    BOLETO: string;
    EMISSAO: string;
    PARCELA: string;
    VALOR: number;
    VENCTO: string;
    _STATUS: string;
}

export class Danfe {
    DANFE: string;
    NFE: string;
    _XML: string;
}

export class PedRastreio {
    DATACHEG: string;
    DATADEPAC: string;
    DATANOTA: string;
    DATAPREVISTA: string;
    HORADESP: string;
    HORAENTR: string;
    HORANOTA: string;
    ZZ5_EMISSA: string;
    ZZ5_HORAPE: string;
    ENDEREC: string;
    MUN: string;
    UF: string;
    BAIRRO: string;
    CEP: string;
    COMPLEM: string;
}

export class PedDetalhePAP {
    Lente: Lente;
    Aro: string;
    COR: string;
    CUID: string;
    DESCRICAO: string;
    DIR_ADD: string;
    DIR_CIL: string;
    DIR_EIXO: string;
    DIR_ESFER: string;
    ESQ_ADD: string;
    ESQ_CIL: string;
    ESQ_EIXO: string;
    ESQ_ESFER: string;
    LALTURA: string;
    LDNP: string;
    MARCA: string;
    MATERIAL: string;
    MODELO: string;
    MONTAGEM: string;
    NOME: string;
    OSCLI: string;
    OSHTK: string;
    PEDIDO: string;
    POLIMENTO: boolean;
    PONTE: string;
    PRODUTO: string;
    QUEBRACANTO: 0;
    RALTURA: string;
    RDNP: string;
    TIPOARO: string;
    VALOR: number;
    VLRLENTES: number;
    VLRSERVICO: number;
}

export class PedDetalheGrade {
    Lente: Lente;
    CHAVE: string;
    DESCRICAO: string;
    FALTA: number;
    PRECO_DANF: number;
    PRODUTO: string;
    QUANTIDADE: number;
    VALOR: number;
}

export class GradeGrade {
    ID: number;
    OPCCODE: string;
    PRODUTO: string;
    QUANTIDADE: number;
}

export class CondPag {
    CODIGO: string;
    DESCRICAO: string;
    PRECO: number;
}

export class Representante {
    EMAIL: string;
    IMAGEM: string;
    URL: SafeUrl;
    TEL: string;
    VENDEDOR: string;
    CARGO: string;
}

export class FAQ {
    PERGUNTA: string;
    RESPOSTA: string;
}

export class Download {
    CAMINHO: string;
    TITULO: string;
    URL: SafeUrl;
}

export class PedidoGrade {
    CARAC_PRINCIPAL: string;
    CARAC_QUARTENARIA: string;
    CARAC_QUINTENARIA: string;
    CARAC_SEGUNDARIA: string;
    CARAC_TERCIARIA: string;
    DESCRICAO: string;
    PRODUTO: string;
    Lente: Lente;
    QUANTIDADE: number;
    VALORTOTAL: number;
    Loading = 0 as number;
    Detalhes: Array<PedidoGradeDetalhes>;
}

export class PedidoGradeDetalhes {
    CHAVE: string;
    DIAMETRO: string;
    MEDIDAS: string;
    OPCCOD: string;
    PRODUTO: string;
    PRECO: number;
    QUANTIDADE: number;
    VALORTOTAL: number;
}

export class PedidoPAP {
    CARAC_PRINCIPAL: string;
    CARAC_QUARTENARIA: string;
    CARAC_QUINTENARIA: string;
    CARAC_SEGUNDARIA: string;
    CARAC_TERCIARIA: string;
    DESCRICAO: string;
    DIR_ADD: string;
    DIR_CIL: string;
    DIR_EIXO: string;
    DIR_ESFER: string;
    ESQ_ADD: string;
    ESQ_CIL: string;
    ESQ_EIXO: string;
    ESQ_ESFER: string;
    MONTAGEM: string;
    NOME: string;
    OSCLI: string;
    OSHTK: string;
    PRODUTO: string;
    Lente: Lente;
    D_VALOR = 0 as number;
    E_VALOR = 0 as number;
    VALOR: number;
    VLRLENTES: number;
    VLRSERVICO: number;
    Loading = 0 as number;
    Detalhes: PedidoPAPDetalhes;
    DetalheIO = false as boolean;
}

export class PedidoPAPDetalhes {
    Aro: string;
    COR: string;
    CUID: string;
    DIR_ADD: number;
    DIR_CIL: number;
    DIR_EIXO: number;
    DIR_ESFER: number;
    ESQ_ADD: number;
    ESQ_CIL: number;
    ESQ_EIXO: number;
    ESQ_ESFER: number;
    LALTURA: string;
    LDNP: string;
    MARCA: string;
    MATERIAL: string;
    MODELO: string;
    MONTAGEM: string;
    NOME: string;
    OSCLI: string;
    OSHTK: string;
    PEDIDO: string;
    PONTE: string;
    PRODUTO: string;
    RALTURA: string;
    RDNP: string;
    TIPOARO: string;
    QUEBRACANTO: number;
    POLIMENTO: number;
    VALOR: number;
    VLRLENTES: number;
    VLRSERVICO: number;
}

export class Frete {
    PERCentual: number;
    PESO: number;
    ZHL_CODTRA: string;
    ZHL_DATENT: string;
    ZHL_ID: string;
    ZHL_NOME: string;
    ZHL_PRAZO: number;
    ZHL_QTDATR: number;
    ZHL_QTDEMB: number;
    ZHL_QTNOPR: number;
    ZHL_VALOR: number;
    ZHL_VERSAO: string;
}
export class Transportadora {
    A4_COD: string;
    A4_NOME: string;
    PRINCIPAL: boolean;
}

export class PedidoFinal {
    COD_TRANSPORTADORA: string;
    COD_FORMAPGTO: string;
    CLI_PEDIDO: string;
    TICKET: string;
}

export class Endereco {
    ID_ENDERECO: number;
    Z3_BAIRRO: string;
    Z3_CEP: string;
    Z3_CEPOK: string;
    Z3_CODCLI: string;
    Z3_COMPLEM: string;
    Z3_ENDEREC: string;
    Z3_NUMERO: string;
    Z3_FILIAL: string;
    Z3_ITEM: string;
    Z3_MUN: string;
    Z3_UF: string;
    Z3_UTLIMO: string;
    Z3_XCODENT: string;
}

export class FormaPGTO {
    CODIGO: string;
    DESCRI: string;
    DIFERENCA: number;
    E4_XMEDI: number;
    E4_XPARC: number;
    EXIBE: number;
    JUROS: number;
    PARCELA: number;
    PRE_SELECIONA: number;
    TOTSEMFRE: number;
    VALORTOT: number;
}

export class CEP {
    bairro: string;
    cep: string;
    localidade: string;
    logradouro: string;
    cidade: string;
    uf: string;
}

export class Otimizacao {
    B1_BASE: string;
    B1_XBASE: number;
    B1_XCILIND: number;
    B1_XESFERI: number;
    CARAC_PRINCIPAL: string;
    CARAC_QUARTENARIA: string;
    CARAC_QUINTENARIA: string;
    CARAC_SEGUNDARIA: string;
    CARAC_TERCIARIA: string;
    CORDOSITE: string;
    LENS_NAME: string;
    MATERIAL: string;
    MEDIDAS: string;
    SUGESTAO: number;
    ZZU_COD: string; // cod_produto
    ZZU_ID: string; // cod_frete
    ZZU_ITEM: string;
    ZZU_PEDHTK: string;
    ZZU_PRECO: number;
    ZZU_SUGERE: number;
    ZZU_TRANSP: string;
    ZZU_USADO: string;
    QUANTIDADE = 0 as number;
}

export class SugereOtimizacao {
    SUGESTAO = 0 as number; // ZZU_SUGERE
    JAADICIONADAS = 0 as number;
    PREENCHIDO = 0 as number;
    TOTAL = 0 as number;
}

export class LenteSugerida {
    material: string;
    cor: string;
    linha1: string;
    linha2: string;
    linha3: string;
    linha4: string;
    linha5: string;
    cod_lente: string;
    valor: number;
    produtos: Array<ProdutoLente>;
}

export class ProdutoLente {
    nome: string;
    quantidade: number;
    cod_produto: string;
}
