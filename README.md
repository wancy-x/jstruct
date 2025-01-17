# Overview
jstruct is an automatic C code generation tool for generating JSON parsing and stringifying code. The C code generated by this tool needs to depend on the `yyjson` library for execution.

The jstruct tool generates C code corresponding to JSON serialization and deserialization by analyzing the configuration file (`conf.json` by default). The jstruct tool can run in the **JSRE** environment or the **NodeJS** environment.

It can be run with the following command:
+ JSRE

``` bash
javascript -a conf.json jstruct.js
```

+ NodeJS

``` bash
node jstruct.js conf.json
```

# JSON Format Configuration File
An example configuration file is as follows:

``` json
{
  "name": "test",
  "struct": {
    "name": "hello",
    "member": [
      { "key": "foo", "type": "int",    "req": true, "min": 1, "max": 128, "near": true },
      { "key": "bar", "type": "int",    "req": true, "max": 128 },
      { "key": "boo", "type": "bool",   "req": false },
      { "key": "str", "type": "char *", "req": true },
      { "key": "arr", "type": "double", "req": true , "array": 4, "mlen": 2, "min": 1 },
      { "key": "han", "type": "float",  "req": false  },
      { "key": "st1", "type": "struct", "req": true, "name": "struct1" },
      { "key": "st2", "type": "struct", "req": true, "name": "struct2" }
    ],
    "substruct": [
      {
        "name": "struct1",
        "member": [
          { "key": "foo", "type": "int",    "req": true, "min": 1, "max": 128, "near": true },
          { "key": "boo", "type": "bool",   "req": false },
          { "key": "st2", "type": "struct", "req": true, "name": "struct2" }
        ]
      }, {
        "name": "struct2",
        "member": [
          { "key": "bar", "type": "int",    "req": true, "max": 128 },
          { "key": "str", "type": "char *", "req": true }
        ]
      }
    ]
  }
}
```

# YAML Format Configuration File
An example configuration file is as follows:

``` yaml
name: test
struct:
  name: hello
  member:
    -
      key: foo
      type: int
      req: true
      min: 1
      max: 128
      near: true
    -
      key: bar
      type: int
      req: false
    -
      key: str1
      type: struct
      name: struct1
  substruct:
    -
      name: struct1
      member:
        -
          key: foo
          type: int
          req: true
    -
      name: struct2
      member:
        -
          key: bar
          type: int
          req: true
# ...
```

When using a configuration file in YAML format in a NodeJS environment, you must first execute `npm i yaml` to install the yaml parsing library.

## name
+ *{String}*

The name of this module, the generated C file and the corresponding H file are respectively: `${name}_jstruct.c` and `${name}_jstruct.h`

**This field is required**.

## struct
+ *{Object}*

Description of C structs for serialization and deserialization.

**This field is required**.

## struct.name
+ *{String}*

The name of the C structure.

**This field is required**.

## struct.member
+ *{Array}*

Struct member array. Each structure member is an object, which is used to describe the name, type and other information of this member.

**This field is required**.

## struct.substruct
+ *{Array}*

Substruct array. Each substructure is an object. In the structure data nesting scenario, this field needs to be defined, same as `struct` rule.

**This field is optional**.

# Structure Member
Each structure member is called an `item`, this `item` can have the following description.

## item.key
+ *{String}*

The name of the member of this structure, the member name in the generated structure and the corresponding JSON object key. 

**This field is required**.

## item.type
+ *{String}*

The type of the member of this structure, the accepted types include:
`'bool'`, `'int8_t'`, `'int16_t'`, `'int32_t'`, `'uint8_t'`, `'uint16_t'`, `'uint32_t'`, `'int'`, `'long'`, `'float'`, `'double'`, `'char *'`, `'struct'`.

**This field is required**.

## item.req
+ *{Boolean}*

Whether this struct member must exist when parsing JSON. When it is `false`, it means that if this member does not exist in JSON, it will be ignored during parsing. If it is `true`, if this member does not exist in JSON, the parsing function will return an error. **default: false**.

**This field is optional**.

## item.min
+ *{Number}*

If this member is a numeric type member, the minimum value allowed in JSON parsing.

**This field is optional**.

## item.max
+ *{Number}*

If this member is a numeric type member, the maximum value allowed in JSON parsing.

**This field is optional**.

## item.near
+ *{Boolean}*

If `item.min` or `item.max` exists, this field indicates the processing method when this member exceeds the limit when JSON is parsed. When it is `false`, it means that the parsing fails when the limit is exceeded, and when it is `true`, it means that it exceeds the limit that use limit value. **default: false**.

**This field is optional**.

## item.array
+ *{Integer}*

If this structure member is an array, this field indicates the size of the array.

**This field is optional**.

## item.mlen
+ *{Integer}*

If the structure member is an array, this field indicates the minimum number of members of the corresponding array member during JSON parsing. If the length of the array is less than this field, the parsing fails and an error is returned.

**This field is optional**.

## item.name
+ *{String}*

If the structure member type is `struct`, this field is required. This field is used to match `name` in the `struct.substruct`.

**This field is optional**.

# C Function
The C functions generated by the jstruct tool are as follows.

Here it is assumed that the configuration file `name` is `'test'` and the `struct.name` is `'data'`.

Function|Description
---|---
test_json_parse()|Deserialize the JSON string into a structure
test_json_parse_free()|Free test_json_parse() buffer, Warning: string type member can no longer be used
test_json_stringify()|Serialize the structure into a JSON string
test_json_stringify_free()|Free test_json_stringify() return value

**NOTICE**: The structure definition generated by jstruct will contain the `void *json` member, which saves the memory used by the `yyjson` library to parse JSON, `test_json_parse()` and `test_json_parse_free()` must be used in pairs, `test_json_parse_free()` will release this memory, and the `stuct data` structure members of type `char *` in the body will not be allowed to be used.

## bool test_json_parse(struct data *data, const char *json, size_t json_len)
+ `data` *{Struct}* Struct to assign.
+ `json` *{String}* The JSON string to be parsed.
+ `json_len` *{Integer}* JSON string length.
+ Returns: *{Boolean}* Whether the parsing is successful.

Parse JSON and fill the content of the corresponding field into the `struct data` argument, return `true` if the parsing is successful, otherwise return `false`.

When some members are optional, before calling this function, it is necessary to ensure that the corresponding members of `struct data` have initial values.

## void test_json_parse_free(struct data *data)
+ `data` *{Struct}* The `void *json` field of this argument will be freed.

This function will release this memory, and the `stuct data` structure members of type `char *` in the body will not be allowed to be used. `test_json_parse()` and `test_json_parse_free()` must be used in pairs.

### Example
``` c
struct data d;

if (test_json_parse(&d, json, strlen(json))) {
	printf("%d\n", d.foo);
	test_json_parse_free(&d);
}
```

## char *test_json_stringify(struct data *data)
+ `data` *{Struct}* The struct to be serialized.
+ Returns: *{String}* Serialized result string, `NULL` on error.

Serialize `struct data` to JSON, this function will return a JSON string if successful.

## void test_json_stringify_free(char *json)
+ `json` *{String}* `test_json_stringify()` return value.

To free the string returned by `test_json_stringify()`, the `test_json_stringify()` and `test_json_stringify_free()` functions must be used in pairs.

### Example
``` c
char *json = test_json_stringify(&d);
if (json) {
	// send json string to remote
	test_json_stringify_free(json);
}
```

---
