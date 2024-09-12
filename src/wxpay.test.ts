import { WxpaySDK } from './wxpay.ts';

const wxpay = new WxpaySDK({
  mchid: '',
  rsaSN: '',
  keyString: ``,
  apiV3KeyString: '',
  isDebug: true,
});

Deno.test({
  name: 'test-wxpay-query',
  async fn() {
    try {
      const res = await wxpay.queryByOutTradeNo('');
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  },
});
