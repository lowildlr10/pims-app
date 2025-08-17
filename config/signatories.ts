export const SIGNATORIES_CONFIG: SignatoryDetailsFieldType[] = [
  {
    document: 'pr',
    label: 'Purchase Request Document',
    details: [
      {
        checked: false,
        label: 'Cash Availability',
        signatory_type: 'cash_availability',
        position: '',
      },
      {
        checked: false,
        label: 'Approved By',
        signatory_type: 'approved_by',
        position: '',
      },
    ],
  },
  {
    document: 'rfq',
    label: 'Request for Quotation Document',
    details: [
      {
        checked: false,
        label: 'Approval LCE',
        signatory_type: 'approval_lce',
        position: '',
      },
      {
        checked: false,
        label: 'Approval BAC',
        signatory_type: 'approval_bac',
        position: '',
      },
    ],
  },
  {
    document: 'aoq',
    label: 'Abstract of Bids or Quotation Document',
    details: [
      {
        checked: false,
        label: 'BAC-TWG Chairperson',
        signatory_type: 'twg_chairperson',
        position: '',
      },
      {
        checked: false,
        label: 'TWG Member',
        signatory_type: 'twg_member',
        position: '',
      },
      {
        checked: false,
        label: 'Chairman & Presiding Officer',
        signatory_type: 'chairman',
        position: '',
      },
      {
        checked: false,
        label: 'Vice Chairman',
        signatory_type: 'vice_chairman',
        position: '',
      },
      {
        checked: false,
        label: 'Member',
        signatory_type: 'member',
        position: '',
      },
    ],
  },
  {
    document: 'po',
    label: 'Purchase Order Document',
    details: [
      {
        checked: false,
        label: 'Authorized Official',
        signatory_type: 'authorized_official',
        position: '',
      },
    ],
  },
  {
    document: 'iar',
    label: 'Inspection and Acceptance Report Document',
    details: [
      {
        checked: false,
        label: 'Inspection',
        signatory_type: 'inspection',
        position: '',
      },
    ],
  },
  {
    document: 'obr',
    label: 'Obligation Request Document',
    details: [
      {
        checked: false,
        label: 'Budget',
        signatory_type: 'budget',
        position: '',
      },
      {
        checked: false,
        label: 'Head',
        signatory_type: 'head',
        position: '',
      },
    ],
  },
  {
    document: 'dv',
    label: 'Disbursement Vocher Document',
    details: [
      {
        checked: false,
        label: 'Accountant',
        signatory_type: 'accountant',
        position: '',
      },
      {
        checked: false,
        label: 'Treasurer',
        signatory_type: 'treasurer',
        position: '',
      },
      {
        checked: false,
        label: 'Head',
        signatory_type: 'head',
        position: '',
      },
    ],
  },
  {
    document: 'ris',
    label: 'Requisition and Issue Slip Document',
    details: [
      {
        checked: false,
        label: 'Approved By',
        signatory_type: 'approved_by',
        position: '',
      },
      {
        checked: false,
        label: 'Issued By',
        signatory_type: 'issued_by',
        position: '',
      },
    ],
  },
  {
    document: 'ics',
    label: 'Inventory Custodian Slip Document',
    details: [
      {
        checked: false,
        label: 'Received From',
        signatory_type: 'received_from',
        position: '',
      },
    ],
  },
  {
    document: 'are',
    label: 'Acknowledgement Receipt for Equipment Document',
    details: [
      {
        checked: false,
        label: 'Received From',
        signatory_type: 'received_from',
        position: '',
      },
    ],
  },
];
