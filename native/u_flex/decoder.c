#include <ctype.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <asn_application.h>
#include <per_decoder.h>

#include "UicRailTicketData.h"
#include "decoder_xer.h"

static char g_last_error[256] = {0};

static void set_error(const char *message) {
  if (!message) {
    g_last_error[0] = '\0';
    return;
  }
  snprintf(g_last_error, sizeof(g_last_error), "%s", message);
}

static int hex_value(char c) {
  if (c >= '0' && c <= '9') {
    return c - '0';
  }
  if (c >= 'a' && c <= 'f') {
    return 10 + (c - 'a');
  }
  if (c >= 'A' && c <= 'F') {
    return 10 + (c - 'A');
  }
  return -1;
}

static uint8_t *hex_to_bytes(const char *hex, size_t hex_len, size_t *out_len) {
  if (!hex || !out_len) {
    return NULL;
  }

  size_t buffer_len = hex_len > 0 ? hex_len : strlen(hex);
  size_t pairs = 0;
  for (size_t i = 0; i < buffer_len; ++i) {
    if (!isspace((unsigned char)hex[i])) {
      ++pairs;
    }
  }

  if (pairs % 2 != 0) {
    set_error("Ungültige Hex-Länge");
    return NULL;
  }

  pairs /= 2;
  uint8_t *bytes = (uint8_t *)malloc(pairs);
  if (!bytes) {
    set_error("Speicherallokation fehlgeschlagen");
    return NULL;
  }

  size_t byte_index = 0;
  int high_nibble = -1;
  for (size_t i = 0; i < buffer_len; ++i) {
    char c = hex[i];
    if (isspace((unsigned char)c)) {
      continue;
    }
    int value = hex_value(c);
    if (value < 0) {
      free(bytes);
      set_error("Nicht-hexadezimales Zeichen gefunden");
      return NULL;
    }
    if (high_nibble < 0) {
      high_nibble = value;
    } else {
      bytes[byte_index++] = (uint8_t)((high_nibble << 4) | value);
      high_nibble = -1;
    }
  }

  *out_len = pairs;
  return bytes;
}

char *decode_uflex(const char *hex_input, size_t hex_len) {
  set_error(NULL);
  if (!hex_input) {
    set_error("Eingabe fehlt");
    return NULL;
  }

  size_t data_len = 0;
  uint8_t *data = hex_to_bytes(hex_input, hex_len, &data_len);
  if (!data) {
    return NULL;
  }

  UicRailTicketData_t *ticket = NULL;
  asn_dec_rval_t rval = uper_decode_complete(NULL, &asn_DEF_UicRailTicketData,
                                             (void **)&ticket, data, data_len);
  free(data);

  if (rval.code != RC_OK || !ticket) {
    set_error("UPER-Dekodierung fehlgeschlagen");
    if (ticket) {
      ASN_STRUCT_FREE(asn_DEF_UicRailTicketData, ticket);
    }
    return NULL;
  }

  size_t xml_len = 0;
  char *xml = asn1_to_xer(&asn_DEF_UicRailTicketData, ticket, &xml_len);
  ASN_STRUCT_FREE(asn_DEF_UicRailTicketData, ticket);

  if (!xml) {
    set_error("XER-Serialisierung fehlgeschlagen");
    return NULL;
  }

  return xml;
}

const char *uflex_last_error(void) { return g_last_error; }

void free_buffer(char *buffer) {
  if (buffer) {
    free(buffer);
  }
}
