export const PERMISSIONS_CONFIG: PermissionsFieldType[] = [
  {
    label: 'Purchase Request',
    description: 'Scope for Purchase Request module',
    module_type: 'pr',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
      {
        label: 'Approve for Cash Availability',
        value: 'approve-cash-available',
        checked: false,
      },
      {
        label: 'Approve',
        value: 'approve',
        checked: false,
      },
      {
        label: 'Disapprove',
        value: 'disapprove',
        checked: false,
      },
      {
        label: 'Approve Request for Quotations',
        value: 'approve-rfq',
        checked: false,
      },
      {
        label: 'Award',
        value: 'award-aoq',
        checked: false,
      },
      {
        label: 'Cancel',
        value: 'cancel',
        checked: false,
      },
      {
        label: 'Submit',
        value: 'submit',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },

  {
    label: 'Request for Quotation',
    description: 'Scope for Request for Quotation module',
    module_type: 'rfq',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
      {
        label: 'Approve',
        value: 'approve',
        checked: false,
      },
      {
        label: 'Issue for Canvassing',
        value: 'issue',
        checked: false,
      },
      {
        label: 'Canvass Completed',
        value: 'complete',
        checked: false,
      },
      {
        label: 'Cancel',
        value: 'cancel',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Abstract of Quotation',
    description: 'Scope for Abstract of Quotation module',
    module_type: 'aoq',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
      {
        label: 'Set to Pending',
        value: 'pending',
        checked: false,
      },
      {
        label: 'Approve',
        value: 'approve',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Purchase Order',
    description: 'Scope for Purchase Order module',
    module_type: 'po',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
      {
        label: 'Set to Pending',
        value: 'pending',
        checked: false,
      },
      {
        label: 'Approve',
        value: 'approve',
        checked: false,
      },
      {
        label: 'Issue to Supplier',
        value: 'issue',
        checked: false,
      },
      {
        label: 'Receive PO/JO (For Delivery)',
        value: 'receive',
        checked: false,
      },
      {
        label: 'Set to "Delivered"',
        value: 'delivered',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Inspection & Acceptance Report',
    description: 'Scope for Inspection & Acceptance Report module',
    module_type: 'iar',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
      {
        label: 'Pending for Inspection',
        value: 'pending',
        checked: false,
      },
      {
        label: 'Inspect',
        value: 'inspect',
        checked: false,
      },
      {
        label: 'Acceptance',
        value: 'accept',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Obligation Request & Status',
    description: 'Scope for Obligation Request & Status module',
    module_type: 'ors',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Disbursement Voucher',
    description: 'Scope for Disbursement Voucher module',
    module_type: 'dv',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Inventory Supply',
    description: 'Scope for Inventory Supply module',
    module_type: 'inv-supply',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Inventory Issuance',
    description: 'Scope for Inventory Issuance module',
    module_type: 'inv-issuance',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
      {
        label: 'Issue',
        value: 'issue',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },
  {
    label: 'Payment',
    description: 'Scope for Payment module',
    module_type: 'payment',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Print',
        value: 'print',
        checked: false,
      },
    ],
  },

  // Account management
  {
    label: 'Division Library',
    description: 'Scope for Division Library module',
    module_type: 'account-division',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Section Library',
    description: 'Scope for Section Library module',
    module_type: 'account-section',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'User Management',
    description: 'Scope for User Library module',
    module_type: 'account-user',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },

  // System libraries
  {
    label: 'Funding Source Library',
    description: 'Scope for Funding Source Library module',
    module_type: 'lib-fund-source',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Item Classification Library',
    description: 'Scope for Item Classification Library module',
    module_type: 'lib-item-class',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'MFO/PAP Library',
    description: 'Scope for MFO/PAP Library module',
    module_type: 'lib-mfo-pap',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Mode of Procurement Library',
    description: 'Scope for Mode of Procurement Library module',
    module_type: 'lib-mode-proc',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Print Paper Size Library',
    description: 'Scope for Print Paper Size Library module',
    module_type: 'lib-paper-size',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Signatory Library',
    description: 'Scope for Signatory Library module',
    module_type: 'lib-signatory',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Supplier/Company Library',
    description: 'Scope for Supplier/Company Library module',
    module_type: 'lib-supplier',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'UACS Code Classification Library',
    description: 'Scope for UACS Code Classification Library module',
    module_type: 'lib-uacs-class',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'UACS Code Library',
    description: 'Scope for UACS Code Library module',
    module_type: 'lib-uacs-code',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'Unit of Issue Library',
    description: 'Scope for Unit of Issue Library module',
    module_type: 'lib-unit-issue',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
      {
        label: 'Create',
        value: 'create',
        checked: false,
      },
      {
        label: 'Update',
        value: 'update',
        checked: false,
      },
    ],
  },
  {
    label: 'System Logs',
    description: 'Scope for System Logs module',
    module_type: 'system-log',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'View',
        value: 'view',
        checked: false,
      },
    ],
  },

  // Specific roles
  {
    label: 'Administrator',
    description: 'Scope for Administrator role',
    module_type: 'super',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
  {
    label: 'Agency Head',
    description: 'Scope for Agency Head role',
    module_type: 'head',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
  {
    label: 'Supply Officer',
    description: 'Scope for Supply Officer role',
    module_type: 'supply',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
  {
    label: 'Budget Officer',
    description: 'Scope for Budget Officer role',
    module_type: 'budget',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
  {
    label: 'Accounting',
    description: 'Scope for Accounting role',
    module_type: 'accounting',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
  {
    label: 'Cashier',
    description: 'Scope for Cashier role',
    module_type: 'cashier',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
  {
    label: 'End User',
    description: 'Scope for End User role',
    module_type: 'user',
    checked: false,
    indeterminate: false,
    scopes: [
      {
        label: 'All',
        value: '*',
        checked: false,
      },
    ],
  },
];
