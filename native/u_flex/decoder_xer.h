#ifndef UFLEX_DECODER_XER_H
#define UFLEX_DECODER_XER_H

#include <stddef.h>
#include <asn_application.h>

char *asn1_to_xer(const asn_TYPE_descriptor_t *type_descriptor,
                  const void *structure,
                  size_t *out_len);

#endif /* UFLEX_DECODER_XER_H */
