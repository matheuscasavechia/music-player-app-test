import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private spotifyUri: string = 'https://accounts.spotify.com';
  private clientId: string = '21e20feab36a4ca899df92d09f011fea';
  private redirectUrl: string = 'http://localhost:4200/callback';
  private scopes: Array<string> = [
    "user-read-currently-playing",
    "user-read-playback-state",
  ];

  constructor(private Http: HttpClient) {
    // @to-do definir header da request

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
  }

  /**
   * access_token do usuario
   * @return {string}
   */
  private getToken(): string {
    const localToken = localStorage.getItem('access_token');
    const paramToken = this.getQueryParam('access_token', window.location.href);

    return localToken || paramToken;
  };

  /**
   * Retorna o valor do parametro desejado caso exista na URL
   * @param {string} queryParam, parametro da query string
   * @return {string} Valor do parametro
   */
  public getQueryParam(path, queryParam): string {
    const url = path.split('?');
    let token = '';
    if (url.length <= 1) {
      return token;
    }

    const urlParams = url[url.length - 1].split('&');
    for (let i = 0; i < urlParams.length; i += 1) {
      const paramValue = urlParams[i].split('=');

      if (paramValue[0] === queryParam) {
        token = paramValue[1];
      }
    }

    return token;
  }


  /**
   * Retorna a url de autenticação
   * @return {string}
   */
  private authUrl(): string {
    const params = {
        redirect_uri: `${this.redirectUrl}`,
        scope: `${this.scopes}`,
        client_id: `${this.clientId}`,
        response_type: 'token',
    };

    const queryString = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');


    return `${this.spotifyUri}/authorize?${queryString}`;
  };

  /**
   * Direciona o usuario para a tela de login
   * @return {void}
   */
  public login(): void {
    window.open(this.authUrl());
  };
}