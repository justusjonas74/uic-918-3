// export function orgId (orgId:number) : string {
//   const res: string = orgIdData[orgId] ? orgIdData[orgId] : orgId.toString()
//   return res
// }

// export function tarifpunkt (orgId:number, tp:number) : string {
//   let res : string | undefined = undefined
//   try {
//     res = tarifpunkteData[orgId][tp]
//   } catch (e) {
//     myConsoleLog(e)
//   }
//   return res ? res : tp.toString()
// }

// interface EFMProdukt {
//     produkt_nr: string | null,
//     kvp_organisations_id: string
// }

// export function efm_produkt (org_id:number, produktId:number) : EFMProdukt  {
//   const kvp_organisations_id : string = orgId(org_id)
//   let produkt : string | undefined = undefined
//   try {
//      produkt = efmProdukteData[org_id][produktId] 
//   } catch (e) {
//     myConsoleLog(e)
//   }
//   const produkt_nr: string = produkt ? produkt : produktId.toString()
//   return {produkt_nr: produkt_nr, kvp_organisations_id: kvp_organisations_id }
// }


