type SupplierType = 'BUSINESS' | 'INDIVIDUAL';

interface SupplierContacts {
  email?: string;
  address?: string;
  phone?: string;
  countryCode?: string;
}

interface Supplier {
  reference: string;
  name: string;
  type: SupplierType;
  productCode: string;
  supplierAgreedToLegalCompliance?: boolean;
  registrationCountry?: string;
  tradeRegisterName?: string;
  registeredBusinessNumber?: string;
  contact?: SupplierContacts;
}

export interface GetSupplierBody {
  productCodes: string[];
}

export interface GetSupplierResponse {
  suppliers: Supplier[];
}
