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
};
