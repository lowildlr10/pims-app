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
        label: 'Approval',
        signatory_type: 'approval',
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
    label: 'Purchase/Job Order Document',
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
      {
        checked: false,
        label: 'Acceptance',
        signatory_type: 'acceptance',
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
