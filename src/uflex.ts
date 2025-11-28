import { parseStringPromise } from 'xml2js';

import type {
  ControlDetail,
  IssuingDetail,
  Traveler,
  TravelerDetail,
  TravelerStatus,
  TransportDocument,
  UFLEXTicket
} from './types/UFLEXTicket.js';

type JsonRecord = Record<string, unknown>;

type EmscriptenCwrap = (ident: string, returnType: string | null, argTypes: string[]) => (...args: number[]) => number;

type UFlexModule = {
  cwrap: EmscriptenCwrap;
  lengthBytesUTF8: (value: string) => number;
  stringToUTF8: (value: string, ptr: number, maxBytesToWrite: number) => void;
  UTF8ToString: (ptr: number) => string;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
};

type WasmDecoder = {
  decode: (pointer: number, length: number) => number;
  readError: () => number;
  release: (pointer: number) => void;
};

type ModuleFactory = () => Promise<UFlexModule>;

let modulePromise: Promise<UFlexModule> | null = null;
let moduleFactoryOverride: ModuleFactory | null = null;

export function __setUFlexModuleFactory(factory: ModuleFactory | null): void {
  moduleFactoryOverride = factory;
  modulePromise = null;
}

async function resolveFactory(): Promise<ModuleFactory> {
  if (moduleFactoryOverride) {
    return moduleFactoryOverride;
  }

  const factoryModule = await import('../wasm/u_flex_decoder.js');
  const factory = factoryModule?.default as ((opts?: Record<string, unknown>) => Promise<UFlexModule>) | undefined;
  if (!factory) {
    throw new Error('WASM-Decoder-Datei wurde nicht gebaut. Bitte "npm run build:uflex-wasm" ausführen.');
  }

  return () => factory();
}

async function loadModule(): Promise<UFlexModule> {
  if (!modulePromise) {
    const factory = await resolveFactory();
    modulePromise = factory();
  }
  return modulePromise;
}

function createDecoder(module: UFlexModule): WasmDecoder {
  const decode = module.cwrap('decode_uflex', 'number', ['number', 'number']);
  const readError = module.cwrap('uflex_last_error', 'number', []);
  const release = module.cwrap('free_buffer', null, ['number']);
  return { decode, readError, release };
}

const XML_PARSE_OPTIONS = {
  explicitArray: false,
  explicitRoot: true,
  trim: true
} as const;

function unwrapValue<T>(value: T | T[] | undefined | null): T | undefined {
  if (Array.isArray(value)) {
    return value.length > 0 ? unwrapValue(value[0]) : undefined;
  }
  return value === undefined || value === null ? undefined : value;
}

function toArray(value: unknown): unknown[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return Array.isArray(value) ? value : [value];
}

function ensureRecord(value: unknown, context: string): JsonRecord {
  const target = unwrapValue(value);
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    throw new Error(`UFLEX: Erwartetes Objekt für ${context} fehlt.`);
  }
  return target as JsonRecord;
}

function asNumber(value: unknown): number | undefined {
  const target = unwrapValue(value);
  if (typeof target === 'number') {
    return target;
  }
  if (typeof target === 'string') {
    const trimmed = target.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  const target = unwrapValue(value);
  if (typeof target === 'boolean') {
    return target;
  }
  if (typeof target === 'string') {
    const normalized = target.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') {
      return true;
    }
    if (normalized === 'false' || normalized === '0') {
      return false;
    }
  }
  return undefined;
}

function asString(value: unknown): string | undefined {
  const target = unwrapValue(value);
  return typeof target === 'string' ? target : undefined;
}

function toRecordArray(value: unknown, context: string): JsonRecord[] | undefined {
  const entries = toArray(value);
  if (!entries) {
    return undefined;
  }
  return entries.map((entry) => ensureRecord(entry, context));
}

function coercePrimitive(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed.length) {
    return '';
  }
  if (trimmed.toLowerCase() === 'true') {
    return true;
  }
  if (trimmed.toLowerCase() === 'false') {
    return false;
  }
  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  return trimmed;
}

function normalizeXmlTree(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeXmlTree(entry));
  }
  if (value && typeof value === 'object') {
    const record = value as JsonRecord;
    const normalized: JsonRecord = {};
    for (const [key, entry] of Object.entries(record)) {
      normalized[key] = normalizeXmlTree(entry);
    }
    return normalized;
  }
  return coercePrimitive(value);
}

async function parseXerPayload(xmlPayload: string): Promise<JsonRecord> {
  try {
    const parsed = await parseStringPromise(xmlPayload, XML_PARSE_OPTIONS);
    const root = normalizeXmlTree(parsed?.UicRailTicketData ?? parsed);
    return ensureRecord(root, 'UicRailTicketData');
  } catch (error) {
    throw new Error(`UFLEX: XML-Parsing fehlgeschlagen: ${(error as Error).message}`);
  }
}

function mapIssuingDetail(value: JsonRecord): IssuingDetail {
  return {
    securityProviderNum: asNumber(value.securityProviderNum),
    securityProviderIA5: asString(value.securityProviderIA5),
    issuerNum: asNumber(value.issuerNum),
    issuerIA5: asString(value.issuerIA5),
    issuingYear: asNumber(value.issuingYear) ?? 0,
    issuingDay: asNumber(value.issuingDay) ?? 0,
    issuingTime: asNumber(value.issuingTime) ?? 0,
    issuerName: asString(value.issuerName),
    specimen: asBoolean(value.specimen),
    securePaperTicket: asBoolean(value.securePaperTicket),
    activated: asBoolean(value.activated),
    currency: asString(value.currency),
    currencyFract: asNumber(value.currencyFract),
    issuerPNR: asString(value.issuerPNR),
    extension: value.extension && ensureRecord(value.extension, 'issuingDetail.extension'),
    issuedOnTrainNum: asNumber(value.issuedOnTrainNum),
    issuedOnTrainIA5: asString(value.issuedOnTrainIA5),
    issuedOnLine: asNumber(value.issuedOnLine),
    pointOfSale: value.pointOfSale && ensureRecord(value.pointOfSale, 'issuingDetail.pointOfSale')
  };
}

function mapTraveler(value: unknown): Traveler {
  const record = ensureRecord(value, 'traveler');
  const statusEntries = toRecordArray(record.status, 'traveler.status');
  return {
    firstName: asString(record.firstName),
    secondName: asString(record.secondName),
    lastName: asString(record.lastName),
    idCard: asString(record.idCard),
    passportId: asString(record.passportId),
    title: asString(record.title),
    gender: asString(record.gender),
    customerIdIA5: asString(record.customerIdIA5),
    customerIdNum: asNumber(record.customerIdNum),
    yearOfBirth: asNumber(record.yearOfBirth),
    monthOfBirth: asNumber(record.monthOfBirth),
    dayOfBirthInMonth: asNumber(record.dayOfBirthInMonth),
    ticketHolder: asBoolean(record.ticketHolder),
    passengerType: asString(record.passengerType),
    passengerWithReducedMobility: asBoolean(record.passengerWithReducedMobility),
    countryOfResidence: asNumber(record.countryOfResidence),
    countryOfPassport: asNumber(record.countryOfPassport),
    countryOfIdCard: asNumber(record.countryOfIdCard),
    status: statusEntries ? statusEntries.map(mapTravelerStatus) : undefined
  };
}

function mapTravelerStatus(value: unknown): TravelerStatus {
  const record = ensureRecord(value, 'traveler.status');
  return {
    statusProviderNum: asNumber(record.statusProviderNum),
    statusProviderIA5: asString(record.statusProviderIA5),
    customerStatus: asNumber(record.customerStatus),
    customerStatusDescr: asString(record.customerStatusDescr)
  };
}

function mapTravelerDetail(value: JsonRecord): TravelerDetail {
  const travelerEntries = toArray(value.traveler);
  return {
    traveler: travelerEntries ? travelerEntries.map(mapTraveler) : undefined,
    preferredLanguage: asString(value.preferredLanguage),
    groupName: asString(value.groupName)
  };
}

function mapControlDetail(value: JsonRecord): ControlDetail {
  const cardRefs = toRecordArray(value.identificationByCardReference, 'controlDetail.identificationByCardReference');
  const includedTickets = toRecordArray(value.includedTickets, 'controlDetail.includedTickets');
  return {
    identificationByCardReference: cardRefs,
    identificationByIdCard: asBoolean(value.identificationByIdCard),
    identificationByPassportId: asBoolean(value.identificationByPassportId),
    identificationItem: asNumber(value.identificationItem),
    passportValidationRequired: asBoolean(value.passportValidationRequired),
    onlineValidationRequired: asBoolean(value.onlineValidationRequired),
    randomDetailedValidationRequired: asNumber(value.randomDetailedValidationRequired),
    ageCheckRequired: asBoolean(value.ageCheckRequired),
    reductionCardCheckRequired: asBoolean(value.reductionCardCheckRequired),
    infoText: asString(value.infoText),
    includedTickets,
    extension: value.extension && ensureRecord(value.extension, 'controlDetail.extension')
  };
}

function mapTransportDocument(value: unknown): TransportDocument {
  const record = ensureRecord(value, 'transportDocument');
  const ticket = record.ticket && ensureRecord(record.ticket, 'transportDocument.ticket');
  return {
    token: record.token && ensureRecord(record.token, 'transportDocument.token'),
    ticket: ticket
      ? {
          reservation: ticket.reservation && ensureRecord(ticket.reservation, 'transportDocument.ticket.reservation'),
          carCarriageReservation:
            ticket.carCarriageReservation &&
            ensureRecord(ticket.carCarriageReservation, 'transportDocument.ticket.carCarriageReservation'),
          openTicket: ticket.openTicket && ensureRecord(ticket.openTicket, 'transportDocument.ticket.openTicket'),
          pass: ticket.pass && ensureRecord(ticket.pass, 'transportDocument.ticket.pass'),
          voucher: ticket.voucher && ensureRecord(ticket.voucher, 'transportDocument.ticket.voucher'),
          customerCard:
            ticket.customerCard && ensureRecord(ticket.customerCard, 'transportDocument.ticket.customerCard'),
          counterMark: ticket.counterMark && ensureRecord(ticket.counterMark, 'transportDocument.ticket.counterMark'),
          parkingGround:
            ticket.parkingGround && ensureRecord(ticket.parkingGround, 'transportDocument.ticket.parkingGround'),
          fipTicket: ticket.fipTicket && ensureRecord(ticket.fipTicket, 'transportDocument.ticket.fipTicket'),
          stationPassage:
            ticket.stationPassage && ensureRecord(ticket.stationPassage, 'transportDocument.ticket.stationPassage'),
          extension: ticket.extension && ensureRecord(ticket.extension, 'transportDocument.ticket.extension'),
          delayConfirmation:
            ticket.delayConfirmation &&
            ensureRecord(ticket.delayConfirmation, 'transportDocument.ticket.delayConfirmation')
        }
      : undefined
  };
}

function normalizeTicket(value: unknown): UFLEXTicket {
  const record = ensureRecord(value, 'root');
  const issuingDetailValue = ensureRecord(record.issuingDetail, 'issuingDetail');

  const ticket: UFLEXTicket = {
    issuingDetail: mapIssuingDetail(issuingDetailValue),
    raw: record
  };

  const travelerDetailRecord = record.travelerDetail
    ? ensureRecord(record.travelerDetail, 'travelerDetail')
    : undefined;
  if (travelerDetailRecord) {
    ticket.travelerDetail = mapTravelerDetail(travelerDetailRecord);
  }

  const transportDocuments = toArray(record.transportDocument);
  if (transportDocuments) {
    ticket.transportDocument = transportDocuments.map(mapTransportDocument);
  }

  const controlDetailRecord = record.controlDetail ? ensureRecord(record.controlDetail, 'controlDetail') : undefined;
  if (controlDetailRecord) {
    ticket.controlDetail = mapControlDetail(controlDetailRecord);
  }

  const extensions = toRecordArray(record.extension, 'extension');
  if (extensions) {
    ticket.extension = extensions;
  }

  return ticket;
}

export async function parseUFLEX(hexPayload: string): Promise<UFLEXTicket> {
  if (!hexPayload) {
    throw new Error('UFLEX: Eingabewert ist leer.');
  }

  const module = await loadModule();
  const decoder = createDecoder(module);

  const hexBytes = module.lengthBytesUTF8(hexPayload) + 1;
  const hexPointer = module._malloc(hexBytes);
  module.stringToUTF8(hexPayload, hexPointer, hexBytes);

  const xmlPointer = decoder.decode(hexPointer, hexPayload.length);
  module._free(hexPointer);

  if (!xmlPointer) {
    const errorPointer = decoder.readError();
    const message = errorPointer ? module.UTF8ToString(errorPointer) : 'Unbekannter Fehler';
    throw new Error(`UFLEX-WASM-Decoder: ${message}`);
  }

  const xmlString = module.UTF8ToString(xmlPointer);
  decoder.release(xmlPointer);

  const parsed = await parseXerPayload(xmlString);
  return normalizeTicket(parsed);
}
