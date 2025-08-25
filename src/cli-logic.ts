import treeify from 'treeify';
import chalk from 'chalk';
import { readBarcode } from './index.js';
import { ParsedUIC918Barcode, TicketDataContainer } from './barcode-data.js';
import { SupportedTypes } from './FieldsType.js';

const onSuccessFn = (data: ParsedUIC918Barcode): void => {
  if (data && data.ticketContainers.length > 0) {
    data.ticketContainers.forEach((ct: SupportedTypes) => {
      if (ct instanceof TicketDataContainer) {
        console.log(chalk.bold.bgGreen.black(ct.id + '-Container'));
        // @ts-expect-error Types from @types/treeify are not compatible with the current version of treeify
        console.log(chalk.green(treeify.asTree(ct.container_data, true, false)));
        console.log('\n');

      } else {
        console.log(chalk.bold.bgRed('Unknown Container'));
      }
      if (data.isSignatureValid == true || false) {
        console.log(chalk.bold.bgGreen.black('Signature'));
        // @ts-expect-error Types from @types/treeify are not compatible with the current version of treeify
        console.log(chalk.green(treeify.asTree({ isSignatureValid: data.isSignatureValid }, true, false)));
        console.log('\n');
      }

    })
  } else {
    console.log(chalk.bgRed('No Data found.'));
  }
};

const onRejectedFn = (reason: unknown): void => {
  console.log(chalk.red(reason));
};

const interpretBarcode = async (file_path: string, opts = {}): Promise<void> => {

  try {
    const barcode = await readBarcode(file_path, opts)
    onSuccessFn(barcode)
  } catch (error) {
    onRejectedFn(error);
  }
};
export default interpretBarcode
