/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, basename, resolve, dirname } from 'path';
import rs from 'jsrsasign';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const keysJsonPath = join(__dirname, '../keys.json');

function getSubjectAttribute(x509: any, typeName: string): string | undefined {
  const subject = x509.getSubject();
  if (subject && Array.isArray(subject.array)) {
    for (const rdn of subject.array) {
      if (Array.isArray(rdn)) {
        for (const attr of rdn) {
          if (attr && attr.type === typeName) {
            return attr.value;
          }
        }
      }
    }
  }
  return undefined;
}

function parseASN1Date(timeStr: string): string {
  let year = '';
  let month = '';
  let day = '';
  if (timeStr.length >= 10) {
    if (timeStr.length === 11 || timeStr.length === 13 || timeStr.endsWith('Z')) {
      const isGeneralized = timeStr.length >= 14;
      if (isGeneralized) {
        year = timeStr.slice(0, 4);
        month = timeStr.slice(4, 6);
        day = timeStr.slice(6, 8);
      } else {
        const yy = parseInt(timeStr.slice(0, 2), 10);
        year = (yy < 50 ? '20' : '19') + timeStr.slice(0, 2);
        month = timeStr.slice(2, 4);
        day = timeStr.slice(4, 6);
      }
    }
  }
  if (year && month && day) {
    return `${year}-${month}-${day}`;
  }
  return '';
}

export function addCertificate(
  input: string | Buffer | Array<string | Buffer>,
  customKeysPath?: string
): number {
  const targetPath = customKeysPath || keysJsonPath;
  const inputs = Array.isArray(input) ? input : [input];
  const pemContents: { content: string; filePath?: string }[] = [];

  for (const item of inputs) {
    if (Buffer.isBuffer(item)) {
      pemContents.push({ content: item.toString('utf8') });
    } else if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.startsWith('-----BEGIN CERTIFICATE-----')) {
        pemContents.push({ content: trimmed });
      } else {
        const resolvedPath = resolve(item);
        if (!existsSync(resolvedPath)) {
          throw new Error(`Path does not exist: ${item}`);
        }
        const stats = statSync(resolvedPath);
        if (stats.isDirectory()) {
          const files = readdirSync(resolvedPath);
          for (const file of files) {
            if (file.endsWith('.pem')) {
              const fullFilePath = join(resolvedPath, file);
              const fileContent = readFileSync(fullFilePath, 'utf8');
              pemContents.push({ content: fileContent, filePath: fullFilePath });
            }
          }
        } else {
          const fileContent = readFileSync(resolvedPath, 'utf8');
          pemContents.push({ content: fileContent, filePath: resolvedPath });
        }
      }
    } else {
      throw new Error('Invalid input type: expected string, Buffer, or array thereof.');
    }
  }

  if (pemContents.length === 0) {
    throw new Error('No certificates found to add.');
  }

  let keysData: any = { keys: { key: [] } };
  if (existsSync(targetPath)) {
    try {
      keysData = JSON.parse(readFileSync(targetPath, 'utf8'));
    } catch (e: any) {
      throw new Error(`Failed to parse keys.json: ${e.message}`);
    }
  }

  if (!keysData.keys || !Array.isArray(keysData.keys.key)) {
    keysData.keys = { key: [] };
  }

  const addedKeys: any[] = [];
  const errors: { file?: string; message: string }[] = [];

  for (const pemObj of pemContents) {
    try {
      const pemStr = pemObj.content.trim();
      if (!pemStr.includes('-----BEGIN CERTIFICATE-----') || !pemStr.includes('-----END CERTIFICATE-----')) {
        throw new Error('Invalid certificate: missing PEM headers');
      }

      const x = new rs.X509();
      try {
        x.readCertPEM(pemStr);
      } catch (e: any) {
        throw new Error(`Invalid certificate: failed to parse PEM. ${e.message}`);
      }

      const publicKeyBase64 = pemStr
        .replace(/-----BEGIN CERTIFICATE-----/, '')
        .replace(/-----END CERTIFICATE-----/, '')
        .replace(/\s+/g, '');

      let rics: string | undefined;
      let keyId: string | undefined;

      const subject = x.getSubject();
      if (subject && Array.isArray(subject.array)) {
        for (const rdn of subject.array) {
          if (Array.isArray(rdn)) {
            for (const attr of rdn) {
              if (attr && attr.value) {
                const valStr = String(attr.value);
                const ricsMatch = valStr.match(/RICS:(\d+)/i);
                if (ricsMatch) {
                  rics = ricsMatch[1];
                }
                const keyIdMatch = valStr.match(/KeyId:([A-Za-z0-9]+)/i);
                if (keyIdMatch) {
                  keyId = keyIdMatch[1];
                }
              }
            }
          }
        }
      }

      if (pemObj.filePath) {
        const filename = basename(pemObj.filePath, '.pem');
        if (filename.length === 9) {
          const fileRics = filename.slice(0, 4);
          const fileKeyId = filename.slice(4);
          if (/^\d+$/.test(fileRics)) {
            if (!rics) {
              rics = fileRics;
            }
            if (!keyId) {
              keyId = fileKeyId;
            }
          }
        }
      }

      if (!rics || !keyId) {
        throw new Error(
          `Failed to determine RICS code and/or Key ID for certificate. Please ensure the certificate embeds RICS/KeyId or the filename follows the 9-character naming convention (e.g. 008000201.pem).`
        );
      }

      const finalRics = /^\d+$/.test(rics) ? String(parseInt(rics, 10)) : rics;
      const finalKeyId = /^\d+$/.test(keyId) ? String(parseInt(keyId, 10)) : keyId;

      const isDuplicateInJSON = keysData.keys.key.some((k: any) => {
        const hasSameRicsAndId = k.issuerCode.includes(finalRics) && k.id.includes(finalKeyId);
        const hasSamePubKey = k.publicKey.includes(publicKeyBase64);
        return hasSameRicsAndId || hasSamePubKey;
      });

      const isDuplicateInBatch = addedKeys.some((k: any) => {
        const hasSameRicsAndId = k.issuerCode.includes(finalRics) && k.id.includes(finalKeyId);
        const hasSamePubKey = k.publicKey.includes(publicKeyBase64);
        return hasSameRicsAndId || hasSamePubKey;
      });

      if (isDuplicateInJSON || isDuplicateInBatch) {
        throw new Error(
          `Certificate with RICS ${finalRics} and Key ID ${finalKeyId} already exists in keys.json.`
        );
      }

      const startDate = parseASN1Date(x.getNotBefore());
      const endDate = parseASN1Date(x.getNotAfter());

      const o = getSubjectAttribute(x, 'O');
      const cn = getSubjectAttribute(x, 'CN');
      const issuerName = o || cn || 'Custom Issuer';

      const sigAlg = x.getSignatureAlgorithmField();

      const newKey = {
        issuerName: [issuerName],
        issuerCode: [finalRics],
        versionType: ['FCB'],
        signatureAlgorithm: [sigAlg],
        id: [finalKeyId],
        publicKey: [publicKeyBase64],
        barcodeVersion: ['3'],
        startDate: [startDate],
        endDate: [endDate],
        barcodeXsd: [''],
        allowedProductOwnerCodes: [] as any[],
        keyForged: [''],
        commentForEncryptionType: [''],
        isCustom: [true]
      };

      addedKeys.push(newKey);
    } catch (e: any) {
      errors.push({
        file: pemObj.filePath,
        message: e.message
      });
    }
  }

  if (addedKeys.length > 0) {
    keysData.keys.key = [...keysData.keys.key, ...addedKeys];
    writeFileSync(targetPath, JSON.stringify(keysData));
  }

  if (errors.length > 0) {
    const errorDetails = errors.map(err => 
      `${err.file ? `[${basename(err.file)}] ` : ''}${err.message}`
    ).join('\n');
    const err = new Error(`Some certificates could not be imported:\n${errorDetails}`);
    (err as any).addedCount = addedKeys.length;
    throw err;
  }

  return addedKeys.length;
}

export function listCertificates(customKeysPath?: string): any[] {
  const targetPath = customKeysPath || keysJsonPath;
  if (!existsSync(targetPath)) {
    return [];
  }
  let keysData: any;
  try {
    keysData = JSON.parse(readFileSync(targetPath, 'utf8'));
  } catch {
    return [];
  }
  if (!keysData.keys || !Array.isArray(keysData.keys.key)) {
    return [];
  }
  return keysData.keys.key;
}

export function showCertificate(selector: string, customKeysPath?: string): any {
  const targetPath = customKeysPath || keysJsonPath;
  if (!existsSync(targetPath)) {
    throw new Error(`keys.json not found at ${targetPath}`);
  }
  let keysData: any;
  try {
    keysData = JSON.parse(readFileSync(targetPath, 'utf8'));
  } catch (e: any) {
    throw new Error(`Failed to parse keys.json: ${e.message}`);
  }
  if (!keysData.keys || !Array.isArray(keysData.keys.key)) {
    throw new Error('No certificates found.');
  }

  const parts = selector.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid selector format. Expected <issuerCode>:<keyId> (e.g. 1080:8)');
  }
  const [rics, keyId] = parts;
  const finalRics = /^\d+$/.test(rics) ? String(parseInt(rics, 10)) : rics;
  const finalKeyId = /^\d+$/.test(keyId) ? String(parseInt(keyId, 10)) : keyId;

  const key = keysData.keys.key.find((k: any) => 
    k.issuerCode.includes(finalRics) && k.id.includes(finalKeyId)
  );

  if (!key) {
    throw new Error(`Certificate not found for selector "${selector}".`);
  }

  return key;
}

