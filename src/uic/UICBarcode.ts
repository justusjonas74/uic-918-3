import { UICHeader } from "./UICHeader";
import { UICSignature } from "./UICSignature";
import { UICTicket } from "./UICTicket";



export class UICBarcode {
  public static fromBuffer(buffer: Buffer): UICBarcode {
    buffer;
    return new UICBarcode;
  }



  private uicHeader: UICHeader;
  private uicSignature: UICSignature;
  private uicTicketData: UICTicket;



}


