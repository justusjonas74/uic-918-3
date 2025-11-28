export interface GeoCoordinate {
  geoUnit?: string;
  coordinateSystem?: string;
  hemisphereLongitude?: string;
  hemisphereLatitude?: string;
  longitude?: number;
  latitude?: number;
  accuracy?: string | number;
}

export interface IssuingDetail {
  securityProviderNum?: number;
  securityProviderIA5?: string;
  issuerNum?: number;
  issuerIA5?: string;
  issuingYear: number;
  issuingDay: number;
  issuingTime: number;
  issuerName?: string;
  specimen?: boolean;
  securePaperTicket?: boolean;
  activated?: boolean;
  currency?: string;
  currencyFract?: number;
  issuerPNR?: string;
  extension?: Record<string, unknown>;
  issuedOnTrainNum?: number;
  issuedOnTrainIA5?: string;
  issuedOnLine?: number;
  pointOfSale?: GeoCoordinate;
}

export interface TravelerStatus {
  statusProviderNum?: number;
  statusProviderIA5?: string;
  customerStatus?: number;
  customerStatusDescr?: string;
}

export interface Traveler {
  firstName?: string;
  secondName?: string;
  lastName?: string;
  idCard?: string;
  passportId?: string;
  title?: string;
  gender?: string;
  customerIdIA5?: string;
  customerIdNum?: number;
  yearOfBirth?: number;
  monthOfBirth?: number;
  dayOfBirthInMonth?: number;
  ticketHolder?: boolean;
  passengerType?: string;
  passengerWithReducedMobility?: boolean;
  countryOfResidence?: number;
  countryOfPassport?: number;
  countryOfIdCard?: number;
  status?: TravelerStatus[];
}

export interface TravelerDetail {
  traveler?: Traveler[];
  preferredLanguage?: string;
  groupName?: string;
}

export interface ControlDetail {
  identificationByCardReference?: Record<string, unknown>[];
  identificationByIdCard?: boolean;
  identificationByPassportId?: boolean;
  identificationItem?: number;
  passportValidationRequired?: boolean;
  onlineValidationRequired?: boolean;
  randomDetailedValidationRequired?: number;
  ageCheckRequired?: boolean;
  reductionCardCheckRequired?: boolean;
  infoText?: string;
  includedTickets?: Record<string, unknown>[];
  extension?: Record<string, unknown>;
}

export interface TransportDocument {
  token?: Record<string, unknown>;
  ticket?: {
    reservation?: Record<string, unknown>;
    carCarriageReservation?: Record<string, unknown>;
    openTicket?: Record<string, unknown>;
    pass?: Record<string, unknown>;
    voucher?: Record<string, unknown>;
    customerCard?: Record<string, unknown>;
    counterMark?: Record<string, unknown>;
    parkingGround?: Record<string, unknown>;
    fipTicket?: Record<string, unknown>;
    stationPassage?: Record<string, unknown>;
    extension?: Record<string, unknown>;
    delayConfirmation?: Record<string, unknown>;
  };
}

export interface UFLEXTicket {
  issuingDetail: IssuingDetail;
  travelerDetail?: TravelerDetail;
  transportDocument?: TransportDocument[];
  controlDetail?: ControlDetail;
  extension?: Record<string, unknown>[];
  raw: Record<string, unknown>;
}
