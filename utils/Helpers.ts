import React from 'react';

export default class Helper {
  static sanitizeUrl = (url: string) => {
    return url.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
  };

  static isValidUrl = (urlString: string) => {
    try {
      // const url = new URL(urlString)

      // Additional check to exclude base64-encoded strings
      if (/^data:image\/[a-z]+;base64,/.test(urlString)) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  static formatStringHasUnderscores(str: string) {
    let result = str.replace(/_/g, ' ');
    result = result.replace(/\b\w/g, (char) => char.toUpperCase());
    return result;
  }

  static shortenText(text: string, length = 150) {
    if (text.length > length) {
      return text.slice(0, length) + '...';
    }
    return text;
  }

  static empty(value: any) {
    return (
      value === undefined ||
      value === null ||
      value === false ||
      value === 0 ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' &&
        value !== null &&
        Object.keys(value).length === 0)
    );
  }

  static formatTextWithWhitespace(text: string) {
    return text.split(/\r?\n/);
  }

  static mapInventoryIssuanceDocumentType(
    issuanceType?: InventoryIssuanceDocumentType
  ) {
    switch (issuanceType) {
      case 'ris':
        return 'Requisition and Issue Slip (RIS)';
      case 'ics':
        return 'Inventory Custodian Slip (ICS)';
      case 'are':
        return 'Acceptance and Receipt of Equipment (ARE)';
      default:
        return '';
    }
  }
}
