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
  /** 【微信支付退款号】 微信支付退款号 */
  refund_id: string;
  /** 【商户退款单号】 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。 */
  out_refund_no: string;
  /** 【微信支付订单号】 微信支付交易订单号 */
  transaction_id: string;
  /** 【商户订单号】 原支付交易对应的商户订单号 */
  out_trade_no: string;
  /** 【退款渠道】 退款渠道
   * 可选取值：
   * ORIGINAL: 原路退款
   * BALANCE: 退回到余额
   * OTHER_BALANCE: 原账户异常退到其他余额账户
   * OTHER_BANKCARD: 原银行卡异常退到其他银行卡 */
  channel: string;
  /** 【退款入账账户】 取当前退款单的退款入账方，有以下几种情况：
   * 1）退回银行卡：{银行名称}{卡类型}{卡尾号}
   * 2）退回支付用户零钱:支付用户零钱
   * 3）退还商户:商户基本账户商户结算银行账户
   * 4）退回支付用户零钱通:支付用户零钱通
   * 5）退回支付用户银行电子账户:支付用户银行电子账户
   * 6）退回支付用户零花钱:支付用户零花钱
   * 7）退回用户经营账户:用户经营账户
   * 8）退回支付用户来华零钱包:支付用户来华零钱包
   * 9）退回企业支付商户:企业支付商户 */
  user_received_account: string;
  /** 【退款成功时间】 退款成功时间，退款状态status为SUCCESS（退款成功）时，返回该字段。遵循rfc3339标准格式，格式为YYYY-MM-DDTHH:mm:ss+TIMEZONE，YYYY-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC 8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日13点29分35秒。 */
  success_time?: string;
  /** 【退款创建时间】 退款受理时间，遵循rfc3339标准格式，格式为YYYY-MM-DDTHH:mm:ss+TIMEZONE，YYYY-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC 8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日13点29分35秒。 */
  create_time: string;
  /** 【退款状态】 退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，可前往商户平台（pay.weixin.qq.com）-交易中心，手动处理此笔退款。
   * 可选取值：
   * SUCCESS: 退款成功
   * CLOSED: 退款关闭
   * PROCESSING: 退款处理中
   * ABNORMAL: 退款异常 */
  status: string;
  /** 【资金账户】 退款所使用资金对应的资金账户类型
   * 可选取值：
   * UNSETTLED: 未结算资金
   * AVAILABLE: 可用余额
   * UNAVAILABLE: 不可用余额
   * OPERATION: 运营户
   * BASIC: 基本账户（含可用余额和不可用余额）
   * ECNY_BASIC: 数字人民币基本账户 */
  funds_account?: string;
  /** 【金额信息】 金额详细信息 */
  amount: {
    /** 【订单金额】 订单总金额，单位为分 */
    total: number;
    /** 【退款金额】 退款标价金额，单位为分，可以做部分退款 */
    refund: number;
    /** 【退款出资账户及金额】 退款出资的账户类型及金额信息 */
    from?: [
      {
        /** 【出资账户类型】 出资账户类型
         * 可选取值：
         * AVAILABLE: 可用余额
         * UNAVAILABLE: 不可用余额 */
        account: string;
        /** 【出资金额】 对应账户出资金额，单位为分 */
        amount: number;
      },
    ];
    /** 【用户支付金额】 现金支付金额，单位为分，只能为整数 */
    payer_total: number;
    /** 【用户退款金额】 退款给用户的金额，单位为分，不包含所有优惠券金额 */
    payer_refund: number;
    /** 【应结退款金额】 去掉非充值代金券退款金额后的退款金额，单位为分，退款金额=申请退款金额-非充值代金券退款金额，退款金额<=申请退款金额 */
    settlement_refund: number;
    /** 【应结订单金额】 应结订单金额=订单金额-免充值代金券金额，应结订单金额<=订单金额，单位为分 */
    settlement_total: number;
    /** 【优惠退款金额】 优惠退款金额<=退款金额，退款金额-代金券或立减优惠退款金额为现金，说明详见代金券或立减优惠，单位为分 */
    discount_refund: number;
    /** 【退款币种】 符合ISO 4217标准的三位字母代码，目前只支持人民币：CNY。 */
    currency: string;
    /** 【手续费退款金额】 手续费退款金额，单位为分 */
    refund_fee?: number;
  };
  /** 【优惠退款信息】 优惠退款信息 */
  promotion_detail?: [
    {
      /** 【券ID】 券或者立减优惠id */
      promotion_id: string;
      /**
       * 【优惠范围】 优惠范围
       * 可选取值：
       * GLOBAL: 全场优惠类型
       * SINGLE: 单品优惠类型
       */
      scope: string;
      /**
       * 【优惠类型】 优惠类型
       * 可选取值：
       * COUPON: 代金券类型，需要走结算资金的充值型代金券
       * DISCOUNT: 优惠券类型，不走结算资金的免充值型优惠券
       */
      type: string;
      /**
       * 【优惠券面额】 用户享受优惠的金额（优惠券面额=微信出资金额+商家出资金额+其他出资方金额 ），单位为分
       */
      amount: number;
      /** 【优惠退款金额】 优惠退款金额<=退款金额，退款金额-代金券或立减优惠退款金额为用户支付的现金，说明详见代金券或立减优惠，单位为分 */
      refund_amount: number;
      /** 【商品列表】 优惠商品发生退款时返回商品信息 */
      goods_detail?: [
        {
          /** 【商户侧商品编码】 商品编码，由半角的大小写字母、数字、中划线、下划线中的一种或几种组成。 */
          merchant_goods_id: string;
          /** 【微信侧商品编码】 微信支付定义的统一商品编号（没有可不传） */
          wechatpay_goods_id?: number;
          /** 【商品名称】 商品的实际名称 */
          goods_name?: string;
          /** 【商品单价】 商品单价金额，单位为分 */
          unit_price: number;
          /** 【商品退款金额】 商品退款金额，单位为分 */
          refund_amount: number;
          /** 【商品退货数量】 对应商品的退货数量 */
          refund_quantity: number;
        },
      ];
    },
  ];
};
