/*
 * Copyright (c) 2021 ACOAUTO Team.
 * All rights reserved.
 *
 * Detailed license information can be found in the LICENSE file.
 *
 * File: file.js C & H file template.
 *
 * Author: Han.hui <hanhui@acoinfo.com>
 *
 */

/* Configure */
const CONF = global.CONF;

/*
 * C File Header
 */
exports.C_HEADER = 
`/*
* Copyright (c) 2021 ACOAUTO Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* File: ${CONF.name}_jstruct.c ${CONF.name} JSON <-> C struct.
*
* This file is automatically generated by the jstruct tool, please do not modify.
*
* Author: Han.hui <hanhui@acoinfo.com>
*
*/

#include <stdlib.h>
#include <string.h>
#include "cJSON.h"
#include "${CONF.name}_jstruct.h"

`;

/*
 * C File Header
 */
exports.C_FOOTER = 
`/*
 * end
 */
`;

/*
 * H File Header
 */
exports.H_HEADER = 
`/*
* Copyright (c) 2021 ACOAUTO Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* File: ${CONF.name}_jstruct.h ${CONF.name} JSON <-> C struct.
*
* Date: ${new Date().toString()}
*
* This file is automatically generated by the jstruct tool, please do not modify.
*
* Author: Han.hui <hanhui@acoinfo.com>
*
*/

#ifndef ${CONF.name.toUpperCase()}_JSTRUCT_H
#define ${CONF.name.toUpperCase()}_JSTRUCT_H

#include <stdint.h>
#include <stdbool.h>
`;

/*
 * C File Header
 */
exports.H_FOOTER = `

#ifdef __cplusplus
extern "C" {
#endif

/* Deserialize the JSON string into a structure '${CONF.struct.name}' */
bool ${CONF.name}_json_parse(struct ${CONF.struct.name} *, const char *, size_t);

/* Free ${CONF.name}_json_parse() buffer, Warning: string type member can no longer be used */
void ${CONF.name}_json_parse_free(struct ${CONF.struct.name} *);

/* Serialize the structure '${CONF.struct.name}' into a JSON string */
char *${CONF.name}_json_stringify(struct ${CONF.struct.name} *);

/* Free ${CONF.name}_json_stringify() return value */
void ${CONF.name}_json_stringify_free(char *);

#ifdef __cplusplus
}
#endif

#endif /* ${CONF.name.toUpperCase()}_JSTRUCT_H */
/*
 * end
 */
`;