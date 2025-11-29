#!/usr/bin/env bash
set -euo pipefail

SCHEMA_URL="https://raw.githubusercontent.com/UnionInternationalCheminsdeFer/UIC-barcode/refs/heads/master/misc/uicRailTicketData_v3.0.5.asn"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
WORK_DIR="${ROOT_DIR}/native/u_flex"
SCHEMA_FILE="${WORK_DIR}/uicRailTicketData_v3.0.5.asn"
ASN_OUTPUT_DIR="${WORK_DIR}/asn1"
BUILD_DIR="${WORK_DIR}/build"
DIST_DIR="${ROOT_DIR}/wasm"

ASN1C_BIN="$(command -v asn1c)"
if [[ -z "${ASN1C_BIN}" ]]; then
  echo "asn1c wurde nicht gefunden. Bitte installieren und in PATH aufnehmen." >&2
  exit 1
fi

ASN1C_PREFIX="$(cd "$(dirname "${ASN1C_BIN}")/.." && pwd)"
DEFAULT_SUPPORT_DIR="${ASN1C_PREFIX}/share/asn1c"
SUPPORT_DIR="${ASN1C_SUPPORT_DIR:-${DEFAULT_SUPPORT_DIR}}"

if [[ ! -d "${SUPPORT_DIR}" ]]; then
  echo "asn1c Support-Verzeichnis (${SUPPORT_DIR}) nicht gefunden. Bitte ASN1C_SUPPORT_DIR setzen." >&2
  exit 1
fi

mkdir -p "${ASN_OUTPUT_DIR}" "${BUILD_DIR}" "${DIST_DIR}"

if [[ ! -f "${SCHEMA_FILE}" ]]; then
  echo "Lade ASN.1-Schema…"
  curl -fsSL "${SCHEMA_URL}" -o "${SCHEMA_FILE}"
else
  echo "Verwende vorhandenes Schema ${SCHEMA_FILE}"
fi

echo "Generiere C-Typen via asn1c…"
rm -rf "${ASN_OUTPUT_DIR:?}"/*

FLAG_MATRIX=(
  "-fcompound-names -gen-PER -no-gen-example"
  "-fcompound-names -gen-PER"
)

ASN1C_SUCCESS=0
for FLAGS in "${FLAG_MATRIX[@]}"; do
  echo "Versuche asn1c mit Flags: ${FLAGS}"
  if (
    cd "${ASN_OUTPUT_DIR}"
    asn1c ${FLAGS} -pdu=UicRailTicketData "${SCHEMA_FILE}"
  ); then
    echo "asn1c erfolgreich mit Flags: ${FLAGS}"
    ASN1C_SUCCESS=1
    break
  fi
  echo "asn1c fehlgeschlagen mit Flags: ${FLAGS}" >&2
  rm -rf "${ASN_OUTPUT_DIR:?}"/*
done

if [[ ${ASN1C_SUCCESS} -ne 1 ]]; then
  echo "asn1c konnte mit keiner Flag-Kombination ausgeführt werden. Bitte Version prüfen." >&2
  exit 1
fi

cp "${WORK_DIR}/decoder.c" "${BUILD_DIR}"
cp "${WORK_DIR}/decoder_xer.c" "${BUILD_DIR}"
cp "${WORK_DIR}/decoder_xer.h" "${BUILD_DIR}"
cp -R "${ASN_OUTPUT_DIR}"/* "${BUILD_DIR}"

# Entferne Beispiel-/Sample-Dateien, die von asn1c generiert werden und nicht benötigt werden
rm -f "${BUILD_DIR}"/*-sample.c "${BUILD_DIR}"/*-example.c "${BUILD_DIR}"/converter-sample.c "${BUILD_DIR}"/converter-example.c

support_sources=("${SUPPORT_DIR}"/*.c)
support_headers=("${SUPPORT_DIR}"/*.h)

if compgen -G "${SUPPORT_DIR}/*.c" > /dev/null; then
  cp "${support_sources[@]}" "${BUILD_DIR}"
fi

if compgen -G "${SUPPORT_DIR}/*.h" > /dev/null; then
  cp "${support_headers[@]}" "${BUILD_DIR}"
fi

# Entferne auch aus Support-Verzeichnis kopierte Sample-Dateien
rm -f "${BUILD_DIR}"/*-sample.c "${BUILD_DIR}"/*-example.c "${BUILD_DIR}"/converter-sample.c "${BUILD_DIR}"/converter-example.c

rm -f "${BUILD_DIR}/decoder_json.c" "${BUILD_DIR}/decoder_json.h"

pushd "${BUILD_DIR}" > /dev/null

SRC_FILES=$(find . -maxdepth 1 -name '*.c' ! -name 'decoder.c' ! -name 'decoder_xer.c' -print | tr '\n' ' ')

echo "Kompiliere WASM mit Emscripten…"
emcc \
  -I. \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_FUNCTIONS='["_decode_uflex","_free_buffer","_uflex_last_error","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap","lengthBytesUTF8","stringToUTF8","UTF8ToString"]' \
  decoder.c decoder_xer.c ${SRC_FILES} \
  -o u_flex_decoder.js

popd > /dev/null

mv "${BUILD_DIR}/u_flex_decoder.js" "${DIST_DIR}/u_flex_decoder.js"
mv "${BUILD_DIR}/u_flex_decoder.wasm" "${DIST_DIR}/u_flex_decoder.wasm"

echo "Artefakte liegen in ${DIST_DIR}"
