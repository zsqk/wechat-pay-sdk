import { rsaSign } from '@zsqk/somefn/js/hash';
import { encodeBase64 } from '@std/encoding';

/**
 * 获取请求签名
 * @param opt
 * @returns
 */
export async function genAuth(
  opt: {
    method: string;
    path: string;
    body: string;
  },
  { keyString, mchid, rsaSN }: {
    keyString: string;
    mchid: string;
    rsaSN: string;
  },
): Promise<string> {
  const nonceStr = crypto.randomUUID().replaceAll('-', '');
  const timestamp = Date.now().toString().slice(0, -3);
  const text = genText({ ...opt, nonceStr, timestamp });
  const sign = await rsaSign({ hash: 'SHA-256', s: keyString }, text);
  return `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",`
    .concat(`nonce_str="${nonceStr}",signature="${encodeBase64(sign)}",`)
    .concat(`timestamp="${timestamp}",`)
    .concat(`serial_no="${rsaSN}"`);
}

/**
 * 拼接需要签名的字符串
 * @doc <https://pay.wechatpay.cn/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml>
 * @returns
 */
function genText({
  method,
  path,
  timestamp,
  nonceStr,
  body,
}: {
  method: string;
  path: string;
  timestamp: string;
  nonceStr: string;
  body: string;
}) {
  return `${method}
${path}
${timestamp}
${nonceStr}
${body}
`;
}
