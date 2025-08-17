export const PROCUREMENT_ALLOWED_PERMISSIONS = [
  'super:*',
  'head:*',
  'pr:*',
  'rfq:*',
  'aoq:*',
  'po:*',
  'iar:*',
  'obr:*',
  'dv:*',
  'pr:view',
  'rfq:view',
  'aoq:view',
  'po:view',
  'iar:view',
  'obr:view',
  'dv:view',
];

export const INVENTORY_ALLOWED_PERMISSIONS = [
  'super:*',
  'head:*',
  'inv-supply:*',
  'inv-issuance:*',
  'inv-supply:view',
  'inv-issuance:view',
];

export const PAYMENT_ALLOWED_PERMISSIONS = [
  'super:*',
  'head:*',
  'check:*',
  'deposit:*',
  'check:view',
  'deposit:view',
];

export const LIBRARY_ALLOWED_PERMISSIONS = [
  'super:*',
  'head:*',
  'lib-bid-committee:*',
  'lib-fund-source:*',
  'lib-item-class:*',
  'lib-fpp:*',
  'lib-mode-proc:*',
  'lib-paper-size:*',
  'lib-responsibility-center:*',
  'lib-signatory:*',
  'lib-supplier:*',
  'lib-account-class:*',
  'lib-account:*',
  'lib-unit-issue:*',
  'lib-bid-committee:view',
  'lib-fund-source:view',
  'lib-item-class:view',
  'lib-fpp:view',
  'lib-mode-proc:view',
  'lib-paper-size:view',
  'lib-responsibility-center:view',
  'lib-signatory:view',
  'lib-supplier:view',
  'lib-account-class:view',
  'lib-account:view',
  'lib-unit-issue:view',
];

export const USER_MANAGEMENT_ALLOWED_PERMISSIONS = [
  'super:*',
  'head:*',
  'account-department:*',
  'account-section:*',
  'account-role:*',
  'account-user:*',
  'account-department:view',
  'account-section:view',
  'account-role:view',
  'account-user:view',
];

export const COMPANY_PROFILE_ALLOWED_PERMISSIONS = [
  'super:*',
  'head:*',
  'company:*',
  'company:view',
];

export const SYSTEM_LOGS_ALLOWED_PERMISSIONS = [
  'super:*',
  'system-log:*',
  'system-log:view',
];

export const PROCUREMENT_LINKS = [
  {
    label: 'Purchase Requests',
    allowedPermissions: ['super:*', 'head:*', 'pr:*', 'pr:view'],
    link: '/procurement/pr',
  },
  {
    label: 'Request for Quotations',
    allowedPermissions: ['super:*', 'head:*', 'rfq:*', 'rfq:view'],
    link: '/procurement/rfq',
  },
  {
    label: 'Abstract of Quotations',
    allowedPermissions: ['super:*', 'head:*', 'aoq:*', 'aoq:view'],
    link: '/procurement/aoq',
  },
  {
    label: 'Purchase and Job Orders',
    allowedPermissions: ['super:*', 'head:*', 'po:*', 'po:view'],
    link: '/procurement/po',
  },
  {
    label: 'Inspection and Acceptance Report',
    allowedPermissions: ['super:*', 'head:*', 'iar:*', 'iar:view'],
    link: '/procurement/iar',
  },
  {
    label: 'Obligation Request',
    allowedPermissions: ['super:*', 'head:*', 'obr:* ', 'obr:view'],
    link: '/procurement/obr',
  },
  {
    label: 'Disbursement Voucher',
    allowedPermissions: ['super:*', 'head:*', 'dv:*', 'dv:view'],
    link: '/procurement/dv',
  },
];

export const INVENTORY_LINKS = [
  {
    label: 'Property and Supplies',
    allowedPermissions: [
      'super:*',
      'head:*',
      'inv-supply:*',
      'inv-supply:view',
    ],
    link: '/inventories/supplies',
  },
  {
    label: 'Issuances',
    allowedPermissions: [
      'super:*',
      'head:*',
      'inv-issuance:*',
      'inv-issuance:view',
    ],
    link: '/inventories/issuances',
  },
];

export const PAYMENT_LINKS = [
  // {
  //   label: 'Check',
  //   allowedPermissions: ['super:*', 'head:*', 'check:*', 'check:view'],
  //   link: '/payments/checks',
  // },
  // {
  //   label: 'Bank Deposit',
  //   allowedPermissions: ['super:*', 'head:*', 'deposit:*', 'deposit:view'],
  //   link: '/payments/deposits',
  // },
];

export const LIBRARY_LINKS = [
  {
    label: 'Account Classifications',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-account-class:*',
      'lib-account-class:view',
    ],
    link: '/settings/libraries/account-classifications',
  },
  {
    label: 'Accounts',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-account:*',
      'lib-account:view',
    ],
    link: '/settings/libraries/accounts',
  },
  {
    label: 'Bids and Awards Committees',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-bid-committee:*',
      'lib-bid-committee:view',
    ],
    link: '/settings/libraries/bids-awards-committees',
  },
  {
    label: 'Function, Program, and Projects',
    allowedPermissions: ['super:*', 'head:*', 'lib-fpp:*', 'lib-fpp:view'],
    link: '/settings/libraries/function-program-projects',
  },
  {
    label: 'Funding Sources/Projects',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-fund-source:*',
      'lib-fund-source:view',
    ],
    link: '/settings/libraries/funding-sources',
  },
  {
    label: 'Item Classifications',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-item-class:*',
      'lib-item-class:view',
    ],
    link: '/settings/libraries/item-classifications',
  },
  {
    label: 'Modes of Procurement',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-mode-proc:*',
      'lib-mode-proc:view',
    ],
    link: '/settings/libraries/modes-procurement',
  },
  {
    label: 'Print Paper Sizes',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-paper-size:*',
      'lib-paper-size:view',
    ],
    link: '/settings/libraries/paper-sizes',
  },
  {
    label: 'Responsibility Centers',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-responsibility-center:*',
      'lib-responsibility-center:view',
    ],
    link: '/settings/libraries/responsibility-centers',
  },
  {
    label: 'Signatories',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-signatory:*',
      'lib-signatory:view',
    ],
    link: '/settings/libraries/signatories',
  },
  {
    label: 'Suppliers',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-supplier:*',
      'lib-supplier:view',
    ],
    link: '/settings/libraries/suppliers',
  },
  {
    label: 'Unit of Issues',
    allowedPermissions: [
      'super:*',
      'head:*',
      'lib-unit-issue:*',
      'lib-unit-issue:view',
    ],
    link: '/settings/libraries/unit-issues',
  },
];

export const USER_MANAGEMENT_LINKS = [
  {
    label: 'Department and Sections',
    allowedPermissions: [
      'super:*',
      'head:*',
      'account-department:*',
      'account-department:view',
    ],
    link: '/settings/user-managements/departments',
  },
  {
    label: 'Roles',
    allowedPermissions: [
      'super:*',
      'head:*',
      'account-role:*',
      'account-role:view',
    ],
    link: '/settings/user-managements/roles',
  },
  {
    label: 'Users',
    allowedPermissions: [
      'super:*',
      'head:*',
      'account-user:*',
      'account-user:view',
    ],
    link: '/settings/user-managements/users',
  },
];
