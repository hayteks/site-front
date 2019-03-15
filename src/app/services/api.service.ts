import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry, finalize } from 'rxjs/operators';
import { Globals, LoggedUser, Company, Ticket, Lente, Historico, PedDetalhePAP, PedDetalheGrade,
OPCCOD, OPCCODY, GradeGrade, PedRastreio, Boleto, Danfe, Representante,
FAQ, Download, GradeOPCODE, CondPag, Preco, PedidoGrade, PedidoPAP, PedidoGradeDetalhes,
PedidoPAPDetalhes, ListaFalta, Frete, Transportadora, Endereco, Usuario, FormaPGTO, PedidoFinal,
CEP, Financeiro, FinanceiroDetalhes, LenteDetails, Otimizacao, SugereOtimizacao } from '../models/globals';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare function callCopyPaste(): any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL = 'http://lenteshaytek.com.br:88/';
  // API_URL = 'http://0.0.0.0:88/';
  REPOSITORIO_URL = 'http://repositorio.lenteshaytek.com.br/';
  retry_qty = 2;
  returnOPCCODS: any;
  _headers = new HttpHeaders({
    'Content-Type':  'application/json'
  });

  constructor(
    private httpClient: HttpClient,
    public globals: Globals,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
  }

  carregaDashboard(cod_cliente) {
    this.resetForNewCompany();

    this.getOrderHistory(cod_cliente);
    this.getTickets(cod_cliente);
    this.getCondPag(cod_cliente); // chama a getNumPed dentro
    this.getPaymentsOpenMonth(cod_cliente);
    this.getPaymentsOpenTotal(cod_cliente);
    this.getLens(cod_cliente);
  }

  resetForNewCompany() {
    this.globals.varsIO.dashPedLen = false;
    this.globals.varsIO.pedidoFechado = false;
    this.globals.varsIO.cpnsDesconto = 0;
    this.globals.varsIO.pagsAbertosMes = 0;
    this.globals.varsIO.pagsAbertosMes = 0;

    this.globals.logged.Historicos = new Array<Historico>();
    this.globals.logged.Tickets = new Array<Ticket>();
    this.globals.logged.Pedido_novo = false;
    this.globals.logged.Pedido_ticket = '';
    this.globals.logged.Pedido_num = '';
    this.globals.logged.Pedido_pode_grade = false;
    this.globals.logged.Pedido_pode_pap = false;
    this.globals.logged.Pedido_condpag = new CondPag();
    this.globals.logged.Lentes = new Array<Lente>();
    this.globals.logged.Pedido_Final = new PedidoFinal();
  }

  doLogin(email, password) {
    return  this.httpClient.post(`${this.API_URL}user/validate`,
    {
      'email': email, 'password': password
    })
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    }))
    .subscribe((data: Usuario) => {
      if (data && data[0] && data[0].ID) {
        this.globals.logged = new LoggedUser();
        this.globals.logged.User = new Usuario();

        // data.forEach(element => {
          this.globals.logged.User = data[0];

          this._headers = this._headers.append('token', this.globals.logged.User.TOKEN);
          this._headers = this._headers.append('iduser', this.globals.logged.User.ID.toString());
        // });

        this.globals.varsIO.bad_login = false;
        if (this.globals.logged.User._inclPedido) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/admin/meuspedidos']);
        }
      } else {
        this.globals.varsIO.bad_login = true;
      }
    });
  }

  alterPass(password, newPass) {
    return  this.httpClient.post(`${this.API_URL}user/validate`,
    {
      'email': this.globals.logged.User.EMAIL, 'password': password
    })
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    }))
    .subscribe((data: Usuario) => {
      if (data && data[0] && data[0].ID) {
        this.httpClient.post(`${this.API_URL}user/password/${this.globals.logged.User.ID}`,
        {
          'password': newPass
        })
        .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
        }))
        .subscribe((data2: any) => {
          console.log(data2);
          this.globals.varsIO.altSenhaIO = false;
          this.globals.varsIO._passError = false;
          if (this.globals.logged.User._inclPedido) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/admin/meuspedidos']);
          }
        });
      } else {
        this.globals.varsIO.altSenhaIO = true;
        this.globals.varsIO._passError = true;
        this.globals.varsIO._passErrorTXT = 'A senha atual esta incorreta.';
      }
    });
  }

  listCompanies(id_cliente) {
    this.globals.varsIO.selecaoEmpresa = false;
    this.globals.logged.Companies = new Array<Company>();
    return  this.httpClient.get(`${this.API_URL}user/companies/${id_cliente}`, { headers: this._headers} )
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Company>) => {
      data.forEach(element => {
        this.globals.logged.Companies.push(element);
      });
      if (this.globals.logged.Companies.length === 1) {
        this.globals.logged.Company_active = new Company();
        this.globals.logged.Company_active = this.globals.logged.Companies[0];
        this.carregaDashboard(this.globals.logged.Company_active.A1_COD);
      } else {
        this.globals.varsIO.selecaoEmpresa = true;
      }
    });
  }

  getLens(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}lens/${cod_cliente}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<any>) => {
      this.globals.logged.Lentes = new Array<Lente>();
      data.forEach(element => {
        let l = new Lente();
        const _url = this.sanitizer.bypassSecurityTrustStyle(`url("${this.REPOSITORIO_URL}/${element.PRODUTO}.jpg")`);
        l = element;
        l.URL = _url;
        l.BLOCO = false;
        if (l.PRODUTO.startsWith('B')) {
          l.BLOCO = true;
        }

        l.Precos = new Array<Preco>();
        let p = new Preco();
        p.TIPO = 0;
        p.CHAVE_1 = element.PRECO_0_CH1;
        p.CHAVE_2 = element.PRECO_0_CH2;
        l.Precos.push(p);
        p = new Preco();
        p.TIPO = 30;
        p.CHAVE_1 = element.PRECO_30_CH1;
        p.CHAVE_2 = element.PRECO_30_CH2;
        l.Precos.push(p);
        p = new Preco();
        p.TIPO = 45;
        p.CHAVE_1 = element.PRECO_45_CH1;
        p.CHAVE_2 = element.PRECO_45_CH2;
        l.Precos.push(p);
        p = new Preco();
        p.TIPO = 60;
        p.CHAVE_1 = element.PRECO_60_CH1;
        p.CHAVE_2 = element.PRECO_60_CH2;
        l.Precos.push(p);

        l.MAISCANAIS = false;
        if (element.PRECO_0_CH2 > 0 || element.PRECO_30_CH2 > 0 || element.PRECO_45_CH2 > 0 || element.PRECO_60_CH2 > 0) {
          l.MAISCANAIS = true;
        }
        this.globals.logged.Lentes.push(l);
      });
    });
  }

  getLensDetails(lente) {
    return  this.httpClient.get(`${this.API_URL}lens/${lente.PRODUTO}/details`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<LenteDetails>) => {
      this.globals.varsIO.LenteIO.Detalhes = new Array<LenteDetails>();
      this.globals.varsIO.LenteIO.Detalhes = data;
    });
  }

  getNumPed(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}orders/numped/${cod_cliente}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<any>) => {
      const el = data[0];

      this.globals.logged.Pedido_novo = el.NOVO;
      this.globals.logged.Pedido_num = el.NUMPED;
      this.globals.logged.Pedido_pode_grade = el.PODEGRADE;
      this.globals.logged.Pedido_pode_pap = el.PODEPARAPAR;

      this.globals.logged.Pedido_condpag = new CondPag();
      this.globals.logged.Pedido_condpag = this.globals.varsIO.CondPag.find(y => y.CODIGO === el.CONDPAG);

      if (!el.NOVO) {
        this.getCarrinho(el.NUMPED);
      } else {
        this.globals.logged.Pedido_total_lentes = 0 as number;
        this.globals.logged.Pedido_valor_total_lentes = 0 as number;
      }
    });
  }

  getCarrinho(cod_pedido) {
    return  this.httpClient.get(`${this.API_URL}carts/${cod_pedido}/total`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<any>) => {
      const el = data[0];
      this.globals.logged.Pedido_total_lentes = el.QUANTIDADE as number;
      this.globals.logged.Pedido_valor_total_lentes = el.VALORTOTAL as number;
    });
  }

  getTickets(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}tickets/${cod_cliente}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Ticket>) => {
      this.globals.logged.Tickets = new Array<Ticket>();
      data.forEach(element => {
        this.globals.logged.Tickets.push(element);
      });
      this.globals.varsIO.cpnsDesconto = this.globals.logged.Tickets.length;
    });
  }

  getPaymentsOpenMonth(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}payments/${cod_cliente}/month`, { headers: this._headers})
      .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
      })).subscribe((data: Array<Object>) => {
        this.globals.varsIO.pagsAbertosMes = data['ABERTOS'];
    });
  }

  getPaymentsOpenTotal(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}payments/${cod_cliente}/total`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Object>) => {
      this.globals.varsIO.pagsAbertos = data['ABERTOS'];
    });
  }

  getOrderHistory(cod_cliente, pagina = 1, qtd = 10, status = 'T', data_ini = '19000101', data_fim = '21000101', all = false ) {
    let cod_master: string;
    if (all) {
      cod_master = 'ZZZZZZ';
    } else {
      cod_master = '';
    }
    if (!data_ini) {
      data_ini = '19000101';
    }
    if (!data_fim) {
      data_fim = '21000101';
    }
    return this.httpClient.post(`${this.API_URL}orders/history/${cod_cliente}`,
    {
      'id_ini' : ((pagina - 1) * qtd) + 1,
      'id_qtd' : qtd,
      'status' : status,
      'data_ini' : data_ini,
      'data_fim' : data_fim,
      'cod_master' : cod_master
    }, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<Historico>) => {
      this.globals.varsIO.dashPedLen = false;
      this.globals.logged.Historicos = new Array<Historico>();
      data.forEach(element => {
        this.globals.varsIO.dashPedLen = true;
        this.globals.logged.TotalHistoricos = element.COUNT_PED;
        this.globals.logged.Historicos.push(element);
      });
      this.globals.varsIO.historicoPagina = Math.ceil(this.globals.logged.TotalHistoricos / 10);
    });
  }

  getOrderHistoryDetails(ped, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    let req;
    if (ped.PARAPAR) {
      req = new HttpRequest('GET', `${this.API_URL}orders/details/${ped.Pedhtk}/pap`, { headers: this._headers , reportProgress: true});
      this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            ped.LOADING += loading_sum;
            break;
          case HttpEventType.ResponseHeader:
            ped.LOADING += loading_sum;
            break;
          case HttpEventType.DownloadProgress:
            ped.LOADING += loading_sum;
            break;
          case HttpEventType.Response:
            ped.LOADING += loading_sum;
            ped.PedDetalhes = new Array<PedDetalhePAP>();
            event.body.forEach(element => {
              let _pedDet = new PedDetalhePAP();
              _pedDet = element;
              _pedDet.Lente = new Lente();
              _pedDet.Lente = this.globals.logged.Lentes.find(x => x.PRODUTO === element.PRODUTO.trim());
              ped.PedDetalhes.push(_pedDet);
            });
        }
      });
    } else {
      req = new HttpRequest('GET', `${this.API_URL}orders/details/${ped.Pedhtk}/grade`, { headers: this._headers , reportProgress: true});
      this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            ped.LOADING += loading_sum;
            break;
          case HttpEventType.ResponseHeader:
            ped.LOADING += loading_sum;
            break;
          case HttpEventType.DownloadProgress:
            ped.LOADING += loading_sum;
            break;
          case HttpEventType.Response:
            ped.LOADING += loading_sum;
            ped.PedDetalhes = new Array<PedDetalheGrade>();
            event.body.forEach(element => {
              let _pedDet = new PedDetalheGrade();
              _pedDet = element;
              _pedDet.Lente = new Lente();
              _pedDet.Lente = this.globals.logged.Lentes.find(x => x.PRODUTO === element.PRODUTO.trim());
              ped.PedDetalhes.push(_pedDet);
            });
        }
      });
    }

    return req;
  }

  getOrderHistoryRastreio(ped, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/details/${ped.Pedhtk}/rastreio`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.Response:
          ped.LOADING += loading_sum;
          ped.PedRastreio = new PedRastreio();
          const _ped = event.body;
          ped.PedRastreio = _ped[0];
      }
    });

    return req;
  }

  getOrderHistoryBoletos(ped, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/details/${ped.Pedhtk}/boleto`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.Response:
          ped.LOADING += loading_sum;
          ped.Boletos = new Array<Boleto>();
          ped.Boletos = <Array<Boleto>>event.body;
      }
    });

    return req;
  }

  getOrderHistoryDanfes(ped, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/details/${ped.Pedhtk}/danfes`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          ped.LOADING += loading_sum;
          break;
        case HttpEventType.Response:
          ped.LOADING += loading_sum;
          ped.Danfes = new Array<Danfe>();
          ped.Danfes = <Array<Danfe>>event.body;
      }
    });

    return req;
  }


  getOrderFinancial(cod_cliente, pagina = 1, qtd = 10, status = 'T', data_ini = '19000101',
  data_fim = '21000101', campo = '', order = '', all = false ) {
    let cod_master: string;
    if (all) {
      cod_master = 'ZZZZZZ';
    } else {
      cod_master = '';
    }
    if (!data_ini) {
      data_ini = '19000101';
    }
    if (!data_fim) {
      data_fim = '21000101';
    }
    return this.httpClient.post(`${this.API_URL}orders/financial/${cod_cliente}`,
    {
      'id_ini' : ((pagina - 1) * qtd) + 1,
      'id_qtd' : qtd,
      'status' : status,
      'data_ini' : data_ini,
      'data_fim' : data_fim,
      'campo' : campo,
      'order' : order,
      'cod_master' : cod_master
    }, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<Financeiro>) => {
      // this.globals.varsIO.dashPedLen = false;
      this.globals.logged.Financeiros = new Array<Financeiro>();
      data.forEach(element => {
        console.log(element);
        this.globals.varsIO.dashPedLen = true;
        this.globals.logged.TotalFinanceiros = element.COUNT_TITULO;
        this.globals.logged.Financeiros.push(element);
      });
      this.globals.varsIO.financeiroPagina = Math.ceil(this.globals.logged.TotalFinanceiros / 10);
    });
  }

  getOrderFinancialDetails(fin, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/financial/details/${fin.NUMERO}`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          fin.LOADING += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          fin.LOADING += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          fin.LOADING += loading_sum;
          break;
        case HttpEventType.Response:
          fin.LOADING += loading_sum;
          fin.Detalhes = new Array<FinanceiroDetalhes>();
          fin.Detalhes = <Array<FinanceiroDetalhes>>event.body;
      }
    });

    return req;
  }

  getLenOPCCOD(cod_len, cod_pedido, isHistory, os_num = null) {
    this.globals.varsIO.LenteIO = new Lente();
    this.globals.varsIO.LenteIO = this.globals.logged.Lentes.find(x => x.PRODUTO.trim() === cod_len.trim());
    this.globals.varsIO.naoAtendida = new Array<ListaFalta>();
    this.globals.varsIO.LenteIO.GradesOPCODE = new Array<GradeOPCODE>();
    let TIPO_ANT = '';
    let gradeOPCCODE = new GradeOPCODE();
    return this.httpClient
    .get(`${this.API_URL}lens/${cod_len}/opccod`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError)
    , finalize( () => {
      this.getLensDetails(this.globals.varsIO.LenteIO);
      if (cod_pedido) {
        if (isHistory) {
          this.fillGridHistory(cod_pedido, cod_len);
        } else {
          if (os_num) {
            this.fillPap(os_num);
          } else {
            this.fillGrid(cod_pedido, cod_len);
          }
        }
      }
    }))
    .subscribe((data: Array<any>) => {
      data = data.sort((a, b) => 0 - (a.TIPO > b.TIPO ? 1 : -1));
      data.forEach(element => {
        if (TIPO_ANT !== element.TIPO) {
          if (TIPO_ANT !== '') {
            gradeOPCCODE.EXIBE = false;
            this.globals.varsIO.LenteIO.GradesOPCODE.push(gradeOPCCODE);
          }
          gradeOPCCODE = new GradeOPCODE();
          gradeOPCCODE.EXIBE = true;
          gradeOPCCODE.EIXO_X = new Array<OPCCOD>();
          gradeOPCCODE.EIXO_X_QTD = 0;
          gradeOPCCODE.GRADE = element.TIPO;
          gradeOPCCODE.PRODUTO = element.PRODUTO.trim();
          TIPO_ANT = element.TIPO;
        }
        gradeOPCCODE.EIXO_X_QTD++;

        const opc = new OPCCOD();
        opc.ESFERICO = (element.ESFERICO !== '' ? element.ESFERICO : null);
        opc.EIXO_Y = new Array<OPCCODY>();
        opc.EIXO_Y_QTD = 0;
        Object.keys(element).forEach(el => {
          opc.EIXO_Y_QTD++;
          const opc_eixoY = new OPCCODY();
          if (el.startsWith('N')) {
            gradeOPCCODE.EIXO_X_NOME = 'Cilíndrico';
            opc_eixoY.EIXO = parseFloat(el.split('_')[1]) / 100 * -1;
            opc_eixoY.OPCCOD = element[el];
            if (this.globals.varsIO.LenteIO.MAISCANAIS && Math.abs(opc_eixoY.EIXO) > 2) {
              opc_eixoY.CHAVE = 2;
            }
            if (element[el]) {
              opc.EIXO_Y.push(opc_eixoY);
            }
          } else if (el.startsWith('A')) {
            gradeOPCCODE.EIXO_X_NOME = 'Adição';
            opc_eixoY.EIXO = parseFloat(el.split('_')[1]) / 100;
            opc_eixoY.OPCCOD = element[el];
            if (this.globals.varsIO.LenteIO.MAISCANAIS && Math.abs(opc_eixoY.EIXO) > 2) {
              opc_eixoY.CHAVE = 2;
            }
            if (element[el]) {
              opc.EIXO_Y.push(opc_eixoY);
            }
          } else if (el.startsWith('B')) {
            gradeOPCCODE.EIXO_X_NOME = 'Base';
            opc_eixoY.EIXO = parseFloat(el.split('_')[1]) / 100;
            opc_eixoY.OPCCOD = element[el];
            if (this.globals.varsIO.LenteIO.MAISCANAIS && Math.abs(opc_eixoY.EIXO) > 2) {
              opc_eixoY.CHAVE = 2;
            }
            if (element[el]) {
              opc.EIXO_Y.push(opc_eixoY);
            }
          }
        });
        gradeOPCCODE.EIXO_X.push(opc);
      });
      this.globals.varsIO.LenteIO.GradesOPCODE.push(gradeOPCCODE);
      this.globals.varsIO.LenteIO.GradesOPCODE.sort(function(x, y) {return (x.EXIBE === y.EXIBE) ? 0 : x ? -1 : 1; });
    });
  }

  fillPap(os_num) {
    if (this.globals.logged.Pedido_pap && this.globals.logged.Pedido_pap.length > 0) {
      this.globals.varsIO.empenhoPAP = new PedidoPAP();
      this.globals.varsIO.empenhoPAP = this.globals.logged.Pedido_pap.find(x => x.OSHTK === os_num);

      const valor = this.globals.varsIO.LenteIO.Precos.find(x => x.TIPO === this.globals.logged.Pedido_condpag.PRECO * 1 ) as Preco;

      if (this.globals.varsIO.empenhoPAP.ESQ_ESFER) {
        let i = 0;
        this.globals.varsIO.LenteIO.GradesOPCODE.forEach(grade => {
          const _val = parseFloat(this.globals.varsIO.empenhoPAP.ESQ_ESFER);
          const ii = grade.EIXO_X.findIndex(x => x.ESFERICO === _val);
          if (ii > -1) {
            this.globals.varsIO.empenhoPAP.ESQ_ESFER = i + '|' + ii;
            const _valY = parseFloat(this.globals.varsIO.empenhoPAP.ESQ_CIL);
            const iii = this.globals.varsIO.LenteIO.GradesOPCODE[i].EIXO_X[ii].EIXO_Y.findIndex(y =>
              y.EIXO === _valY);
            this.globals.varsIO.tmp_oe_cilladd_y = new Array<OPCCODY>();
            this.globals.varsIO.tmp_oe_cilladd_y = this.globals.varsIO.LenteIO.GradesOPCODE[i].EIXO_X[ii].EIXO_Y;
            this.globals.varsIO.empenhoPAP.ESQ_CIL = iii + '';

            if (this.globals.varsIO.LenteIO.GradesOPCODE[i].EIXO_X[ii].EIXO_Y[iii].CHAVE === 1) {
              this.globals.varsIO.empenhoPAP.E_VALOR = valor.CHAVE_1;
            } else {
              this.globals.varsIO.empenhoPAP.E_VALOR = valor.CHAVE_2;
            }
            this.globals.varsIO.LenteIO.valor_total_lentes =
              this.globals.varsIO.empenhoPAP.E_VALOR + this.globals.varsIO.empenhoPAP.D_VALOR;
          }
          i++;
        });
      }
      if (this.globals.varsIO.empenhoPAP.DIR_ESFER) {
        let i = 0;
        this.globals.varsIO.LenteIO.GradesOPCODE.forEach(grade => {
          const _val = parseFloat(this.globals.varsIO.empenhoPAP.DIR_ESFER);
          const ii = grade.EIXO_X.findIndex(x => x.ESFERICO === _val);
          if (ii > -1) {
            this.globals.varsIO.empenhoPAP.DIR_ESFER = i + '|' + ii;
            const _valY = parseFloat(this.globals.varsIO.empenhoPAP.DIR_CIL);
            const iii = this.globals.varsIO.LenteIO.GradesOPCODE[i].EIXO_X[ii].EIXO_Y.findIndex(y =>
              y.EIXO === _valY);
            this.globals.varsIO.tmp_od_cilladd_y = new Array<OPCCODY>();
            this.globals.varsIO.tmp_od_cilladd_y = this.globals.varsIO.LenteIO.GradesOPCODE[i].EIXO_X[ii].EIXO_Y;
            this.globals.varsIO.empenhoPAP.DIR_CIL = iii + '';

            if (this.globals.varsIO.LenteIO.GradesOPCODE[i].EIXO_X[ii].EIXO_Y[iii].CHAVE === 1) {
              this.globals.varsIO.empenhoPAP.D_VALOR = valor.CHAVE_1;
            } else {
              this.globals.varsIO.empenhoPAP.D_VALOR = valor.CHAVE_2;
            }
            this.globals.varsIO.LenteIO.valor_total_lentes =
              this.globals.varsIO.empenhoPAP.E_VALOR + this.globals.varsIO.empenhoPAP.D_VALOR;
          }
          i++;
        });
      }

      if (this.globals.varsIO.empenhoPAP.Detalhes) {
        this.globals.varsIO.papTemMontagem = true;
      } else {
        if (this.globals.varsIO.empenhoPAP.MONTAGEM === 'E') {
          this.globals.varsIO.papTemMontagem = true;
          this.getCartPAPDetalhes(this.globals.logged.Pedido_num, os_num, this.globals.varsIO.empenhoPAP);
        }
      }
    }
    console.log(this.globals.varsIO.empenhoPAP);
  }

  fillGrid(cod_pedido, cod_len) {
    this.globals.varsIO.total_lentes_check = 0;
    return this.httpClient
    .get(`${this.API_URL}carts/${cod_pedido}/grade/${cod_len}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<any>) => {
      this.globals.varsIO.LenteIO.GradesOPCODE.forEach(element => {
        element.EIXO_X.forEach(ex => {
          data.forEach(el => {
            const _ey = ex.EIXO_Y.find(x => x.OPCCOD.trim() === el.OPCCOD.trim());
            if (_ey) {
              _ey.QTD = el.QUANTIDADE;
              this.globals.varsIO.total_lentes_check += el.QUANTIDADE;
            }
          });
        });
      });
      this.atualizaTotalGrid();
      callCopyPaste();
    });
  }

  atualizaTotalGrid() {
    const valor = this.globals.varsIO.LenteIO.Precos.find(x => x.TIPO === this.globals.logged.Pedido_condpag.PRECO * 1 ) as Preco;
    this.globals.varsIO.LenteIO.total_lentes = 0;
    this.globals.varsIO.LenteIO.valor_total_lentes = 0;
    this.globals.varsIO.LenteIO.GradesOPCODE
    .forEach(x => x.EIXO_X
      .forEach(y => y.EIXO_Y
        .forEach(z => { if (z.QTD) {
          this.globals.varsIO.LenteIO.total_lentes = this.globals.varsIO.LenteIO.total_lentes * 1 + z.QTD * 1;
          if (z.CHAVE === 1) {
            this.globals.varsIO.LenteIO.valor_total_lentes = this.globals.varsIO.LenteIO.valor_total_lentes * 1 + (z.QTD * valor.CHAVE_1);
          } else {
            this.globals.varsIO.LenteIO.valor_total_lentes = this.globals.varsIO.LenteIO.valor_total_lentes * 1 + (z.QTD * valor.CHAVE_2);
          }
        }})));
  }

  fillGridHistory(cod_pedido, cod_len) {
    return this.httpClient
    .get(`${this.API_URL}orders/details/${cod_pedido}/grade/${cod_len}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<GradeGrade>) => {
      this.globals.varsIO.LenteIO.GradesOPCODE.forEach(element => {
        element.EIXO_X.forEach(ex => {
          data.forEach(el => {
            const _ey = ex.EIXO_Y.find(x => x.OPCCOD.trim() === el.OPCCODE.trim());
            if (_ey) {
              _ey.QTD = el.QUANTIDADE;
            }
          });
        });
      });
    });
  }

  getCondPag(cod_cliente) {
    return  this.httpClient
    .get(`${this.API_URL}orders/condpag`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<CondPag>) => {
      this.globals.varsIO.CondPag = new Array<CondPag>();
      this.globals.varsIO.CondPag = data;

      this.getNumPed(cod_cliente);
    });
  }

  getCartGrade(cod_pedido) {
    return this.httpClient
    .get(`${this.API_URL}carts/${cod_pedido}/grade`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<PedidoGrade>) => {
      this.globals.logged.Pedido_grade = new Array<PedidoGrade>();

      data.forEach(el => {
        let pg = new PedidoGrade();
        pg = el;
        pg.Lente = new Lente();
        pg.Lente = this.globals.logged.Lentes.find(x => x.PRODUTO.trim() === el.PRODUTO.trim());
        this.globals.logged.Pedido_grade.push(pg);
      });
    });
  }
  getCartGradeDetalhes(cod_pedido, cod_len, pedidoGrade: PedidoGrade) {
    pedidoGrade.Loading = 0;
    let req;
    req = new HttpRequest('GET', `${this.API_URL}carts/${cod_pedido}/grade/${cod_len}`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          pedidoGrade.Loading += 25;
          break;
        case HttpEventType.ResponseHeader:
          pedidoGrade.Loading += 25;
          break;
        case HttpEventType.DownloadProgress:
          pedidoGrade.Loading += 25;
          break;
        case HttpEventType.Response:
          pedidoGrade.Loading += 25;
          if (pedidoGrade.Loading > 100) {
            pedidoGrade.Loading = 100;
          }

        pedidoGrade.Detalhes = new Array<PedidoGradeDetalhes>();
        pedidoGrade.Detalhes = <Array<PedidoGradeDetalhes>>event.body;
      }
    });
  }

  getCartPAP(cod_pedido) {
    return this.httpClient
    .get(`${this.API_URL}carts/${cod_pedido}/parapar`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<PedidoPAP>) => {
      this.globals.logged.Pedido_pap = new Array<PedidoPAP>();

      data.forEach(el => {
        let pg = new PedidoPAP();
        pg = el;
        pg.Lente = new Lente();
        pg.Lente = this.globals.logged.Lentes.find(x => x.PRODUTO.trim() === el.PRODUTO.trim());
        this.globals.logged.Pedido_pap.push(pg);
      });
    });
  }
  getCartPAPDetalhes(cod_pedido, os, pedidoPAP: PedidoPAP) {
    return this.httpClient
    .get(`${this.API_URL}carts/${cod_pedido}/parapar/${os}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: Array<PedidoPAPDetalhes>) => {
        pedidoPAP.Detalhes = new PedidoPAPDetalhes();
        pedidoPAP.Detalhes = data[0];
    });
  }

  orderCancel(cod_pedido) {
    return this.httpClient
    .get(`${this.API_URL}orders/${cod_pedido}/cancel`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {}))
    .subscribe((data: any) => {
      if (data.CODERRO !== '00') {
        this.getNumPed(this.globals.logged.Company_active.A1_COD);
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  getSales(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}sales/${cod_cliente}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Representante>) => {
      this.globals.logged.Representantes = new Array<Representante>();

      data.forEach(element => {
        let _rep = new Representante();
        const _url = this.sanitizer.bypassSecurityTrustStyle(`url("${this.REPOSITORIO_URL}${element.IMAGEM}")`);
        _rep = element;
        _rep.URL = _url;
        this.globals.logged.Representantes.push(_rep);
      });
    });
  }

  getFAQ() {
    return  this.httpClient.get(`${this.API_URL}faq`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<FAQ>) => {
      this.globals.varsIO.FAQ = new Array<FAQ>();

      data.forEach(element => {
        this.globals.varsIO.FAQ.push(element);
      });
    });
  }

  getDownloads() {
    return  this.httpClient.get(`${this.API_URL}downloads`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Download>) => {
      this.globals.varsIO.Downloads = new Array<Download>();

      data.forEach(element => {
        let _down = new Download();
        const _url = this.sanitizer.bypassSecurityTrustUrl(`${this.REPOSITORIO_URL}${element.CAMINHO}`);
        _down = element;
        _down.URL = _url;
        this.globals.varsIO.Downloads.push(_down);
      });
    });
  }

  setCondPag(cod_pedido, cod_condpag) {
    return  this.httpClient
    .post(`${this.API_URL}orders/condpag/${cod_pedido}`,
    { 'cod_condpag' : cod_condpag},
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Download>) => {
      this.getCarrinho(cod_pedido);
      this.getFrete(this.globals.logged.Pedido_num, 100);
    });
  }

  removeItem(cod_pedido, cod_produto, cod_condpag) {
      return  this.httpClient.post(`${this.API_URL}empenho/grade/${cod_pedido}/${cod_produto}/${cod_condpag}`,
      {
        'pedido': []
      }, { headers: this._headers})
      .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
      }))
      .subscribe((data: Array<any>) => {
        this.getNumPed(this.globals.logged.Company_active.A1_COD);
      });
  }

  empenhaGrade(cod_pedido, cod_produto, cod_condpag, pedido: OPCCODY[], limpar = false) {
    this.globals.varsIO.LenteIO.Atendidas = true;
    this.globals.varsIO.naoAtendida = new Array<ListaFalta>();
    this.httpClient.post(`${this.API_URL}empenho/grade/${cod_pedido}/${cod_produto}/${cod_condpag}`,
    {
      'pedido': pedido
    }, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    }))
    .subscribe((data: Array<any>) => {
      if (limpar) {
        this.globals.varsIO.LenteIO.GradesOPCODE.forEach(x => {
          x.EIXO_X.forEach(y => {
            y.EIXO_Y.forEach(z => {
              z.QTD = null;
            });
          });
        });
      } else {
        this.globals.varsIO.LenteIO.Popup = true;
      }
      this.globals.varsIO.LenteIO.GradesOPCODE.forEach(element => {
        element.EIXO_X.forEach(ex => {
          ex.EIXO_Y.forEach(_ey => {
            _ey.ATENDIDA = true;
          });
          data.forEach(el => {
            this.globals.varsIO.LenteIO.Popup = false;
            const ey = ex.EIXO_Y.find(x => x.OPCCOD.trim() === el.ZZ4_OPCCOD.trim());
            if (ey) {
              ey.QTD = el.ZZ4_QTATEN;
              ey.ATENDIDA = false;
              this.globals.varsIO.LenteIO.Atendidas = false;
              ey.QTD_SOLICITADA = el.ZZ4_QTDSOL;
              const faltou = new ListaFalta();
              faltou.Grau = 'Esf. ' + ex.ESFERICO;
              if (this.globals.varsIO.LenteIO.PROGRESSIVA) {
                faltou.Grau += ', Add. ' + ey.EIXO;
              } else {
                faltou.Grau += ', Cil. ' + ey.EIXO;
              }
              faltou.QtdAtendida = el.ZZ4_QTATEN;
              faltou.QtdSolicitada = el.ZZ4_QTDSOL;
              this.globals.varsIO.naoAtendida.push(faltou);
            }
          });
        });
        this.getCarrinho(cod_pedido);
      });
      this.atualizaTotalGrid();
    });
  }

  empenhaParapar(cod_pedido, cod_produto, parOshtk, REsferico, RCilindrico, REixo, LEsferico, LCilindrico, LEixo,
  Oscliente, nome, montagem = false) {
    this.globals.varsIO.LenteIO.Atendidas = true;
    this.globals.varsIO.naoAtendida = new Array<ListaFalta>();
    let _leixo = 0; // LEixo
    let _reixo = 0; // REixo
    if (REixo) {
      _reixo = Number(REixo);
    }
    if (LEixo) {
      _leixo = Number(LEixo);
    }
    this.httpClient.post(`${this.API_URL}empenho/parapar/${cod_pedido}/${cod_produto}`,
    {
      'parOshtk': parOshtk,
      'REsferico': REsferico,
      'RCilindrico': RCilindrico,
      'REixo': _reixo,
      'LEsferico': LEsferico,
      'LCilindrico': LCilindrico,
      'LEixo': _leixo,
      'Oscliente': Oscliente,
      'nome': nome
    }, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    }))
    .subscribe((data: Array<any>) => {
      if (!montagem) {
        this.globals.varsIO.LenteIO.Popup = true;
      }
      this.globals.varsIO.LenteIO.GradesOPCODE.forEach(element => {
        element.EIXO_X.forEach(ex => {
          ex.EIXO_Y.forEach(_ey => {
            _ey.ATENDIDA = true;
          });
          data.forEach(el => {
            this.globals.varsIO.empenhoPAP.OSHTK = el.ZZ4_OSHTK;
            const ey = ex.EIXO_Y.find(x => x.OPCCOD.trim() === el.ZZ4_OPCCOD.trim());
            if (ey) {
              ey.QTD = el.ZZ4_QTATEN;
              ey.QTD_SOLICITADA = el.ZZ4_QTDSOL;
              if (ey.QTD !== ey.QTD_SOLICITADA) {
                ey.ATENDIDA = false;
                this.globals.varsIO.LenteIO.Atendidas = false;
                this.globals.varsIO.LenteIO.Popup = false;
                const faltou = new ListaFalta();
                faltou.Grau = 'Esf. ' + ex.ESFERICO;
                if (this.globals.varsIO.LenteIO.PROGRESSIVA) {
                  faltou.Grau += ', Add. ' + ey.EIXO;
                } else {
                  faltou.Grau += ', Cil. ' + ey.EIXO;
                }
                faltou.QtdAtendida = el.ZZ4_QTATEN;
                faltou.QtdSolicitada = el.ZZ4_QTDSOL;
                this.globals.varsIO.naoAtendida.push(faltou);
              }
            }
          });
        });
        this.getCarrinho(cod_pedido);
      });
      if (montagem && this.globals.varsIO.naoAtendida.length === 0) {
        this.globals.varsIO.empenhoPAP.Detalhes = new PedidoPAPDetalhes();
        this.globals.varsIO.papTemMontagem = true;
      }
      this.atualizaTotalGrid();
    });
  }

  removeItemParapar(cod_pedido, OsHtk, Produto) {
    return  this.httpClient.post(`${this.API_URL}empenho/parapar/${cod_pedido}/delete`,
    {
      'Oshtk': OsHtk,
      'Produto': Produto
    }, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    }))
    .subscribe((data: Array<any>) => {
      this.getNumPed(this.globals.logged.Company_active.A1_COD);
    });
  }

  empenhaMontagem(cod_pedido, os_htk, UID, RDNP, RALTURA, LDNP, LALTURA, Marca, Cor, Aro, Modelo, TipoAro,
  Ponte, polimento, quebracanto, Material) {
    this.globals.varsIO.LenteIO.Atendidas = true;
    this.globals.varsIO.naoAtendida = new Array<ListaFalta>();
    this.globals.varsIO.naoAtendida = new Array<ListaFalta>();

    let _polimento = 0 as number;
    if (polimento) {
      _polimento = 1;
    }
    let _RDNP: string;
    let _RALTURA: string;
    let _LDNP: string;
    let _LALTURA: string;

    !RDNP ? _RDNP = ' ' : _RDNP = RDNP;
    !RALTURA ? _RALTURA = ' ' : _RALTURA = RALTURA;
    !LDNP ? _LDNP = ' ' : _LDNP = LDNP;
    !LALTURA ? _LALTURA = ' ' : _LALTURA = LALTURA;

    this.httpClient.post(`${this.API_URL}empenho/montagem/${cod_pedido}/${os_htk}`,
    {
      'UID': UID,
      'RDNP': _RDNP,
      'RALTURA': _RALTURA,
      'LDNP': _LDNP,
      'LALTURA': _LALTURA,
      'Marca': Marca,
      'Cor': Cor,
      'Aro': Aro,
      'Modelo': Modelo,
      'TipoAro': TipoAro,
      'Ponte': Ponte,
      'polimento': _polimento,
      'quebracanto': '',
      'Material': Material
    }, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    }))
    .subscribe((data: Array<any>) => {
      console.log(data);
      this.globals.varsIO.LenteIO.Popup = true;
      // this.globals.varsIO.LenteIO.GradesOPCODE.forEach(element => {
      //   element.EIXO_X.forEach(ex => {
      //     ex.EIXO_Y.forEach(_ey => {
      //       _ey.ATENDIDA = true;
      //     });
      //     data.forEach(el => {
      //       this.globals.varsIO.LenteIO.Popup = false;
      //       const ey = ex.EIXO_Y.find(x => x.OPCCOD.trim() === el.ZZ4_OPCCOD.trim());
      //       if (ey) {
      //         ey.QTD = el.ZZ4_QTATEN;
      //         ey.ATENDIDA = false;
      //         this.globals.varsIO.LenteIO.Atendidas = false;
      //         ey.QTD_SOLICITADA = el.ZZ4_QTDSOL;
      //         const faltou = new ListaFalta();
      //         faltou.Grau = 'Esf. ' + ex.ESFERICO;
      //         if (this.globals.varsIO.LenteIO.PROGRESSIVA) {
      //           faltou.Grau += ', Add. ' + ey.EIXO;
      //         } else {
      //           faltou.Grau += ', Cil. ' + ey.EIXO;
      //         }
      //         faltou.QtdAtendida = el.ZZ4_QTATEN;
      //         faltou.QtdSolicitada = el.ZZ4_QTDSOL;
      //         this.globals.varsIO.naoAtendida.push(faltou);
      //       }
      //     });
      //   });
      //   this.getCarrinho(cod_pedido);
      // });
      // this.atualizaTotalGrid();
      return ;
    });
  }

  getFrete(cod_pedido, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    this.globals.logged.Pedido_frete = new Array<Frete>();
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/${cod_pedido}/frete`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.Response:
          this.globals.varsIO.loading_frete += loading_sum;

          this.globals.logged.Pedido_frete = <Array<Frete>>event.body;
      }
    });
    return req;
  }

  getTransportadoras(cod_cliente, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    this.globals.logged.Pedido_transps = new Array<Transportadora>();
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/${cod_cliente}/transportadoras`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.Response:
          this.globals.varsIO.loading_frete += loading_sum;

          this.globals.logged.Pedido_transps = <Array<Transportadora>>event.body;
          this.globals.logged.Pedido_transps = this.globals.logged.Pedido_transps.sort((a, b) => 0 - (a.PRINCIPAL > b.PRINCIPAL ? 1 : -1));
      }
    });
  }

  getFormasPgto(cod_cliente, loading_sum = 100) {
    loading_sum = loading_sum / 4;
    this.globals.logged.FormasPGTO = new Array<FormaPGTO>();
    let req;
    req = new HttpRequest('GET', `${this.API_URL}orders/${cod_cliente}/formapgto`, { headers: this._headers , reportProgress: true});
    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.ResponseHeader:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.DownloadProgress:
          this.globals.varsIO.loading_frete += loading_sum;
          break;
        case HttpEventType.Response:
          this.globals.varsIO.loading_frete += loading_sum;

          this.globals.logged.FormasPGTO = <Array<FormaPGTO>>event.body;
          this.globals.logged.FormasPGTO = this.globals.logged.FormasPGTO.sort((a, b) => 0 - (a.CODIGO > b.CODIGO ? -1 : 1));
      }
    });
  }

  setTransportadora(cod_pedido, cod_transp, val_frete) {
    return  this.httpClient
    .post(`${this.API_URL}orders/${cod_pedido}/transportadoras`,
    { 'CODTRANSP' : cod_transp,
      'VALFRETE' : val_frete},
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<any>) => {
      this.getFormasPgto(this.globals.logged.Pedido_num);
    });
  }

  getCEP(numero) {
    return  this.httpClient.get(`${this.API_URL}cep/${numero}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: CEP) => {
      console.log(data);

      if (data.logradouro.indexOf('-') > 0) {
        const logra = data.logradouro.split('-');
        data.logradouro = logra[0];
      }

      if (data.localidade.indexOf('/') > 0) {
        const ciduf = data.localidade.split('/');
        data.cidade = ciduf[0];
        data.uf = ciduf[1];
      }

      this.globals.varsIO.EnderecoIO.Z3_BAIRRO = data.bairro;
      this.globals.varsIO.EnderecoIO.Z3_ENDEREC = data.logradouro;
      this.globals.varsIO.EnderecoIO.Z3_MUN = data.cidade;
      this.globals.varsIO.EnderecoIO.Z3_UF = data.uf;
    });
  }

  getEnderecos(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}enderecos/${cod_cliente}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Endereco>) => {
      console.log(data);
      this.globals.logged.Enderecos = new Array<Endereco>();
      this.globals.logged.Enderecos = data;

      this.globals.logged.Enderecos.forEach(el => {
        const _end = el.Z3_ENDEREC.split(',');

        el.Z3_ENDEREC = _end[0];
        el.Z3_NUMERO = _end[1];
      });

      this.globals.varsIO.EnderecoIO = new Endereco();
      this.globals.varsIO.EnderecoIO = this.globals.logged.Enderecos.find(x => x.Z3_UTLIMO === '1');

    });
  }
  setEnderecos(cod_cliente, endereco, complemento, bairro, municipio, cep, uf, _new = false, cod_endereco = 0) {
    if (_new) {
      return  this.httpClient
        .post(`${this.API_URL}enderecos/${cod_cliente}`, {
          'ENDERECO': endereco,
          'COMPLEMENTO': complemento,
          'BAIRRO': bairro,
          'MUNICIPIO': municipio,
          'CEP': cep,
          'UF': uf
        },
        { headers: this._headers})
        .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
        })).subscribe((data: any) => {
          this.getEnderecos(this.globals.logged.Company_active.A1_COD);
        });
    } else {
      return  this.httpClient
        .put(`${this.API_URL}enderecos/${cod_cliente}/${cod_endereco}`, {
          'ENDERECO': endereco,
          'COMPLEMENTO': complemento,
          'BAIRRO': bairro,
          'MUNICIPIO': municipio,
          'CEP': cep,
          'UF': uf
        },
        { headers: this._headers})
        .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
        })).subscribe((data: any) => {
          this.getEnderecos(this.globals.logged.Company_active.A1_COD);
        });
    }
  }
  setEnderecoDefault(cod_cliente, cod_endereco) {
    return  this.httpClient
    .post(`${this.API_URL}enderecos/${cod_cliente}/default`,
    { 'COD_ENDERECO' : cod_endereco},
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: any) => {
      this.getEnderecos(this.globals.logged.Company_active.A1_COD);
    });
  }
  delEndereco(cod_cliente, cod_endereco) {
    return  this.httpClient
    .delete(`${this.API_URL}enderecos/${cod_cliente}/${cod_endereco}`,
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: any) => {
      this.getEnderecos(this.globals.logged.Company_active.A1_COD);
    });
  }

  getUsuarios(cod_cliente) {
    return  this.httpClient.get(`${this.API_URL}users/${cod_cliente}`, { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Usuario>) => {
      this.globals.logged.Usuarios = new Array<Usuario>();
      this.globals.logged.Usuarios = data;
    });
  }

  setUsuario(cod_cliente, user: Usuario, _new = false) {
    if (_new) {
      console.log(this.globals.logged.User._IDUSUARIOMASTER);
      user._IDUSUARIOMASTER = this.globals.logged.User.ID;
      return  this.httpClient
        .post(`${this.API_URL}users/${cod_cliente}`, {
          user
        },
        { headers: this._headers})
        .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
        })).subscribe((data: any) => {
          this.getUsuarios(this.globals.logged.Company_active.A1_COD);
        });
    } else {
      return  this.httpClient
        .put(`${this.API_URL}users/${cod_cliente}`, {
          user
        },
        { headers: this._headers})
        .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
        })).subscribe((data: any) => {
          this.getUsuarios(this.globals.logged.Company_active.A1_COD);
        });
    }
  }
  delUsuario(cod_usuario) {
    return  this.httpClient
    .delete(`${this.API_URL}users/${cod_usuario}`,
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: any) => {
      this.getUsuarios(this.globals.logged.Company_active.A1_COD);
    });
  }

  setFechaPedido(cod_pedido, numOs) {
    if (!numOs) {
      numOs = ' ';
    }
    return  this.httpClient
    .post(`${this.API_URL}orders/${cod_pedido}/close`,
    {
      'NUMOS' : numOs,
      'EMAIL' : this.globals.logged.User.EMAIL
    },
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: any) => {
      console.log(data);
      if (data[0].MSG === 'GRAVOUOK') {
        this.globals.varsIO.pedidoFechado = true;
      }
    });
  }

  getOtimizacao(cod_pedido, cod_frete) {
    return  this.httpClient
    .get(`${this.API_URL}orders/suggest/${cod_pedido}/${cod_frete}`,
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: Array<Otimizacao>) => {

      this.globals.varsIO.Otimizacoes = new Array<Otimizacao>();
      this.globals.varsIO.Otimizacoes = data;

      if (data && data.length > 0) {
        this.globals.varsIO.SugestaoOtimizacao = new SugereOtimizacao();
        this.globals.varsIO.SugestaoOtimizacao.SUGESTAO = data[0].ZZU_SUGERE;
        this.globals.varsIO.SugestaoOtimizacao.JAADICIONADAS = this.globals.logged.Pedido_total_lentes;
        this.globals.varsIO.SugestaoOtimizacao.TOTAL = data[0].ZZU_SUGERE + this.globals.logged.Pedido_total_lentes;

        this.globals.varsIO.SugestaoOtimizacao.PREENCHIDO =
          this.globals.varsIO.SugestaoOtimizacao.JAADICIONADAS * 100 / this.globals.varsIO.SugestaoOtimizacao.TOTAL;
      }
    });
  }

  setOtimizacao(cod_pedido, cod_frete, cod_produto, quantidade) {
    return  this.httpClient
    .post(`${this.API_URL}orders/suggest/${cod_pedido}/${cod_frete}`,
    {
      'COD_PRODUTO' : cod_produto,
      'QUANTIDADE' : quantidade
    },
    { headers: this._headers})
    .pipe(retry(this.retry_qty), catchError(this.handleError), finalize( () => {
    })).subscribe((data: any) => {
      this.getCartGrade(this.globals.logged.Pedido_num);
      this.getCartPAP(this.globals.logged.Pedido_num);
      return true;
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
