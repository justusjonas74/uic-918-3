import { unzipSync } from 'zlib';

import TicketContainer, { TicketContainerType } from './TicketContainer';
import { interpretField, interpretFieldResult, myConsoleLog, parseContainers, parsingFunction } from './utils';
import { SupportedTypes } from './FieldsType';
import { TicketSignatureVerficationStatus } from './check_signature';

// Get raw data and uncompress the TicketData
function getVersion(data: Buffer): number {
  return parseInt(data.subarray(3, 5).toString(), 10);
}

export type BarcodeHeader = {
  umid: Buffer;
  mt_version: Buffer;
  rics: Buffer;
  key_id: Buffer;
};

function getHeader(data: Buffer): BarcodeHeader {
  const umid = data.subarray(0, 3);
  const mt_version = data.subarray(3, 5);
  const rics = data.subarray(5, 9);
  const key_id = data.subarray(9, 14);
  return { umid, mt_version, rics, key_id };
}

function getSignature(data: Buffer, version: number): Buffer {
  // TODO: Double check if `version` is the correct element to choose the length of the signature...
  // TODO: The following lines are WET code
  if (version === 1) {
    return data.subarray(14, 64);
  } else {
    return data.subarray(14, 78);
  }
}

function getTicketDataLength(data: Buffer, version: number): Buffer {
  if (version === 1) {
    return data.subarray(64, 68);
  } else {
    return data.subarray(78, 82);
  }
}

function getTicketDataRaw(data: Buffer, version: number): Buffer {
  if (version === 1) {
    return data.subarray(68, data.length);
  } else {
    return data.subarray(82, data.length);
  }
}

function getTicketDataUncompressed(data: Buffer): Buffer {
  if (data && data.length > 0) {
    return unzipSync(data);
  } else {
    return data;
  }
}

// Interpreters for uncompressed Ticket Data
export class TicketDataContainer {
  id: string;
  version: string;
  length: number;
  container_data; // TODO: Add a Type!
  constructor(data: Buffer) {
    this.id = data.subarray(0, 6).toString();
    this.version = data.subarray(6, 8).toString();
    this.length = parseInt(data.subarray(8, 12).toString(), 10);
    this.container_data = TicketDataContainer.parseFields(this.id, this.version, data.subarray(12, data.length));
  }

  static parseFields(id: string, version: string, data: Buffer): Buffer | interpretFieldResult {
    const fields = getBlockTypeFieldsByIdAndVersion(id, version);
    if (fields) {
      return interpretField(data, fields.dataFields);
    } else {
      myConsoleLog(
        `ALERT: Container with id ${id} and version ${version} isn't implemented for TicketContainer ${id}.`
      );
      return data;
    }
  }
}

const interpretTicketContainer: parsingFunction = (data: Buffer): [TicketDataContainer, Buffer] => {
  const length = parseInt(data.subarray(8, 12).toString(), 10);
  const remainder = data.subarray(length, data.length);
  const container = new TicketDataContainer(data.subarray(0, length));
  return [container, remainder];
};

function getBlockTypeFieldsByIdAndVersion(id: string, version: string): TicketContainerType | undefined {
  return TicketContainer.find((ticketContainer) => ticketContainer.name === id && ticketContainer.version === version);
}
export type ParsedUIC918Barcode = {
  version: number;
  header: BarcodeHeader;
  signature: Buffer;
  ticketDataLength: Buffer;
  ticketDataRaw: Buffer;
  ticketDataUncompressed: Buffer;
  ticketContainers: SupportedTypes[];
  validityOfSignature?: TicketSignatureVerficationStatus;
  isSignatureValid?: boolean;
};
function parseBarcodeData(data: Buffer): ParsedUIC918Barcode {
  const version = getVersion(data);
  const header = getHeader(data);
  const signature = getSignature(data, version);
  const ticketDataLength = getTicketDataLength(data, version);
  const ticketDataRaw = getTicketDataRaw(data, version);
  const ticketDataUncompressed = getTicketDataUncompressed(ticketDataRaw);
  const ticketContainers = parseContainers(ticketDataUncompressed, interpretTicketContainer);
  return {
    version,
    header,
    signature,
    ticketDataLength,
    ticketDataRaw,
    ticketDataUncompressed,
    ticketContainers
  };
}

export default parseBarcodeData;
