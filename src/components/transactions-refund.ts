/**
 * 请求参数
 * @link <https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/create.html>
 */
export type RefundReqParams = {
  /**
   * 【微信支付订单号】 原支付交易对应的微信订单号，与out_trade_no二选一
   */
  transaction_id?: string;
  /**
   * 【商户订单号】 原支付交易对应的商户订单号，与transaction_id二选一
   */
  out_trade_no?: string;
  /**
   * 【商户退款单号】 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
   */
  out_refund_no: string;
  /**
   * 【退款原因】 若商户传入，会在下发给用户的退款消息中体现退款原因
   */
  reason?: string;
  /**
   * 【退款结果回调url】 异步接收微信支付退款结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。 如果参数中传了notify_url，则商户平台上配置的回调地址将不会生效，优先回调当前传的这个地址。
   */
  notify_url?: string;
  /**
   * 【退款资金来源】 若传递此参数则使用对应的资金账户退款，否则默认使用未结算资金退款（仅对老资金流商户适用）可选取值：
   */
  funds_account?: string;
  /**
   * 【金额信息】 订单金额信息
   */
  amount: {
    /** 【退款金额】 退款金额，单位为分，只能为整数，不能超过原订单支付金额。 */
    refund: number;
    /**
     * 【退款出资账户及金额】 退款需要从指定账户出资时，传递此参数指定出资金额（币种的最小单位，只能为整数）。
     *  同时指定多个账户出资退款的使用场景需要满足以下条件：1、未开通退款支出分离产品功能；2、订单属于分账订单，且分账处于待分账或分账中状态。
     *  参数传递需要满足条件：1、基本账户可用余额出资金额与基本账户不可用余额出资金额之和等于退款金额；2、账户类型不能重复。
     *  上述任一条件不满足将返回错误
     */
    from?: Array<{
      /**
       * 【出资账户类型】 出资账户类型
       *  可选取值：
       *  AVAILABLE: 可用余额
       *  UNAVAILABLE: 不可用余额
       */
      account: string;
      /** 【出资金额】 对应账户出资金额，单位为分 */
      amount: number;
    }>;
    /** 【原订单金额】 原支付交易的订单总金额，单位为分，只能为整数。 */
    total: number;
    /** 【退款币种】 符合ISO 4217标准的三位字母代码，目前只支持人民币：CNY。*/
    currency: string;
  };
  /** 【退款商品】 指定商品退款需要传此参数，其他场景无需传递 */
  goods_detail?: Array<{
    /** 【商户侧商品编码】 商品编码，由半角的大小写字母、数字、中划线、下划线中的一种或几种组成。 */
    merchant_goods_id: string;
    /** 【微信侧商品编码】 微信支付定义的统一商品编号（没有可不传） */
    wechatpay_goods_id?: string;
    /** 【商品名称】 商品的实际名称 */
    goods_name?: string;
    /** 【商品单价】 商品单价金额，单位为分 */
    unit_price: number;
    /** 【商品退款金额】 商品退款金额，单位为分 */
    refund_amount: number;
    /** 【商品退货数量】 对应商品的退货数量 */
    refund_quantity: number;
  }>;
};

export type RefundRes = {
  refund_id: string;
  out_refund_no: string;
  transaction_id: string;
  out_trade_no: string;
  channel: string;
  user_received_account: string;
  success_time?: string;
  create_time: string;
  status: string;
  funds_account?: string;
  amount: {
    total: number;
    refund: number;
    from?: [
      {
        account: string;
        amount: number;
      },
    ];
    payer_total: number;
    payer_refund: number;
    settlement_refund: number;
    settlement_total: number;
    discount_refund: number;
    currency: string;
    refund_fee?: number;
  };
  promotion_detail?: [
    {
      promotion_id: string;
      scope: string;
      type: string;
      amount: number;
      refund_amount: number;
      goods_detail?: [
        {
          merchant_goods_id: string;
          wechatpay_goods_id?: number;
          goods_name?: string;
          unit_price: number;
          refund_amount: number;
          refund_quantity: number;
        },
      ];
    },
  ];
};
