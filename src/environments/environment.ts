// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  apiUrl: 'https://www.digitalbaseas.com/api/',
  // 医护工作者对应的角色值
  healthCareWorkerRoles: [
    'nurse',
    'physicalTherapist',
    'caseManager',
    'marketOperator',
    'provider'
  ],
  STATUS: {
    err_pay: '支付错误',
    err_refund: '退款错误',
    err_transfer: '企业付款错误',
    prepay: '统一下单',
    paid: '支付成功',
    refund: '申请退款',
    refunded: '退款成功',
    reverse: '撤消订单',
    close: '关闭订单',
    transfered: '企业付款成功'
  },
  CODE: {
    err_pay: -1,
    err_refund: -2,
    err_transfer: -3,
    prepay: 1,
    paid: 2,
    refund: 3,
    refunded: 4,
    reverse: 5,
    close: 6,
    transfered: 7
  }
};
export const environmentProd = {
  production: true,
  apiUrl: 'https://www.digitalbaseas.com/api/',
  // 医护工作者对应的角色值
  healthCareWorkerRoles: [
    'nurse',
    'physicalTherapist',
    'caseManager',
    'marketOperator',
    'provider'
  ],
  STATUS: {
    err_pay: '支付错误',
    err_refund: '退款错误',
    err_transfer: '企业付款错误',
    prepay: '统一下单',
    paid: '支付成功',
    refund: '申请退款',
    refunded: '退款成功',
    reverse: '撤消订单',
    close: '关闭订单',
    transfered: '企业付款成功'
  },
  CODE: {
    err_pay: -1,
    err_refund: -2,
    err_transfer: -3,
    prepay: 1,
    paid: 2,
    refund: 3,
    refunded: 4,
    reverse: 5,
    close: 6,
    transfered: 7
  }
};
