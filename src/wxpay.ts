import { genAuth } from './common/gen-auth.ts';
import { assertArray, assertUnknownObject } from '@zsqk/somefn/ts/object';
import { genAesKey } from '@zsqk/somefn/js/aes';

import {
  assertCertificate,
  Certificate,
  decryptCertificate,
} from './components/get-certificates.ts';
import {
  PrepayReqParams,
  PrepayRes,
} from './components/transactions-prepay.ts';
import { PayDetailRes } from './components/transactions-get.ts';
import {
  RefundReqParams,
  RefundRes,
} from './components/transactions-refund.ts';

export class WxpaySDK {
  /** 商户号 */
  readonly mchid: string;

  /** RSA 密钥序列号 */
  private readonly rsaSN: string;

  /** 微信支付接入点 */
  private readonly endpoint: string;

  /** RSA 密钥, 保密 */
  private readonly keyString: string;

  /**
   * API V3 密钥
   */
  private readonly apiV3Key?: Promise<CryptoKey>;

  isDebug = false;

  constructor(
    { mchid, rsaSN, endpoint, keyString, apiV3KeyString, isDebug }: {
      mchid: string;
      rsaSN: string;
      keyString: string;
      endpoint?: string;
      apiV3KeyString?: string;
      isDebug?: boolean;
    },
  ) {
    this.mchid = mchid;
    this.rsaSN = rsaSN;
    this.keyString = keyString;
    this.endpoint = endpoint ?? 'https://api.mch.weixin.qq.com';
    if (isDebug !== undefined) {
      this.isDebug = isDebug;
    }
    if (apiV3KeyString !== undefined) {
      this.apiV3Key = genAesKey(
        'AES-GCM',
        new TextEncoder().encode(apiV3KeyString),
      ).then(([key]) => key);
    }
  }

  private genAuth(opt: {
    method: string;
    path: string;
    body: string;
  }): Promise<string> {
    return genAuth(opt, {
      keyString: this.keyString,
      mchid: this.mchid,
      rsaSN: this.rsaSN,
    });
  }

  private log(...data: unknown[]): void {
    if (this.isDebug) {
      console.log(...data);
    }
  }

  async request({
    method,
    path,
    body,
    headers,
  }: {
    method: 'POST' | 'GET';
    path: string;
    body?: unknown;
    headers?: Record<string, string>;
  }): Promise<unknown> {
    const bodyStr = JSON.stringify(body);
    const ua = 'zsqk-z1 0.0.1';
    const requestInit: RequestInit = body
      ? {
        method,
        headers: {
          'User-Agent': ua,
          ...headers,
          Authorization: await this.genAuth({ method, path, body: bodyStr }),
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': 'zh-CN',
        },
        body: bodyStr,
      }
      : {
        method,
        headers: {
          'User-Agent': ua,
          ...headers,
          Authorization: await this.genAuth({ method, path, body: '' }),
          Accept: 'application/json',
          'Accept-Language': 'zh-CN',
        },
      };
    const res = await fetch(`${this.endpoint}${path}`, requestInit);

    const text = await res.text();

    if (res.status >= 300) {
      if (res.headers.get('Content-Type') === 'application/json') {
        throw new Error(text);
      }
      throw new Error(`${res.status} ${text}`);
    }

    this.log('res.headers', res.headers);
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      return JSON.parse(text);
    }
    return text;
  }

  /**
   * 微信支付调起 JSAPI下单
   * @link <https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/direct-jsons/jsapi-prepay.html>
   * @param p
   * @returns
   */
  public async prepay(p: PrepayReqParams): Promise<PrepayRes> {
    const res = await this.request({
      method: 'POST',
      path: '/v3/pay/transactions/jsapi',
      body: p,
    });
    if (typeof res !== 'string') {
      throw new Error('请求有误!');
    }
    const { prepay_id } = JSON.parse(res);
    return { prepay_id };
  }

  /**
   * 微信支付订单号查询订单
   * @link <https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/query-by-wx-trade-no.html>
   * @param transaction_id
   * @returns
   */
  public async queryByID(transaction_id: string): Promise<PayDetailRes> {
    const p = new URLSearchParams();
    p.set('mchid', this.mchid);
    const res = await this.request({
      method: 'GET',
      path: `/v3/pay/transactions/id/${transaction_id}?${p}`,
    });
    if (typeof res !== 'string') {
      throw new Error('请求有误!');
    }
    const result = JSON.parse(res);
    return result;
  }

  /**
   * 商户订单号查询订单
   * @link <https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/query-by-out-trade-no.html>
   * @param out_trade_no
   * @returns
   */
  public async queryByOutTradeNo(
    out_trade_no: string,
  ): Promise<PayDetailRes> {
    const p = new URLSearchParams();
    p.set('mchid', this.mchid);
    const res = await this.request({
      method: 'GET',
      path: `/v3/pay/transactions/out-trade-no/${out_trade_no}?${p}`,
    });
    if (typeof res !== 'string') {
      throw new Error('请求有误!');
    }
    const result = JSON.parse(res);
    return result;
  }

  /**
   * 微信支付-退款申请
   * @link <https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/create.html>
   * @param p
   * @returns
   */
  public async refunds(p: RefundReqParams): Promise<RefundRes> {
    const res = await this.request({
      method: 'POST',
      path: '/v3/refund/domestic/refunds',
      body: p,
    });
    if (typeof res === 'string') {
      return JSON.parse(res);
    }
    return res as RefundRes;
  }
  /**
   * 获取平台证书
   * 接口的频率限制: 单个商户号1000 次/s
   * @link <https://pay.weixin.qq.com/docs/merchant/apis/platform-certificate/api-v3-get-certificates/get.html>
   * @returns
   */
  public async getCertificates(): Promise<
    Array<
      Omit<Certificate, 'encrypt_certificate'> & {
        /** 解密后的证书原文 */
        certificate: string;
      }
    >
  > {
    if (!this.apiV3Key) {
      throw new Error('apiV3Key is not set');
    }
    const res = await this.request({ method: 'GET', path: '/v3/certificates' });
    assertUnknownObject(res);
    assertArray(res.data);
    const apiV3Key = await this.apiV3Key;
    return Promise.all(res.data.map(async (v) => {
      assertCertificate(v);
      const { encrypt_certificate, ...rest } = v;
      return {
        certificate: await decryptCertificate(apiV3Key, encrypt_certificate),
        ...rest,
      };
    }));
  }
}
