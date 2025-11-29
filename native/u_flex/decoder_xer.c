#include "decoder_xer.h"

#include <stdlib.h>
#include <string.h>
#include <xer_encoder.h>

typedef struct {
  char *data;
  size_t length;
  size_t capacity;
} buffer_t;

static int append_to_buffer(const void *buffer, size_t size, void *app_key) {
  buffer_t *target = (buffer_t *)app_key;
  if (!target || (!buffer && size != 0)) {
    return -1;
  }

  if (target->length + size + 1 > target->capacity) {
    size_t new_capacity = target->capacity ? target->capacity * 2 : 256;
    while (new_capacity < target->length + size + 1) {
      new_capacity *= 2;
    }
    char *resized = (char *)realloc(target->data, new_capacity);
    if (!resized) {
      return -1;
    }
    target->data = resized;
    target->capacity = new_capacity;
  }

  if (size > 0 && buffer) {
    memcpy(target->data + target->length, buffer, size);
    target->length += size;
  }

  target->data[target->length] = '\0';
  return 0;
}

char *asn1_to_xer(const asn_TYPE_descriptor_t *type_descriptor,
                  const void *structure,
                  size_t *out_len) {
  if (!type_descriptor || !structure || !out_len) {
    return NULL;
  }

  buffer_t output = {.data = NULL, .length = 0, .capacity = 0};

  asn_enc_rval_t rval =
      xer_encode((asn_TYPE_descriptor_t *)type_descriptor, (void *)structure,
                 XER_F_CANONICAL, append_to_buffer, &output);

  if (rval.encoded == -1 || !output.data) {
    free(output.data);
    return NULL;
  }

  *out_len = output.length;
  return output.data;
}
