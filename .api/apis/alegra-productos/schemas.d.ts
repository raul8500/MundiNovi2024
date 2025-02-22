declare const DeleteCustomFieldsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del campo adicional que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteInventoryAdjustmentsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id del ajuste de inventario que se quiere eliminar";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteInventoryAdjustmentsNumerationsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la numeración que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteItemCategoriesAttachmentIdattachment: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly idAttachment: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del archivo adjunto que se desea eliminar.";
                };
            };
            readonly required: readonly ["idAttachment"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteItemCategoriesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la categoría de item que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteItems: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificadores de los productos que se desean eliminar se parados por (,). Ejemplo: `/items?id=1,2,3`";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteItemsAttachmentIdattachment: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly idAttachment: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del archivo adjunto que se desea eliminar.";
                };
            };
            readonly required: readonly ["idAttachment"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteItemsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del producto o servicio que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeletePriceListsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la lista de precios que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteVariantAttributesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la variante que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteWarehouseTransfersId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id de la transferencia que se quiere eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteWarehousesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la bodega que se desea eliminar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetCustomFields: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual campo se quiere consultar. Por ejemplo para consultar  desde el campo 20, se envía start=20.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de campos a partir del inicio que se desea retornar.  Por  defecto retorna 30 atributos. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly name_query: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cadena de texto que se utiliza para consultar campos adicionales  que contengan dicho texto en su nombre.";
                };
                readonly description_query: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cadena de texto que se utiliza para consultar campos adicionales  que contengan dicho texto en su descripción.";
                };
                readonly metadata: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro \"data\" en donde se envían los campos adicionales. Actualmente la información que se envía en metadata incluye el total de campos adicionales que tiene registrada la empresa.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar campos adicionales por el estado. Se retornarán todos los  campos adicionales cuyo estado actual sea el enviado como parámetro.";
                };
                readonly resourceType: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar campos adicionales por el tipo de recurso asociado. Se  retornarán todos los campos adicionales que sean del tipo de recurso enviado como parámetro.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar campos adicionales por el tipo de campo. Se retornarán todos  los campos adicionales que sean del tipo enviado como parámetro.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "CustomFieldGet";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un campo adicional específico.  La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Indica el nombre del campo adicional";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del campo adicional.";
                        readonly type: "string";
                    };
                    readonly defaultValue: {
                        readonly description: "Indicar un valor por defecto";
                        readonly type: "string";
                    };
                    readonly resourceType: {
                        readonly description: "Recurso asociado al campo adicional.\n\n`item`";
                        readonly type: "string";
                        readonly enum: readonly ["item"];
                    };
                    readonly key: {
                        readonly description: "Key para identificar si el campo es un campo de sistema. Visita la lista de campos de sistema disponibles por país [aquí](https://developer.alegra.com/docs/campos-adicionales-de-sistema).";
                        readonly type: "string";
                    };
                    readonly type: {
                        readonly description: "Tipo de dato del campo adicional.\n\n`[object Object]` `[object Object]` `[object Object]` `[object Object]` `[object Object]`";
                        readonly type: "string";
                        readonly enum: readonly [{
                            readonly text: "Indica que el campo es un campo de texto.";
                        }, {
                            readonly int: "Indica que el campo es un campo numérico.";
                        }, {
                            readonly date: "Indica que el campo es de tipo fecha.";
                        }, {
                            readonly boolean: "indica que el campo es de tipo booleano (true o false)";
                        }, {
                            readonly optionsList: "Indica que el campo es una lista de opciones pre-establecida.";
                        }];
                    };
                    readonly settings: {
                        readonly description: "Objeto con la configuraciones del campo adicional.";
                        readonly type: "object";
                        readonly properties: {
                            readonly isRequired: {
                                readonly description: "Indica si el campo es obligatorio o no.";
                                readonly type: "boolean";
                            };
                            readonly printOnInvoices: {
                                readonly description: "Indica si el campo se desea imprimir en facturas.";
                                readonly type: "boolean";
                            };
                            readonly showInItemVariants: {
                                readonly description: "Indica si el campo se debe usar a nivel de items variantes o a nivel de item padre en items con variantes.";
                                readonly type: "boolean";
                            };
                        };
                    };
                    readonly options: {
                        readonly description: "Array de strings con las opciones disponibles para el campo adicional. Únicamente aplica cuando el tipo del campo es optionsList";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly status: {
                        readonly description: "Estado del campo adicional.\n\n`active` `inactive`";
                        readonly type: "string";
                        readonly enum: readonly ["active", "inactive"];
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly error: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetCustomFieldsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del campo adicional que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "CustomFieldGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un campo adicional específico.  La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Indica el nombre del campo adicional";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción del campo adicional.";
                    readonly type: "string";
                };
                readonly defaultValue: {
                    readonly description: "Indicar un valor por defecto";
                    readonly type: "string";
                };
                readonly resourceType: {
                    readonly description: "Recurso asociado al campo adicional.\n\n`item`";
                    readonly type: "string";
                    readonly enum: readonly ["item"];
                };
                readonly key: {
                    readonly description: "Key para identificar si el campo es un campo de sistema. Visita la lista de campos de sistema disponibles por país [aquí](https://developer.alegra.com/docs/campos-adicionales-de-sistema).";
                    readonly type: "string";
                };
                readonly type: {
                    readonly description: "Tipo de dato del campo adicional.\n\n`[object Object]` `[object Object]` `[object Object]` `[object Object]` `[object Object]`";
                    readonly type: "string";
                    readonly enum: readonly [{
                        readonly text: "Indica que el campo es un campo de texto.";
                    }, {
                        readonly int: "Indica que el campo es un campo numérico.";
                    }, {
                        readonly date: "Indica que el campo es de tipo fecha.";
                    }, {
                        readonly boolean: "indica que el campo es de tipo booleano (true o false)";
                    }, {
                        readonly optionsList: "Indica que el campo es una lista de opciones pre-establecida.";
                    }];
                };
                readonly settings: {
                    readonly description: "Objeto con la configuraciones del campo adicional.";
                    readonly type: "object";
                    readonly properties: {
                        readonly isRequired: {
                            readonly description: "Indica si el campo es obligatorio o no.";
                            readonly type: "boolean";
                        };
                        readonly printOnInvoices: {
                            readonly description: "Indica si el campo se desea imprimir en facturas.";
                            readonly type: "boolean";
                        };
                        readonly showInItemVariants: {
                            readonly description: "Indica si el campo se debe usar a nivel de items variantes o a nivel de item padre en items con variantes.";
                            readonly type: "boolean";
                        };
                    };
                };
                readonly options: {
                    readonly description: "Array de strings con las opciones disponibles para el campo adicional. Únicamente aplica cuando el tipo del campo es optionsList";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly status: {
                    readonly description: "Estado del campo adicional.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly error: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetInventoryAdjustments: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual ajuste se quiere consultar. Por ejemplo para consultar desde el ajuste 20, se envía start=20.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de ajustes a partir del inicio que se desea retornar. Por defecto retorna 30 ajustes. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Orden ascendente o descendente en el cual se quieren retornar la información. Opciones disponibles son DESC o ASC. Por defecto es ASC (ascendente).";
                };
                readonly order_field: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo por el cual se desea ordenar, las opciones posibles son id, number, date, observations, warehouse_name";
                };
                readonly number: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo para filtrar por id del ajuste";
                };
                readonly date: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo para filtrar ajustes por fecha";
                };
                readonly warehouse_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo para filtrar ajustes por id de bodega";
                };
                readonly metadata: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro otro atributo \"data\" en donde se envían los ajustes. Actualmente la información que se envía en metadata incluye el total de ajustes que tiene registrada la empresa.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Inventory Adjustment Get";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un ajuste de inventario específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly date: {
                        readonly description: "Fecha del ajuste de inventario.";
                        readonly type: "string";
                        readonly format: "date";
                    };
                    readonly observations: {
                        readonly description: "Observaciones del ajuste de inventario.";
                        readonly type: "string";
                    };
                    readonly warehouse: {
                        readonly description: "Objeto tipo warehouse que contiene la información de la bodega";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly items: {
                        readonly description: "Array de objetos items que contiene contiene la información de los productos ajustados";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "object";
                            readonly additionalProperties: true;
                        };
                    };
                    readonly costCenter: {
                        readonly description: "Centro de costo asociado al ajuste de inventario.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly idResolution: {
                        readonly description: "Identificador de la numeración asignada al ajuste de inventario.";
                        readonly type: "string";
                    };
                    readonly prefix: {
                        readonly description: "Prefijo de la numeración asignada al ajuste de inventario.";
                        readonly type: "string";
                    };
                    readonly number: {
                        readonly description: "Numero de la numeración asignada al ajuste de inventario.";
                        readonly type: "string";
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetInventoryAdjustmentsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id del ajuste de inventario que se quiere consultar";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Inventory Adjustment Get";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un ajuste de inventario específico. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly date: {
                    readonly description: "Fecha del ajuste de inventario.";
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly observations: {
                    readonly description: "Observaciones del ajuste de inventario.";
                    readonly type: "string";
                };
                readonly warehouse: {
                    readonly description: "Objeto tipo warehouse que contiene la información de la bodega";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly items: {
                    readonly description: "Array de objetos items que contiene contiene la información de los productos ajustados";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                };
                readonly costCenter: {
                    readonly description: "Centro de costo asociado al ajuste de inventario.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly idResolution: {
                    readonly description: "Identificador de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
                readonly prefix: {
                    readonly description: "Prefijo de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
                readonly number: {
                    readonly description: "Numero de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetInventoryAdjustmentsNumerations: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual registro se desea consultar. Por ejemplo para consultar  desde el registro 20, se envía start=20";
                };
                readonly limit: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de registros a partir del inicio que se desea retornar.  Por defecto retorna 20 registros. Si este valor es menor que 1 o mayor que 30,  la aplicación retorna error.";
                };
                readonly name: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cadena de texto que se quiere utilizar para buscar las numeraciones que en su nombre contienen dicho texto";
                };
                readonly autoIncrement: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cuando es true retorna las numeraciones autoincrementales, y cuando es false se retornan las no autoIncrement";
                };
                readonly metadata: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro otro atributo \"data\" en donde se envían las numeraciones. Actualmente la información que se envía en metadata incluye el total de numeraciones que tiene registrada la empresa.";
                };
                readonly status: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtras las numeraciones por su estado, ya sea 'active' o 'inactive'";
                };
                readonly fields: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campos adicionales para retornar. Actualmente solo se puede enviar 'nextNumber'";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "InvAdjNumerationGet";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa una numeración específica. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre de la numeración.";
                        readonly type: "string";
                    };
                    readonly prefix: {
                        readonly description: "Prefijo de la numeración.";
                        readonly type: "string";
                    };
                    readonly autoIncrement: {
                        readonly description: "Tipo de numeración, ya sea autoincremental o no autoincremental.";
                        readonly type: "boolean";
                    };
                    readonly startNumber: {
                        readonly description: "Número inicial de la numeración.";
                        readonly type: "number";
                    };
                    readonly isDefault: {
                        readonly description: "Si es la numeración principal este campo será igual a true, de lo contrario será false.";
                        readonly type: "boolean";
                    };
                    readonly status: {
                        readonly description: "Estado de la numeración.\n\n`active` `inactive`";
                        readonly type: "string";
                        readonly enum: readonly ["active", "inactive"];
                    };
                    readonly nextNumber: {
                        readonly description: "Este campo debe ser requerido en los queryParams con 'fields'(fields='nextNumber') añade al esquema el siguiente número. Solo aplica a las numeraciones autoincrementales.";
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetInventoryAdjustmentsNumerationsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la numeración que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "InvAdjNumerationGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una numeración específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la numeración.";
                    readonly type: "string";
                };
                readonly prefix: {
                    readonly description: "Prefijo de la numeración.";
                    readonly type: "string";
                };
                readonly autoIncrement: {
                    readonly description: "Tipo de numeración, ya sea autoincremental o no autoincremental.";
                    readonly type: "boolean";
                };
                readonly startNumber: {
                    readonly description: "Número inicial de la numeración.";
                    readonly type: "number";
                };
                readonly isDefault: {
                    readonly description: "Si es la numeración principal este campo será igual a true, de lo contrario será false.";
                    readonly type: "boolean";
                };
                readonly status: {
                    readonly description: "Estado de la numeración.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly nextNumber: {
                    readonly description: "Este campo debe ser requerido en los queryParams con 'fields'(fields='nextNumber') añade al esquema el siguiente número. Solo aplica a las numeraciones autoincrementales.";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetItemCategories: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual categoría de item se quiere consultar. Por ejemplo para consultar desde el registro 20, se envía start=20";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de registros a partir del inicio que se desea retornar. Por defecto retorna 30 registros. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly metadata: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro atributo \"data\" en donde se envían las categoría de items. Actualmente la información que se envía en metadata incluye el total de categoría de items que tiene registrada la empresa.";
                };
                readonly order_field: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo por el cual ordenar. Valores posibles 'name'";
                };
                readonly status: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar categoría de items por estado. Se puede enviar  los estados: active, inactive";
                };
                readonly name: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar categoría de items por nombre";
                };
                readonly description: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar categoría de items por descripción";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ASC o DESC";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "ItemsCategoriesGet";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa una categoría de ítem. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre de la categoría de ítem.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción de la categoría de ítem.";
                        readonly type: "string";
                    };
                    readonly status: {
                        readonly description: "Indica el estado de la categoría de ítem. Las opciones posibles son.\n\n`active` `inactive`";
                        readonly type: "string";
                        readonly enum: readonly ["active", "inactive"];
                    };
                    readonly image: {
                        readonly description: "Objeto que contiene la información de la imagen de la categoría de ítem (Si existe).";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetItemCategoriesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la categoría de item que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ItemsCategoriesGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una categoría de ítem. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la categoría de ítem.";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción de la categoría de ítem.";
                    readonly type: "string";
                };
                readonly status: {
                    readonly description: "Indica el estado de la categoría de ítem. Las opciones posibles son.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly image: {
                    readonly description: "Objeto que contiene la información de la imagen de la categoría de ítem (Si existe).";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetItems: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual producto/servicio se quiere consultar. Por ejemplo para consultar desde el producto/servicio 20, se envía start=20.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de productos/servicios a partir del inicio que se desea retornar. Por defecto retorna 30 productos/servicios. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Orden ascendente o descendente en el cual se quieren retornar los productos/servicios. Opciones disponibles son DESC o ASC. Por defecto es ASC (ascendente).";
                };
                readonly order_field: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo por el cual se desea ordenar, las opciones posibles son name, id, reference, description.";
                };
                readonly query: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cadena de texto que se quiere utilizar para buscar los productos/servicios que en su nombre o referencia contienen dicho texto. Por ejemplo si se desea buscar los productos/servicios que contengan la palabra cuaderno, se envía query=cuaderno.";
                };
                readonly metadata: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos.  Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro \"data\" en donde se envían los productos.  Actualmente la información que se envía en metadata incluye el total de productos que tiene registrada la empresa.";
                };
                readonly idWarehouse: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de bodega/almacén. Si se especifica este parámetro se retornan únicamente los productos no inventariables y los inventariables que estén en la bodega/almacén.";
                };
                readonly name: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                };
                readonly reference: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Para Costa Rica, el atributo reference es un objeto compuesto por los siguientes atributos: `type(string`) tipo de referencia. Consulta el catálogo de parámetros correspondiente a cada país haciendo clic [aquí](https://developer.alegra.com/docs/costa-rica). `reference (string)` código de referencia establecido para el producto.";
                };
                readonly price: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio.  Los objetos deben contener: `idPriceList (number, obligatorio)`:identificador de la lista de precios; `price (double)` : precio en la lista.  Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price.  Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                };
                readonly priceList_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar por el id de la lista de precios.";
                };
                readonly idItemCategory: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de categoría de ítem. Si se especifica este parámetro se retornan únicamente los productos asociados a la categoría.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Indica el tipo de producto. Las opciones posibles son simple o kit";
                };
                readonly variantAttribute_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de atributo variante. Si se especifica este parámetro se retornan únicamente los productos que tengan el atributo variante enviado como parámetro.";
                };
                readonly variantAttributeOption_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la opción de un atributo variante. Si se especifica este parámetro se retornan únicamente los productos que tengan la opción enviada como parámetro.";
                };
                readonly variantParent_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del item con variantes (item padre). Si se especifica este parámetro se retornan únicamente los productos que sean variantes (hijos) del item padre..";
                };
                readonly customField_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del campo adicional. Si se especifica este parámetro se retornan únicamente los productos que tengan el campo adicional especificado.";
                };
                readonly customField_value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Valor del campo adicional. Si se especifica este parámetro se retornan únicamente los productos que tengan el valor especificado en el campo adicional. Este parámetro depende el parámetro `customField_id`";
                };
                readonly status: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Estado del producto o servicio, las opciones posibles son: active o inactive.  Se debe tener en cuenta que un producto o servicio que se encuentre inactivo no se puede editar; si se desea editar, se debe enviar entre los atributos que se van a editar el estado en active.";
                };
                readonly inventariable: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar items inventariables, envía true si deseas obtener únicamente items inventariables.";
                };
                readonly fields: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de atributos que se desean obtener en la respuesta separados por coma (,). Ej: variantAttributes (si se desean obtener atributos variantes),itemVariants (si se desean obtener items variantes),ledger (si se desea obtener la contabilidad del item).";
                };
                readonly mode: {
                    readonly enum: readonly ["advanced", "simple"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "El modo simple permite traer los items excluyendo los siguientes atributos: `category`, `attachments`, `customFields`, `itemCategory`, `inventory`(solo con la unidad dentro) e `images`; para los items de tipo combo se excluye también `subitems`, `kitWarehouse`; para los items con variantes: `itemVariants` y para los items variantes: `variantAttributes`. El modo avanzado retorna el item sin excluir ninguno de los atributos.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Item Get";
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                    readonly description: "Array con las opciones del atributo variante.";
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Colombia";
                readonly type: "object";
                readonly properties: {
                    readonly tariffHeading: {
                        readonly type: "string";
                        readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly brand: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly model: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Costa Rica";
                readonly type: "object";
                readonly properties: {
                    readonly reference: {
                        readonly description: "Objeto reference que indica la referencia del producto.";
                        readonly type: "object";
                        readonly properties: {
                            readonly reference: {
                                readonly description: "India el código de referencia establecido para el producto.";
                                readonly type: "string";
                            };
                            readonly type: {
                                readonly description: "Indica el tipo de referencia del producto.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly productKey: {
                        readonly description: "Indica la clave del producto";
                        readonly type: "string";
                    };
                    readonly tariffHeading: {
                        readonly description: "Cadena de 12 caracteres que indica la partida arancelaria de un ítem.";
                        readonly type: "string";
                    };
                };
            }, {
                readonly title: "Item Mexico";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la clave de producto o ProdServKey.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Panama";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la codificación panameña de bienes y servicios.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetItemsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id del producto o servicio que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly fields: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de atributos que se desean obtener en la respuesta separados por coma (,). Ej: variantAttributes (si se desean obtener atributos variantes),itemVariants (si se desean obtener items variantes),ledger (si se desea obtener la contabilidad del item).";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Item Get";
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                    readonly description: "Array con las opciones del atributo variante.";
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Colombia";
                readonly type: "object";
                readonly properties: {
                    readonly tariffHeading: {
                        readonly type: "string";
                        readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly brand: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly model: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Costa Rica";
                readonly type: "object";
                readonly properties: {
                    readonly reference: {
                        readonly description: "Objeto reference que indica la referencia del producto.";
                        readonly type: "object";
                        readonly properties: {
                            readonly reference: {
                                readonly description: "India el código de referencia establecido para el producto.";
                                readonly type: "string";
                            };
                            readonly type: {
                                readonly description: "Indica el tipo de referencia del producto.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly productKey: {
                        readonly description: "Indica la clave del producto";
                        readonly type: "string";
                    };
                    readonly tariffHeading: {
                        readonly description: "Cadena de 12 caracteres que indica la partida arancelaria de un ítem.";
                        readonly type: "string";
                    };
                };
            }, {
                readonly title: "Item Mexico";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la clave de producto o ProdServKey.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Panama";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la codificación panameña de bienes y servicios.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetPriceLists: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly query: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cadena de texto que se quiere utilizar para buscar las listas de precio que en su nombre contienen dicho texto";
                };
                readonly start: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual registro se desea consultar. Por ejemplo para consultar desde el registro 20, se envía start=20";
                };
                readonly limit: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de registros a partir del inicio que se desea retornar. Por defecto retorna 30 registros. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly metadata: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro otro atributo \"data\" en donde se envían las listas de precio. Actualmente la información que se envía en metadata incluye el total de listas de precio que tiene registrada la empresa.";
                };
                readonly order_field: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo por el cual ordenar. Valores posibles 'name', 'id'";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ASC o DESC";
                };
                readonly fields: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campos adicionales para retornar. Se puede enviar los siguientes valores separados por coma: editable,deletable";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "PricesListGet";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa una lista de precios específica. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre de la lista de precios";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción de la lista de precios.";
                        readonly type: "string";
                    };
                    readonly type: {
                        readonly description: "Tipo de lista de precios, amount: indica que la lista de precios establece un  valor específico, percentage: indica que la lista de precios descuenta el porcentaje  indicado del precio normal.\n\n`amount` `percentage`";
                        readonly type: "string";
                        readonly enum: readonly ["amount", "percentage"];
                    };
                    readonly percentage: {
                        readonly description: "Porcentaje que se aplica sobre el precio normal. Éste atributo únicamente se envía, cuando la lista es de tipo percentage";
                        readonly type: "number";
                    };
                    readonly status: {
                        readonly description: "Estado de la lista de precios.\n\n`active` `inactive`";
                        readonly type: "string";
                        readonly enum: readonly ["active", "inactive"];
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetPriceListsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la lista de precios que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "PricesListGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una lista de precios específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la lista de precios";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción de la lista de precios.";
                    readonly type: "string";
                };
                readonly type: {
                    readonly description: "Tipo de lista de precios, amount: indica que la lista de precios establece un  valor específico, percentage: indica que la lista de precios descuenta el porcentaje  indicado del precio normal.\n\n`amount` `percentage`";
                    readonly type: "string";
                    readonly enum: readonly ["amount", "percentage"];
                };
                readonly percentage: {
                    readonly description: "Porcentaje que se aplica sobre el precio normal. Éste atributo únicamente se envía, cuando la lista es de tipo percentage";
                    readonly type: "number";
                };
                readonly status: {
                    readonly description: "Estado de la lista de precios.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetVariantAttributes: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual variante se quiere consultar. Por ejemplo para consultar desde el registro 20, se envía start=20";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de registros a partir del inicio que se desea retornar. Por defecto retorna 30 registros. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly metadata: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro atributo \"data\" en donde se envían las variantes. Actualmente la información que se envía en metadata incluye el total de variantes que tiene registrada la empresa.";
                };
                readonly order_field: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo por el cual ordenar. Valores posibles 'name'";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ASC o DESC";
                };
                readonly fields: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campos adicionales para retornar. Se puede enviar los siguientes valores separados por coma: editable,deletable";
                };
                readonly name: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar variantes por nombre";
                };
                readonly options: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar variantes por opciones";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "VariantGet";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un atributo variante específico.  La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del atributo variante";
                        readonly type: "string";
                    };
                    readonly status: {
                        readonly description: "Estado del atributo variante.\n\n`active` `inactive`";
                        readonly type: "string";
                        readonly enum: readonly ["active", "inactive"];
                    };
                    readonly options: {
                        readonly description: "Array con las opciones disponibles para el atributo variante.";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly description: "Id de la opción.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly description: "Opción";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetVariantAttributesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la variante que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "VariantGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un atributo variante específico.  La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre del atributo variante";
                    readonly type: "string";
                };
                readonly status: {
                    readonly description: "Estado del atributo variante.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly options: {
                    readonly description: "Array con las opciones disponibles para el atributo variante.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly description: "Id de la opción.";
                                readonly type: "string";
                            };
                            readonly value: {
                                readonly description: "Opción";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetWarehouseTransfers: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual transferencia se quiere consultar";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de transferencias a partir del inicio que se desea retornar";
                };
                readonly item_id: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Recuperar las transferencias que ha tenido un ítem especifico";
                };
                readonly date: {
                    readonly type: "string";
                    readonly format: "date";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar transferencias por una fecha especifica";
                };
                readonly editable: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Retorna si la transferencia de bodegas se puede editar. Se debe enviar con el parámetro `fields`. Eje: `/warehouses?fields=editable";
                };
                readonly deletable: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Retorna si la transferencia de bodegas se puede eliminar. Se debe enviar con el parámetro `fields`. Eje: `/warehouses?fields=deletable";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Warehouses Transfer Get";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa una transferencia de bodegas específica. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly observations: {
                        readonly description: "Observaciones de la transferencia de bodegas.";
                        readonly type: "string";
                    };
                    readonly origin: {
                        readonly description: "Bodega origen de la transferencia.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly destination: {
                        readonly description: "Bodega destino de la transferencia.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly date: {
                        readonly description: "Fecha de la transferencia de bodega.";
                        readonly type: "string";
                        readonly format: "date";
                    };
                    readonly items: {
                        readonly description: "Array de objetos item (productos/servicios) de la transferencia.";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "object";
                            readonly additionalProperties: true;
                        };
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetWarehouseTransfersId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id de la transferencia que se quiere consultar";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Warehouses Transfer Get";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una transferencia de bodegas específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly observations: {
                    readonly description: "Observaciones de la transferencia de bodegas.";
                    readonly type: "string";
                };
                readonly origin: {
                    readonly description: "Bodega origen de la transferencia.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly destination: {
                    readonly description: "Bodega destino de la transferencia.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly date: {
                    readonly description: "Fecha de la transferencia de bodega.";
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly items: {
                    readonly description: "Array de objetos item (productos/servicios) de la transferencia.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetWarehouses: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly start: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Desde cual bodega se quiere consultar. Por ejemplo para consultar desde el registro 20, se envía start=20";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Cantidad de registros a partir del inicio que se desea retornar. Por defecto retorna 30 registros. Si este valor es mayor que 30, la aplicación retorna error.";
                };
                readonly metadata: {
                    readonly type: "boolean";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incluir en los resultados metadatos. Se debe tener en cuenta que si se envía este parámetro el objeto que retorna la aplicación incluye un atributo \"metadata\" y otro atributo \"data\" en donde se envían las bodegas. Actualmente la información que se envía en metadata incluye el total de bodegas que tiene registrada la empresa.";
                };
                readonly order_field: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campo por el cual ordenar. Valores posibles 'name', 'id'";
                };
                readonly order_direction: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ASC o DESC";
                };
                readonly fields: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Campos adicionales para retornar. Se puede enviar los siguientes valores separados por coma: editable,deletable";
                };
                readonly name: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar bodega por nombre";
                };
                readonly status: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Filtrar bodega por estado. Valores permitidos: 'active', 'inactive'";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "WarehouseGet";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa una bodega específica. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre de la bodega";
                        readonly type: "string";
                    };
                    readonly observations: {
                        readonly description: "Observaciones de la bodega";
                        readonly type: "string";
                    };
                    readonly address: {
                        readonly description: "Dirección de la bodega";
                        readonly type: "string";
                    };
                    readonly isDefault: {
                        readonly description: "Indica si la bodega es la principal de la compañía";
                        readonly type: "boolean";
                    };
                    readonly costCenter: {
                        readonly description: "El objeto costCenter indica el centro de costo asociado a la bodega";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly status: {
                        readonly description: "Estado de la bodega.\n\n`active` `inactive`";
                        readonly type: "string";
                        readonly enum: readonly ["active", "inactive"];
                    };
                };
                readonly type: "object";
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetWarehousesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la bodega que se desea consultar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "WarehouseGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una bodega específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la bodega";
                    readonly type: "string";
                };
                readonly observations: {
                    readonly description: "Observaciones de la bodega";
                    readonly type: "string";
                };
                readonly address: {
                    readonly description: "Dirección de la bodega";
                    readonly type: "string";
                };
                readonly isDefault: {
                    readonly description: "Indica si la bodega es la principal de la compañía";
                    readonly type: "boolean";
                };
                readonly costCenter: {
                    readonly description: "El objeto costCenter indica el centro de costo asociado a la bodega";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly status: {
                    readonly description: "Estado de la bodega.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostCustomFields: {
    readonly body: {
        readonly title: "CustomFieldPost";
        readonly required: readonly ["name", "resourceType", "type"];
        readonly properties: {
            readonly resourceType: {
                readonly description: "Recurso asociado al campo adicional.";
                readonly type: "string";
                readonly enum: readonly ["item"];
            };
            readonly name: {
                readonly description: "Indica el nombre del campo adicional.";
                readonly type: "string";
            };
            readonly description: {
                readonly description: "Descripción del campo adicional.";
                readonly type: "string";
            };
            readonly type: {
                readonly description: "Tipo de dato del campo adicional.";
                readonly type: "string";
                readonly enum: readonly [{
                    readonly text: "Indica que el campo es un campo de texto.";
                }, {
                    readonly int: "Indica que el campo es un campo numérico.";
                }, {
                    readonly date: "Indica que el campo es de tipo fecha.";
                }, {
                    readonly boolean: "indica que el campo es de tipo booleano (true o false)";
                }, {
                    readonly optionsList: "Indica que el campo es una lista de opciones pre-establecida.";
                }];
            };
            readonly defaultValue: {
                readonly description: "Indicar un valor por defecto del campo adicional";
                readonly type: "string";
            };
            readonly settings: {
                readonly description: "Objeto con la configuraciones del campo adicional.";
                readonly type: "object";
                readonly properties: {
                    readonly isRequired: {
                        readonly description: "Indica si el campo es obligatorio o no.";
                        readonly type: "boolean";
                    };
                    readonly printOnInvoices: {
                        readonly description: "Indica si el campo se desea imprimir en facturas.";
                        readonly type: "boolean";
                    };
                    readonly showInItemVariants: {
                        readonly description: "Indica si el campo se debe usar a nivel de items variantes o a nivel de item padre en items con variantes.";
                        readonly type: "boolean";
                    };
                };
            };
            readonly options: {
                readonly description: "Array de strings con las opciones disponibles para el campo adicional. Únicamente aplica cuando el tipo del campo es optionsList";
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly status: {
                readonly description: "Estado del campo adicional.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "CustomFieldGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un campo adicional específico.  La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Indica el nombre del campo adicional";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción del campo adicional.";
                    readonly type: "string";
                };
                readonly defaultValue: {
                    readonly description: "Indicar un valor por defecto";
                    readonly type: "string";
                };
                readonly resourceType: {
                    readonly description: "Recurso asociado al campo adicional.\n\n`item`";
                    readonly type: "string";
                    readonly enum: readonly ["item"];
                };
                readonly key: {
                    readonly description: "Key para identificar si el campo es un campo de sistema. Visita la lista de campos de sistema disponibles por país [aquí](https://developer.alegra.com/docs/campos-adicionales-de-sistema).";
                    readonly type: "string";
                };
                readonly type: {
                    readonly description: "Tipo de dato del campo adicional.\n\n`[object Object]` `[object Object]` `[object Object]` `[object Object]` `[object Object]`";
                    readonly type: "string";
                    readonly enum: readonly [{
                        readonly text: "Indica que el campo es un campo de texto.";
                    }, {
                        readonly int: "Indica que el campo es un campo numérico.";
                    }, {
                        readonly date: "Indica que el campo es de tipo fecha.";
                    }, {
                        readonly boolean: "indica que el campo es de tipo booleano (true o false)";
                    }, {
                        readonly optionsList: "Indica que el campo es una lista de opciones pre-establecida.";
                    }];
                };
                readonly settings: {
                    readonly description: "Objeto con la configuraciones del campo adicional.";
                    readonly type: "object";
                    readonly properties: {
                        readonly isRequired: {
                            readonly description: "Indica si el campo es obligatorio o no.";
                            readonly type: "boolean";
                        };
                        readonly printOnInvoices: {
                            readonly description: "Indica si el campo se desea imprimir en facturas.";
                            readonly type: "boolean";
                        };
                        readonly showInItemVariants: {
                            readonly description: "Indica si el campo se debe usar a nivel de items variantes o a nivel de item padre en items con variantes.";
                            readonly type: "boolean";
                        };
                    };
                };
                readonly options: {
                    readonly description: "Array de strings con las opciones disponibles para el campo adicional. Únicamente aplica cuando el tipo del campo es optionsList";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly status: {
                    readonly description: "Estado del campo adicional.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostInventoryAdjustments: {
    readonly body: {
        readonly title: "Inventory Adjustment Post";
        readonly properties: {
            readonly date: {
                readonly description: "Fecha del ajuste de inventario.";
                readonly type: "string";
                readonly format: "date";
                readonly examples: readonly ["2022-12-20"];
            };
            readonly observations: {
                readonly description: "Observaciones del ajuste de inventario.";
                readonly type: "string";
                readonly examples: readonly ["Observaciones de mi ajuste de inventario."];
            };
            readonly warehouse: {
                readonly description: "Objeto warehouse que contiene la bodega asociada al ajuste. Si no se envía, se toma la bodega principal. Debe contener el id de la bodega";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly costCenter: {
                readonly description: "Objeto costCenter que indica el centro de costo asociado. Debe contener el id del centro de costo";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly items: {
                readonly description: "Lista de objetos item (productos/servicios) asociados al ajuste de inventario.";
                readonly type: "array";
                readonly items: {
                    readonly properties: {
                        readonly id: {
                            readonly description: "identificador del producto o servicio.";
                            readonly type: "string";
                            readonly examples: readonly ["4"];
                        };
                        readonly type: {
                            readonly description: "Tipo de ajuste, 'in' indica incremento de unidades de inventario, 'out' indica disminución de unidades";
                            readonly type: "string";
                            readonly enum: readonly ["in", "out"];
                            readonly examples: readonly ["in"];
                        };
                        readonly unitCost: {
                            readonly description: "Costo unitario al que debe salir o ingresar las unidades.";
                            readonly type: "number";
                            readonly examples: readonly [1];
                        };
                        readonly quantity: {
                            readonly description: "Cantidades que se van a aumentar o disminuir";
                            readonly type: "number";
                            readonly examples: readonly [1];
                        };
                    };
                    readonly required: readonly ["id", "type", "unitCost", "quantity"];
                    readonly type: "object";
                };
            };
            readonly resolution: {
                readonly description: "Identificador de la numeración del tipo \"inventoryAdjustment\" que se desea asignar al ajuste de inventario.";
                readonly type: "string";
                readonly examples: readonly ["2"];
            };
            readonly prefix: {
                readonly description: "Prefijo para la numeración a usarse (se puede usar en caso de que se desee modificar momentaneamente la numeración).";
                readonly type: "string";
                readonly examples: readonly ["PREFIX"];
            };
            readonly number: {
                readonly description: "Numero para la numeración a usarse (se puede usar en caso de que se desee modificar momentaneamente la numeración).";
                readonly type: "integer";
                readonly examples: readonly [3];
            };
        };
        readonly required: readonly ["date", "items"];
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Inventory Adjustment Get";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un ajuste de inventario específico. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly date: {
                    readonly description: "Fecha del ajuste de inventario.";
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly observations: {
                    readonly description: "Observaciones del ajuste de inventario.";
                    readonly type: "string";
                };
                readonly warehouse: {
                    readonly description: "Objeto tipo warehouse que contiene la información de la bodega";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly items: {
                    readonly description: "Array de objetos items que contiene contiene la información de los productos ajustados";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                };
                readonly costCenter: {
                    readonly description: "Centro de costo asociado al ajuste de inventario.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly idResolution: {
                    readonly description: "Identificador de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
                readonly prefix: {
                    readonly description: "Prefijo de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
                readonly number: {
                    readonly description: "Numero de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostInventoryAdjustmentsNumerations: {
    readonly body: {
        readonly title: "InvAdjNumerationPost";
        readonly required: readonly ["name", "autoIncrement"];
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la numeración.";
                readonly type: "string";
            };
            readonly prefix: {
                readonly description: "Prefijo de la numeración.";
                readonly type: "string";
            };
            readonly autoIncrement: {
                readonly description: "Tipo de numeración, ya sea autoincremental o no autoincremental.";
                readonly type: "boolean";
            };
            readonly startNumber: {
                readonly description: "Número inicial de la numeración. Campo requerido si es una numeración autoincremental";
                readonly type: "number";
                readonly minimum: 1;
                readonly maximum: 999999999;
            };
            readonly isDefault: {
                readonly description: "Define si es la numeración principal. Solo puede existir una numeración principal";
                readonly type: "boolean";
            };
            readonly status: {
                readonly description: "Estado de la numeración.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "InvAdjNumerationGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una numeración específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la numeración.";
                    readonly type: "string";
                };
                readonly prefix: {
                    readonly description: "Prefijo de la numeración.";
                    readonly type: "string";
                };
                readonly autoIncrement: {
                    readonly description: "Tipo de numeración, ya sea autoincremental o no autoincremental.";
                    readonly type: "boolean";
                };
                readonly startNumber: {
                    readonly description: "Número inicial de la numeración.";
                    readonly type: "number";
                };
                readonly isDefault: {
                    readonly description: "Si es la numeración principal este campo será igual a true, de lo contrario será false.";
                    readonly type: "boolean";
                };
                readonly status: {
                    readonly description: "Estado de la numeración.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly nextNumber: {
                    readonly description: "Este campo debe ser requerido en los queryParams con 'fields'(fields='nextNumber') añade al esquema el siguiente número. Solo aplica a las numeraciones autoincrementales.";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostItemCategories: {
    readonly body: {
        readonly title: "ItemsCategoriesPost";
        readonly required: readonly ["name"];
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la categoría de ítem. Longitud máxima permitida es 100.";
                readonly type: "string";
            };
            readonly description: {
                readonly description: "Descripción de la categoría de ítem. Longitud máxima permitida es 500.";
                readonly type: "string";
            };
            readonly status: {
                readonly description: "Indica el estado de la categoría de ítem. Las opciones posibles son.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "ItemsCategoriesGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una categoría de ítem. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la categoría de ítem.";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción de la categoría de ítem.";
                    readonly type: "string";
                };
                readonly status: {
                    readonly description: "Indica el estado de la categoría de ítem. Las opciones posibles son.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly image: {
                    readonly description: "Objeto que contiene la información de la imagen de la categoría de ítem (Si existe).";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostItemCategoriesIdAttachment: {
    readonly body: {
        readonly properties: {
            readonly file: {
                readonly description: "Archivo que se desea asociar a una categoría de items.";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image: {
                readonly description: "Imagen que se desea asociar a la categoría de items.";
                readonly type: "string";
                readonly format: "binary";
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la categoría de item al cual se desea adjuntar el archivo o la imagen";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly id: {
                    readonly type: "integer";
                };
                readonly url: {
                    readonly type: "string";
                };
                readonly name: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostItems: {
    readonly body: {
        readonly oneOf: readonly [{
            readonly title: "Item General";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: unit (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; unitCost (number, obligatorio): Costo unitario del producto. initialQuantity (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos warehouse, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: id (integer, obligatorio) : Identificador de la bodega; initialQuantity (integer, obligatorio) : Cantidad inicial del producto en la bodega, minQuantity (integer): Cantidad mínima configurada para el producto en la bodega, maxQuantity (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa por versiones puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-generic.xlsx).";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item Colombia";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly productKey: {
                    readonly type: "string";
                    readonly description: "Código del producto o servicio. Para poder ver la lista de los codigos puedes  hacer [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/productkeys-inventory/productkey-col.xlsx)";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: `unit` (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; `unitCost` (number, obligatorio): Costo unitario del producto. `initialQuantity` (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos `warehouse`, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: `id` (integer, obligatorio) : Identificador de la bodega; `initialQuantity` (integer, obligatorio) : Cantidad inicial del producto en la bodega, `minQuantity` (integer): Cantidad mínima configurada para el producto en la bodega, `maxQuantity` (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-col.xlsx).";
                            readonly enum: readonly ["unit", "centimeter", "meter", "inch", "centimeterSquared", "meterSquared", "inchSquared", "mililiter", "liter", "gallon", "gram", "kilogram", "service", "par", "cubicMeterNet", "cubicMeter", "hour", "MIN", "DAY", "box", "drum"];
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly tariffHeading: {
                    readonly type: "string";
                    readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly brand: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly model: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item Costa Rica";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly description: "Objeto que indica la referencia del producto.";
                    readonly type: "object";
                    readonly properties: {
                        readonly reference: {
                            readonly type: "string";
                            readonly description: "Indica el código de referencia establecido para el producto.";
                        };
                        readonly type: {
                            readonly type: "string";
                            readonly description: "Indica el tipo de referencia del producto.";
                        };
                    };
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: `unit` (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, second, minute, hour, day, centimeter, milimeter, meter, inch, meterSquared, meterCubic, liter, gallon, gram, kilogram, ton, service, technicalServices, anotherTypeOfService ;`unitCost` (number, obligatorio): Costo unitario del producto. `initialQuantity` (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos `warehouse`, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: `id` (integer, obligatorio) : Identificador de la bodega; `initialQuantity` (integer, obligatorio) : Cantidad inicial del producto en la bodega, `minQuantity` (integer): Cantidad mínima configurada para el producto en la bodega, `maxQuantity` (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-cri.xlsx)";
                            readonly enum: readonly ["unit", "second", "minute", "hour", "day", "centimeter", "milimeter", "meter", "inch", "meterSquared", "meterCubic", "liter", "gallon", "gram", "kilogram", "ton", "service", "technicalServices", "anotherTypeOfService"];
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly productKey: {
                    readonly type: "string";
                    readonly description: "Código del producto o servicio. Para poder ver la lista de los codigos puedes  hacer [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/productkeys-inventory/productkey-cri.xlsx)";
                };
                readonly tariffHeading: {
                    readonly type: "string";
                    readonly description: "Cadena de 12 caracteres que indica la partida arancelaria de un ítem.";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item Panama";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: `unit` (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; `unitCost` (number, obligatorio): Costo unitario del producto. `initialQuantity` (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos `warehouse`, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: `id` (integer, obligatorio) : Identificador de la bodega; `initialQuantity` (integer, obligatorio) : Cantidad inicial del producto en la bodega, `minQuantity` (integer): Cantidad mínima configurada para el producto en la bodega, `maxQuantity` (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-pan.xlsx).";
                            readonly enum: readonly ["unit", "centimeter", "meter", "inch", "mililiter", "centimeterSquared", "meterSquared", "inchSquared", "liter", "gallon", "gram", "kilogram", "service", "par", "cubicMeterNet", "cubicMeter", "min", "hour", "day", "box"];
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "string";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly ["3"];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly productKey: {
                    readonly type: "string";
                    readonly description: "Código del producto o servicio. Para poder ver la lista de los codigos puedes  hacer [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/productkeys-inventory/productkey-pan.xlsx)";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item Perú";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly productKey: {
                    readonly type: "string";
                    readonly description: "Código del producto o servicio. Para poder ver la lista de los codigos puedes  hacer [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/productkeys-inventory/productkey-per.xlsx)";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: `unit` (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; `unitCost` (number, obligatorio): Costo unitario del producto. `initialQuantity` (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos `warehouse`, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: `id` (integer, obligatorio) : Identificador de la bodega; `initialQuantity` (integer, obligatorio) : Cantidad inicial del producto en la bodega, `minQuantity` (integer): Cantidad mínima configurada para el producto en la bodega, `maxQuantity` (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-per.xlsx).";
                            readonly enum: readonly ["unit", "centimeter", "meter", "inch", "centimeterSquared", "meterSquared", "inchSquared", "mililiter", "liter", "gallon", "gram", "kilogram", "service", "par", "cubicMeterNet", "cubicMeter", "hour", "MIN", "DAY", "box", "drum"];
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly [2];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly [12345678];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly tariffHeading: {
                    readonly type: "string";
                    readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly brand: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly model: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Items Mexico";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: `unit` (string, obligatorio): Unidad de medida del producto. Los valores posibles puedes visualizarlos haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-mex.xlsx). ;`unitCost` (number, obligatorio): Costo unitario del producto. `initialQuantity` (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos `warehouse`, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: `id` (integer, obligatorio) : Identificador de la bodega; `initialQuantity` (integer, obligatorio) : Cantidad inicial del producto en la bodega, `minQuantity` (integer): Cantidad mínima configurada para el producto en la bodega, `maxQuantity` (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-mex.xlsx).";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly [12345678];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly productKey: {
                    readonly type: "string";
                    readonly description: "Código del producto o servicio. Para poder ver la lista de los codigos puedes  hacer [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/productkeys-inventory/productkey-mex.xlsx)";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item Perú";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                            readonly description: "Tipo de referencia del producto";
                        };
                        readonly reference: {
                            readonly type: "string";
                            readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                        };
                    };
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: `unit` (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; `unitCost` (number, obligatorio): Costo unitario del producto. `initialQuantity` (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos `warehouse`, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: `id` (integer, obligatorio) : Identificador de la bodega; `initialQuantity` (integer, obligatorio) : Cantidad inicial del producto en la bodega, `minQuantity` (integer): Cantidad mínima configurada para el producto en la bodega, `maxQuantity` (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-dom.xlsx).";
                            readonly enum: readonly ["unit", "centimeter", "meter", "inch", "centimeterSquared", "meterSquared", "inchSquared", "mililiter", "liter", "gallon", "gram", "kilogram", "service", "par", "cubicMeterNet", "cubicMeter", "hour", "MIN", "DAY", "box", "drum"];
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly [1];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly tariffHeading: {
                    readonly type: "string";
                    readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly brand: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly model: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item del tipo servicio";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del servicio. Longitud máxima permitida: 150.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del servicio. Longitud máxima permitida: 500.";
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Indica el tipo de ítem. Para la creacion de un servicio, este parámetro debe contener el valor 'service'";
                };
                readonly unit: {
                    readonly type: "string";
                    readonly description: "Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable, etc.";
                };
            };
            readonly required: readonly ["name", "price"];
        }, {
            readonly title: "Item del tipo variante";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del servicio. Longitud máxima permitida: 150.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del servicio. Longitud máxima permitida: 500.";
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                };
                                readonly price: {
                                    readonly type: "number";
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Indica el tipo de ítem. Para la creacion de un servicio, este parámetro debe contener el valor 'variantParent'";
                };
                readonly inventory: {
                    readonly description: "Propiedades del inventario de los items variantes";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa por versiones puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-generic.xlsx).";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                    };
                    readonly type: "object";
                };
                readonly variantAttributes: {
                    readonly description: "Atributos variantes que se asociaran al item";
                    readonly type: "array";
                    readonly items: {
                        readonly properties: {
                            readonly id: {
                                readonly description: "Identificador de la variante";
                                readonly type: "string";
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly description: "Array de opciones";
                                readonly items: {
                                    readonly properties: {
                                        readonly id: {
                                            readonly description: "Identificador de la opcion";
                                            readonly type: "string";
                                        };
                                    };
                                    readonly type: "object";
                                };
                            };
                        };
                        readonly type: "object";
                    };
                };
                readonly itemVariants: {
                    readonly description: "Ítems variantes que se asignar";
                    readonly type: "array";
                    readonly items: {
                        readonly properties: {
                            readonly inventory: {
                                readonly properties: {
                                    readonly initialQuantity: {
                                        readonly description: "Cantidad inicial de la variante";
                                        readonly type: "integer";
                                    };
                                    readonly maxQuantity: {
                                        readonly description: "Cantidad máxima de la variante";
                                        readonly type: "integer";
                                    };
                                    readonly minQuantity: {
                                        readonly description: "Cantidad mínima de la variante";
                                        readonly type: "integer";
                                    };
                                };
                                readonly type: "object";
                            };
                            readonly variantAttributes: {
                                readonly description: "Atributos variantes que se asociaran al item";
                                readonly type: "array";
                                readonly items: {
                                    readonly properties: {
                                        readonly id: {
                                            readonly description: "Identificador de la variante";
                                            readonly type: "string";
                                        };
                                        readonly options: {
                                            readonly type: "array";
                                            readonly description: "Array de opciones";
                                            readonly items: {
                                                readonly properties: {
                                                    readonly id: {
                                                        readonly description: "Identificador de la opcion";
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly type: "object";
                                            };
                                        };
                                    };
                                    readonly type: "object";
                                };
                            };
                        };
                        readonly type: "object";
                    };
                };
            };
            readonly required: readonly ["name", "price"];
        }];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Item Get";
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                    readonly description: "Array con las opciones del atributo variante.";
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Colombia";
                readonly type: "object";
                readonly properties: {
                    readonly tariffHeading: {
                        readonly type: "string";
                        readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly brand: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly model: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Costa Rica";
                readonly type: "object";
                readonly properties: {
                    readonly reference: {
                        readonly description: "Objeto reference que indica la referencia del producto.";
                        readonly type: "object";
                        readonly properties: {
                            readonly reference: {
                                readonly description: "India el código de referencia establecido para el producto.";
                                readonly type: "string";
                            };
                            readonly type: {
                                readonly description: "Indica el tipo de referencia del producto.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly productKey: {
                        readonly description: "Indica la clave del producto";
                        readonly type: "string";
                    };
                    readonly tariffHeading: {
                        readonly description: "Cadena de 12 caracteres que indica la partida arancelaria de un ítem.";
                        readonly type: "string";
                    };
                };
            }, {
                readonly title: "Item Mexico";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la clave de producto o ProdServKey.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Panama";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la codificación panameña de bienes y servicios.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                };
                readonly code: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostItemsIdAttachment: {
    readonly body: {
        readonly properties: {
            readonly file: {
                readonly description: "Archivo que se desea asociar a un producto o servicio.";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image: {
                readonly description: "Imagen que se desea asociar al producto o servicio.";
                readonly type: "string";
                readonly format: "binary";
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del producto o servicio al cual se desea adjuntar el archivo o la imagen";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly id: {
                    readonly type: "integer";
                };
                readonly url: {
                    readonly type: "string";
                };
                readonly name: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostPriceLists: {
    readonly body: {
        readonly title: "PricesListPost";
        readonly required: readonly ["name", "type"];
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la lista de precios. Longitud máxima permitida: 90.";
                readonly type: "string";
            };
            readonly description: {
                readonly description: "Descripción de la lista de precios.";
                readonly type: "string";
            };
            readonly type: {
                readonly description: "Tipo de la lista de precios, los valores posibles son: amount (valor) y  percentage (porcentaje) con este tipo el parámetro percentage es obligatorio.";
                readonly type: "string";
                readonly enum: readonly ["amount", "percentage"];
            };
            readonly percentage: {
                readonly description: "Valor del porcentaje, si el tipo de la lista de precios es percentage entonces este parámetro es obligatorio.";
                readonly type: "number";
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "PricesListGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una lista de precios específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la lista de precios";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción de la lista de precios.";
                    readonly type: "string";
                };
                readonly type: {
                    readonly description: "Tipo de lista de precios, amount: indica que la lista de precios establece un  valor específico, percentage: indica que la lista de precios descuenta el porcentaje  indicado del precio normal.\n\n`amount` `percentage`";
                    readonly type: "string";
                    readonly enum: readonly ["amount", "percentage"];
                };
                readonly percentage: {
                    readonly description: "Porcentaje que se aplica sobre el precio normal. Éste atributo únicamente se envía, cuando la lista es de tipo percentage";
                    readonly type: "number";
                };
                readonly status: {
                    readonly description: "Estado de la lista de precios.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostVariantAttributes: {
    readonly body: {
        readonly title: "VariantPost";
        readonly required: readonly ["name", "options"];
        readonly properties: {
            readonly name: {
                readonly description: "Nombre del atributo variante";
                readonly type: "string";
            };
            readonly options: {
                readonly description: "Array con las opciones disponibles para el atributo variante.";
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Id de la opción.";
                            readonly type: "string";
                        };
                        readonly value: {
                            readonly description: "Opción";
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly status: {
                readonly description: "Estado del atributo variante.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "VariantGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un atributo variante específico.  La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre del atributo variante";
                    readonly type: "string";
                };
                readonly status: {
                    readonly description: "Estado del atributo variante.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly options: {
                    readonly description: "Array con las opciones disponibles para el atributo variante.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly description: "Id de la opción.";
                                readonly type: "string";
                            };
                            readonly value: {
                                readonly description: "Opción";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostWarehouseTransfers: {
    readonly body: {
        readonly title: "Warehouses Transfer Put";
        readonly properties: {
            readonly observations: {
                readonly description: "Observaciones de la transferencia de bodegas.";
                readonly type: "string";
                readonly examples: readonly ["Descripción de mi transferencia de bodegas."];
            };
            readonly origin: {
                readonly description: "Bodega origen de la transferencia.";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly destination: {
                readonly description: "Bodega destino de la transferencia.";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly date: {
                readonly description: "Fecha de la transferencia de bodega.";
                readonly type: "string";
                readonly format: "date";
                readonly examples: readonly ["2023-01-31"];
            };
            readonly items: {
                readonly description: "Array de objetos item (productos/servicios) que se van transferir.";
                readonly type: "array";
                readonly items: {
                    readonly properties: {
                        readonly id: {
                            readonly description: "identificador del producto o servicio.";
                            readonly type: "string";
                            readonly examples: readonly ["4"];
                        };
                        readonly quantity: {
                            readonly description: "Cantidades que se van a transferir.";
                            readonly type: "number";
                            readonly examples: readonly [10];
                        };
                    };
                    readonly required: readonly ["id", "quantity"];
                    readonly type: "object";
                };
            };
        };
        readonly required: readonly ["origin", "destination", "items", "date"];
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Warehouses Transfer Put";
            readonly properties: {
                readonly observations: {
                    readonly description: "Observaciones de la transferencia de bodegas.";
                    readonly type: "string";
                    readonly examples: readonly ["Descripción de mi transferencia de bodegas."];
                };
                readonly origin: {
                    readonly description: "Bodega origen de la transferencia.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly destination: {
                    readonly description: "Bodega destino de la transferencia.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly date: {
                    readonly description: "Fecha de la transferencia de bodega.";
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2023-01-31"];
                };
                readonly items: {
                    readonly description: "Array de objetos item (productos/servicios) que se van transferir.";
                    readonly type: "array";
                    readonly items: {
                        readonly properties: {
                            readonly id: {
                                readonly description: "identificador del producto o servicio.";
                                readonly type: "string";
                                readonly examples: readonly ["4"];
                            };
                            readonly quantity: {
                                readonly description: "Cantidades que se van a transferir.";
                                readonly type: "number";
                                readonly examples: readonly [10];
                            };
                        };
                        readonly required: readonly ["id", "quantity"];
                        readonly type: "object";
                    };
                };
            };
            readonly required: readonly ["origin", "destination", "items", "date"];
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostWarehouses: {
    readonly body: {
        readonly title: "WarehousePost";
        readonly required: readonly ["name"];
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la bodega";
                readonly type: "string";
            };
            readonly observations: {
                readonly description: "Observaciones de la bodega";
                readonly type: "string";
            };
            readonly address: {
                readonly description: "Dirección de la bodega";
                readonly type: "string";
            };
            readonly costCenter: {
                readonly description: "El objeto costCenter indica que se desea asociar un centro de costo. Si se desea asociar el centro de costo en Alegra, se debe mandar este objeto con el siguiente atributo : id (int) : Identificador del centro de costo.";
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly description: "Representa el identificador del centro de costo que queremos asociar";
                        readonly type: "string";
                    };
                };
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "WarehouseGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una bodega específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la bodega";
                    readonly type: "string";
                };
                readonly observations: {
                    readonly description: "Observaciones de la bodega";
                    readonly type: "string";
                };
                readonly address: {
                    readonly description: "Dirección de la bodega";
                    readonly type: "string";
                };
                readonly isDefault: {
                    readonly description: "Indica si la bodega es la principal de la compañía";
                    readonly type: "boolean";
                };
                readonly costCenter: {
                    readonly description: "El objeto costCenter indica el centro de costo asociado a la bodega";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly status: {
                    readonly description: "Estado de la bodega.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutCustomFieldsId: {
    readonly body: {
        readonly title: "CustomFieldPut";
        readonly properties: {
            readonly name: {
                readonly description: "Indica el nombre del campo adicional.";
                readonly type: "string";
            };
            readonly description: {
                readonly description: "Descripción del campo adicional.";
                readonly type: "string";
            };
            readonly type: {
                readonly description: "Tipo de dato del campo adicional.";
                readonly type: "string";
                readonly enum: readonly [{
                    readonly text: "Indica que el campo es un campo de texto.";
                }, {
                    readonly int: "Indica que el campo es un campo numérico.";
                }, {
                    readonly date: "Indica que el campo es de tipo fecha.";
                }, {
                    readonly boolean: "indica que el campo es de tipo booleano (true o false)";
                }, {
                    readonly optionsList: "Indica que el campo es una lista de opciones pre-establecida.";
                }];
            };
            readonly defaultValue: {
                readonly description: "Indicar un valor por defecto del campo adicional";
                readonly type: "string";
            };
            readonly settings: {
                readonly description: "Objeto con la configuraciones del campo adicional.";
                readonly type: "object";
                readonly properties: {
                    readonly isRequired: {
                        readonly description: "Indica si el campo es obligatorio o no.";
                        readonly type: "boolean";
                    };
                    readonly printOnInvoices: {
                        readonly description: "Indica si el campo se desea imprimir en facturas.";
                        readonly type: "boolean";
                    };
                    readonly showInItemVariants: {
                        readonly description: "Indica si el campo se debe usar a nivel de items variantes o a nivel de item padre en items con variantes.";
                        readonly type: "boolean";
                    };
                };
            };
            readonly options: {
                readonly description: "Array de strings con las opciones disponibles para el campo adicional. Únicamente aplica cuando el tipo del campo es optionsList";
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly status: {
                readonly description: "Estado del campo adicional.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del campo adicional que se quiere editar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "CustomFieldGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un campo adicional específico.  La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Indica el nombre del campo adicional";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción del campo adicional.";
                    readonly type: "string";
                };
                readonly defaultValue: {
                    readonly description: "Indicar un valor por defecto";
                    readonly type: "string";
                };
                readonly resourceType: {
                    readonly description: "Recurso asociado al campo adicional.\n\n`item`";
                    readonly type: "string";
                    readonly enum: readonly ["item"];
                };
                readonly key: {
                    readonly description: "Key para identificar si el campo es un campo de sistema. Visita la lista de campos de sistema disponibles por país [aquí](https://developer.alegra.com/docs/campos-adicionales-de-sistema).";
                    readonly type: "string";
                };
                readonly type: {
                    readonly description: "Tipo de dato del campo adicional.\n\n`[object Object]` `[object Object]` `[object Object]` `[object Object]` `[object Object]`";
                    readonly type: "string";
                    readonly enum: readonly [{
                        readonly text: "Indica que el campo es un campo de texto.";
                    }, {
                        readonly int: "Indica que el campo es un campo numérico.";
                    }, {
                        readonly date: "Indica que el campo es de tipo fecha.";
                    }, {
                        readonly boolean: "indica que el campo es de tipo booleano (true o false)";
                    }, {
                        readonly optionsList: "Indica que el campo es una lista de opciones pre-establecida.";
                    }];
                };
                readonly settings: {
                    readonly description: "Objeto con la configuraciones del campo adicional.";
                    readonly type: "object";
                    readonly properties: {
                        readonly isRequired: {
                            readonly description: "Indica si el campo es obligatorio o no.";
                            readonly type: "boolean";
                        };
                        readonly printOnInvoices: {
                            readonly description: "Indica si el campo se desea imprimir en facturas.";
                            readonly type: "boolean";
                        };
                        readonly showInItemVariants: {
                            readonly description: "Indica si el campo se debe usar a nivel de items variantes o a nivel de item padre en items con variantes.";
                            readonly type: "boolean";
                        };
                    };
                };
                readonly options: {
                    readonly description: "Array de strings con las opciones disponibles para el campo adicional. Únicamente aplica cuando el tipo del campo es optionsList";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly status: {
                    readonly description: "Estado del campo adicional.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutInventoryAdjustmentsId: {
    readonly body: {
        readonly title: "Inventory Adjustment Put";
        readonly properties: {
            readonly date: {
                readonly description: "Fecha de la edición del ajuste de inventario.";
                readonly type: "string";
                readonly format: "date";
                readonly examples: readonly ["2022-12-21"];
            };
            readonly observations: {
                readonly description: "Observaciones del ajuste de inventario.";
                readonly type: "string";
                readonly examples: readonly ["Observaciones de mi ajuste de inventario editado."];
            };
            readonly warehouse: {
                readonly description: "Objeto warehouse que contiene la bodega asociada al ajuste. Si no se envía, se toma la bodega principal. Debe contener el id de la bodega";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly costCenter: {
                readonly description: "Objeto costCenter que indica el centro de costo asociado. Debe contener el id del centro de costo";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly items: {
                readonly description: "Lista de objetos item (productos/servicios) asociados al ajuste de inventario.";
                readonly type: "array";
                readonly items: {
                    readonly properties: {
                        readonly id: {
                            readonly description: "identificador del producto o servicio.";
                            readonly type: "string";
                            readonly examples: readonly ["4"];
                        };
                        readonly type: {
                            readonly description: "Tipo de ajuste, 'in' indica incremento de unidades de inventario, 'out' indica disminución de unidades";
                            readonly type: "string";
                            readonly enum: readonly ["in", "out"];
                            readonly examples: readonly ["in"];
                        };
                        readonly unitCost: {
                            readonly description: "Costo unitario al que debe salir o ingresar las unidades.";
                            readonly type: "number";
                            readonly examples: readonly [1];
                        };
                        readonly quantity: {
                            readonly description: "Cantidades que se van a aumentar o disminuir";
                            readonly type: "number";
                            readonly examples: readonly [1];
                        };
                    };
                    readonly required: readonly ["id", "type", "unitCost", "quantity"];
                    readonly type: "object";
                };
            };
            readonly resolution: {
                readonly description: "Identificador de la numeración del tipo \"inventoryAdjustment\" que se desea asignar al ajuste de inventario.";
                readonly type: "string";
                readonly examples: readonly ["2"];
            };
            readonly prefix: {
                readonly description: "Prefijo para la numeración a usarse (se puede usar en caso de que se desee modificar momentaneamente la numeración).";
                readonly type: "string";
                readonly examples: readonly ["PREFIX"];
            };
            readonly number: {
                readonly description: "Numero para la numeración a usarse (se puede usar en caso de que se desee modificar momentaneamente la numeración).";
                readonly type: "integer";
                readonly examples: readonly [3];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id del ajuste de inventario que se quiere editar";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Inventory Adjustment Get";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un ajuste de inventario específico. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly date: {
                    readonly description: "Fecha del ajuste de inventario.";
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly observations: {
                    readonly description: "Observaciones del ajuste de inventario.";
                    readonly type: "string";
                };
                readonly warehouse: {
                    readonly description: "Objeto tipo warehouse que contiene la información de la bodega";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly items: {
                    readonly description: "Array de objetos items que contiene contiene la información de los productos ajustados";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                };
                readonly costCenter: {
                    readonly description: "Centro de costo asociado al ajuste de inventario.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly idResolution: {
                    readonly description: "Identificador de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
                readonly prefix: {
                    readonly description: "Prefijo de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
                readonly number: {
                    readonly description: "Numero de la numeración asignada al ajuste de inventario.";
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutInventoryAdjustmentsNumerationsId: {
    readonly body: {
        readonly title: "InvAdjNumerationPut";
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la numeración.";
                readonly type: "string";
            };
            readonly prefix: {
                readonly description: "Prefijo de la numeración.";
                readonly type: "string";
            };
            readonly autoIncrement: {
                readonly description: "Tipo de numeración, ya sea autoincremental o no autoincremental.";
                readonly type: "boolean";
            };
            readonly startNumber: {
                readonly description: "Número inicial de la numeración. Campo requerido si es una numeración autoincremental";
                readonly type: "number";
                readonly minimum: 1;
                readonly maximum: 999999999;
            };
            readonly isDefault: {
                readonly description: "Define si es la numeración principal. Solo puede existir una numeración principal";
                readonly type: "boolean";
            };
            readonly status: {
                readonly description: "Estado de la numeración.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la numeración que se quiere editar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "InvAdjNumerationGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una numeración específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la numeración.";
                    readonly type: "string";
                };
                readonly prefix: {
                    readonly description: "Prefijo de la numeración.";
                    readonly type: "string";
                };
                readonly autoIncrement: {
                    readonly description: "Tipo de numeración, ya sea autoincremental o no autoincremental.";
                    readonly type: "boolean";
                };
                readonly startNumber: {
                    readonly description: "Número inicial de la numeración.";
                    readonly type: "number";
                };
                readonly isDefault: {
                    readonly description: "Si es la numeración principal este campo será igual a true, de lo contrario será false.";
                    readonly type: "boolean";
                };
                readonly status: {
                    readonly description: "Estado de la numeración.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly nextNumber: {
                    readonly description: "Este campo debe ser requerido en los queryParams con 'fields'(fields='nextNumber') añade al esquema el siguiente número. Solo aplica a las numeraciones autoincrementales.";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutItemCategoriesId: {
    readonly body: {
        readonly title: "ItemsCategoriesPut";
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la categoría de ítem. Longitud máxima permitida es 100.";
                readonly type: "string";
            };
            readonly description: {
                readonly description: "Descripción de la categoría de ítem. Longitud máxima permitida es 500.";
                readonly type: "string";
            };
            readonly status: {
                readonly description: "Indica el estado de la categoría de ítem. Las opciones posibles son.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la categoría de item que se quiere editar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ItemsCategoriesGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una categoría de ítem. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la categoría de ítem.";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción de la categoría de ítem.";
                    readonly type: "string";
                };
                readonly status: {
                    readonly description: "Indica el estado de la categoría de ítem. Las opciones posibles son.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly image: {
                    readonly description: "Objeto que contiene la información de la imagen de la categoría de ítem (Si existe).";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutItemsId: {
    readonly body: {
        readonly oneOf: readonly [{
            readonly title: "Item General";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: unit (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; unitCost (number, obligatorio): Costo unitario del producto. initialQuantity (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos warehouse, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: id (integer, obligatorio) : Identificador de la bodega; initialQuantity (integer, obligatorio) : Cantidad inicial del producto en la bodega, minQuantity (integer): Cantidad mínima configurada para el producto en la bodega, maxQuantity (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto.";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
            };
        }, {
            readonly title: "Item Colombia";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: unit (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; unitCost (number, obligatorio): Costo unitario del producto. initialQuantity (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos warehouse, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: id (integer, obligatorio) : Identificador de la bodega; initialQuantity (integer, obligatorio) : Cantidad inicial del producto en la bodega, minQuantity (integer): Cantidad mínima configurada para el producto en la bodega, maxQuantity (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto.";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly tariffHeading: {
                    readonly type: "string";
                    readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly brand: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                };
                readonly model: {
                    readonly type: "string";
                    readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                };
            };
        }, {
            readonly title: "Item Costa Rica";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly description: "Objeto que indica la referencia del producto.";
                    readonly type: "object";
                    readonly properties: {
                        readonly reference: {
                            readonly type: "string";
                            readonly description: "Indica el código de referencia establecido para el producto.";
                        };
                        readonly type: {
                            readonly type: "string";
                            readonly description: "Indica el tipo de referencia del producto.";
                        };
                    };
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: unit (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; unitCost (number, obligatorio): Costo unitario del producto. initialQuantity (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos warehouse, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: id (integer, obligatorio) : Identificador de la bodega; initialQuantity (integer, obligatorio) : Cantidad inicial del producto en la bodega, minQuantity (integer): Cantidad mínima configurada para el producto en la bodega, maxQuantity (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto.";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly productKey: {
                    readonly type: "string";
                    readonly description: "Indica la clave del producto";
                };
                readonly tariffHeading: {
                    readonly type: "string";
                    readonly description: "Cadena de 12 caracteres que indica la partida arancelaria de un ítem.";
                };
            };
        }, {
            readonly title: "Items Panama";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: unit (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; unitCost (number, obligatorio): Costo unitario del producto. initialQuantity (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos warehouse, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: id (integer, obligatorio) : Identificador de la bodega; initialQuantity (integer, obligatorio) : Cantidad inicial del producto en la bodega, minQuantity (integer): Cantidad mínima configurada para el producto en la bodega, maxQuantity (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto.";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly [2];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly [3];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly productKey: {
                    readonly description: "Indica la codificación panameña de bienes y servicios.";
                    readonly type: "string";
                };
            };
        }, {
            readonly title: "Item Mexico";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del producto o servicio. Longitud máxima permitida: 150.";
                    readonly examples: readonly ["Mi item"];
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del producto o servicio. Longitud máxima permitida: 500.";
                    readonly examples: readonly ["Descripción del item"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly description: "Referencia del producto o servicio. Longitud máxima permitida: 45.";
                    readonly examples: readonly ["referencia"];
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                        readonly description: "Valor con el precio del producto";
                        readonly examples: readonly [25];
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador de la lista de precio";
                                    readonly examples: readonly ["2"];
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "precio del producto para la lista de precio idPriceList";
                                    readonly examples: readonly [10];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly category: {
                    readonly type: "object";
                    readonly description: "Objeto categoría que contiene el id de la categoría de Alegra a la cual se desea asociar el producto o servicio. Si no se envía este atributo el producto o servicio queda asociado a la categoría de Ventas.";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Identificador de la categoría.";
                            readonly type: "string";
                            readonly examples: readonly ["5056"];
                        };
                    };
                };
                readonly inventory: {
                    readonly type: "object";
                    readonly description: "Indica los atributos del inventario del producto. Si es un servicio este atributo se debe omitir. Este objeto debe contener los siguientes atributos: unit (string, obligatorio): Unidad de medida del producto. Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable; unitCost (number, obligatorio): Costo unitario del producto. initialQuantity (number, obligatorio): Cantidad inicial del producto. Si se desea distribuir el producto en bodegas se debe adicionar un array con objetos warehouse, el cual contiene las bodegas en las cuales se desea distribuir el inventario. Cada objeto warehouse debe contener los siguientes atributos: id (integer, obligatorio) : Identificador de la bodega; initialQuantity (integer, obligatorio) : Cantidad inicial del producto en la bodega, minQuantity (integer): Cantidad mínima configurada para el producto en la bodega, maxQuantity (integer): Cantidad máxima configurada para el producto en la bodega.";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto.";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                        readonly warehouses: {
                            readonly type: "array";
                            readonly description: "Lista de bodegas a las que está asociado el producto.";
                            readonly items: {
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la bodega";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly initialQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad inicial del producto en la bodega";
                                        readonly examples: readonly [4];
                                    };
                                    readonly minQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad mínima del producto en la bodega.";
                                        readonly examples: readonly [2];
                                    };
                                    readonly maxQuantity: {
                                        readonly type: "integer";
                                        readonly description: "Cantidad máxima del producto en la bodega.";
                                        readonly examples: readonly [10];
                                    };
                                };
                                readonly type: "object";
                            };
                        };
                    };
                };
                readonly tax: {
                    readonly description: "Array con objeto que tiene como atributo el id del impuesto que se desea asociar al producto/servicio. Se puede enviar el id del impuesto directamente.";
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "id del impuesto a asociar";
                        readonly examples: readonly ["2"];
                    }, {
                        readonly type: "array";
                        readonly description: "Lista de impuestos asociados al producto";
                        readonly items: {
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "id del impuesto a asociar";
                                    readonly examples: readonly ["2"];
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["product", "service", "variantParent", "kit"];
                    readonly description: "Indica el tipo de producto. Las opciones posibles son product,  service, variantParent y kit";
                    readonly examples: readonly ["product"];
                };
                readonly customFields: {
                    readonly type: "array";
                    readonly description: "Arreglo con objetos que representa los campos adicionales del ítem. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del campo adicional. value (string) valor a asignar en el campo adicional para el item.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador del campo adocional.";
                                readonly examples: readonly ["1"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "Valor del campo adicional en el item.";
                                readonly examples: readonly ["12345678"];
                            };
                        };
                    };
                };
                readonly subitems: {
                    readonly type: "array";
                    readonly description: "Indica los subitems de un kit. Obligatorio si el atributo type del producto es kit. Array que indica los items que componen un kit. Por cada subitem que se desee agregar se debe indicar la cantidad del item que compone el kit y el atributo item, el cual es un objeto que contiene el atributo id que indica el identificador del producto que se desea asociar al producto.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly item: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador del item.";
                                        readonly examples: readonly ["1"];
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "string";
                                readonly description: "Cantidad del item en el combo.";
                                readonly examples: readonly ["3"];
                            };
                        };
                    };
                };
                readonly kitWarehouse: {
                    readonly type: "object";
                    readonly description: "Indica la bodega asociada al Kit. Se debe enviar solo si el producto es de tipo kit Si no se envía se asocia la bodega principal.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la bodega.";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly itemCategory: {
                    readonly type: "object";
                    readonly description: "Indica la categoría de ítem a asociar. Se debe tener en cuenta si la categoría de ítem está activa para asociar el ítem.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Identificador de la categoría de item a asociar";
                            readonly examples: readonly ["1"];
                        };
                    };
                };
                readonly variantAttributes: {
                    readonly description: "Arreglo con objetos que representa los atributos variantes del ítem. Obligatorio si el atributo type del item es variantParent. El objeto debe estar compuesto por los siguientes atributos: id (int) Id del atributo variante. options(array of objects) Array de objetos con los ids de las opciones a agregar en el item.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la variante.";
                                readonly examples: readonly ["1"];
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador de la opción de la variante.";
                                            readonly examples: readonly ["1"];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                readonly accounting: {
                    readonly description: "Objeto que contiene las cuentas de inventario y compras inventariables de los items inventariables. Las opciones disponibles son: inventory e inventariablePurchase. Se puede enviar solo el id de la cuenta contable o como objeto";
                    readonly type: "object";
                    readonly properties: {
                        readonly inventory: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de inventario.";
                                readonly examples: readonly ["5020"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de inventario.";
                                        readonly examples: readonly ["5020"];
                                    };
                                };
                            }];
                        };
                        readonly inventariablePurchase: {
                            readonly oneOf: readonly [{
                                readonly type: "string";
                                readonly description: "Identificador de la cuenta de compras inventariables.";
                                readonly examples: readonly ["5064"];
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly description: "Identificador de la cuenta de compras inventariables.";
                                        readonly examples: readonly ["5064"];
                                    };
                                };
                            }];
                        };
                    };
                };
                readonly productKey: {
                    readonly description: "Indica la clave de producto.";
                    readonly type: "string";
                };
            };
        }, {
            readonly title: "Item del tipo servicio";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del servicio. Longitud máxima permitida: 150.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del servicio. Longitud máxima permitida: 500.";
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                };
                                readonly price: {
                                    readonly type: "number";
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Indica el tipo de ítem. Para la creacion de un servicio, este parámetro debe contener el valor 'service'";
                };
                readonly unit: {
                    readonly type: "string";
                    readonly description: "Los valores posibles son: unit, centimeter, meter, inch, centimeterSquared, meterSquared, inchSquared, mililiter, liter, gallon, gram, kilogram, ton, pound, piece, service, notApplicable, etc.";
                };
            };
        }, {
            readonly title: "Items del tipo variante";
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Nombre del servicio. Longitud máxima permitida: 150.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Descripción del servicio. Longitud máxima permitida: 500.";
                };
                readonly price: {
                    readonly oneOf: readonly [{
                        readonly type: "integer";
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                };
                                readonly price: {
                                    readonly type: "number";
                                };
                            };
                            readonly type: "object";
                        };
                    }];
                    readonly description: "Array de objetos que indica las listas de precio asociadas al producto o servicio. Los objetos deben contener: idPriceList (number, obligatorio):identificador de la lista de precios; price (double) : precio en la lista. Para indicar el precio general del producto/servicio se puede enviar únicamente un objeto con atributo de price. Para listas de precio de porcentaje se puede omitir el atributo price. Si no se desea asociar el producto/servicio a una lista de precios se puede enviar el precio del producto o servicio directamente.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Indica el tipo de ítem. Para la creacion de un servicio, este parámetro debe contener el valor 'variantParent'";
                };
                readonly inventory: {
                    readonly description: "Propiedades del inventario de los items variantes";
                    readonly properties: {
                        readonly unit: {
                            readonly type: "string";
                            readonly description: "Unidad de medida del producto. Para poder ver la lista completa por versiones puedes descargarla haciendo [click aquí](https://alegra-design.s3.amazonaws.com/website/ayudas/units-inventory/unidades-generic.xlsx).";
                            readonly examples: readonly ["unit"];
                        };
                        readonly unitCost: {
                            readonly type: "integer";
                            readonly description: "Costo unitario del producto.";
                            readonly examples: readonly [5];
                        };
                        readonly negativeSale: {
                            readonly type: "boolean";
                            readonly description: "Si es true el item se puede vender sin stock";
                            readonly examples: readonly [true];
                        };
                    };
                    readonly type: "object";
                };
                readonly variantAttributes: {
                    readonly description: "Atributos variantes que se asociaran al item";
                    readonly type: "array";
                    readonly items: {
                        readonly properties: {
                            readonly id: {
                                readonly description: "Identificador de la variante";
                                readonly type: "string";
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly description: "Array de opciones";
                                readonly items: {
                                    readonly properties: {
                                        readonly id: {
                                            readonly description: "Identificador de la opcion";
                                            readonly type: "string";
                                        };
                                    };
                                    readonly type: "object";
                                };
                            };
                        };
                        readonly type: "object";
                    };
                };
                readonly itemVariants: {
                    readonly description: "Ítems variantes que se asignar";
                    readonly type: "array";
                    readonly items: {
                        readonly properties: {
                            readonly inventory: {
                                readonly properties: {
                                    readonly initialQuantity: {
                                        readonly description: "Cantidad inicial de la variante";
                                        readonly type: "integer";
                                    };
                                    readonly maxQuantity: {
                                        readonly description: "Cantidad máxima de la variante";
                                        readonly type: "integer";
                                    };
                                    readonly minQuantity: {
                                        readonly description: "Cantidad mínima de la variante";
                                        readonly type: "integer";
                                    };
                                };
                                readonly type: "object";
                            };
                            readonly variantAttributes: {
                                readonly description: "Atributos variantes que se asociaran al item";
                                readonly type: "array";
                                readonly items: {
                                    readonly properties: {
                                        readonly id: {
                                            readonly description: "Identificador de la variante";
                                            readonly type: "string";
                                        };
                                        readonly options: {
                                            readonly type: "array";
                                            readonly description: "Array de opciones";
                                            readonly items: {
                                                readonly properties: {
                                                    readonly id: {
                                                        readonly description: "Identificador de la opcion";
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly type: "object";
                                            };
                                        };
                                    };
                                    readonly type: "object";
                                };
                            };
                        };
                        readonly type: "object";
                    };
                };
            };
        }];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador del producto o servicio que se desea editar. Se debe enviar en la URL";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Item Get";
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                    readonly description: "Array con las opciones del atributo variante.";
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Colombia";
                readonly type: "object";
                readonly properties: {
                    readonly tariffHeading: {
                        readonly type: "string";
                        readonly description: "Cadena de 10 caracteres que indica la partida arancelaria de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly brand: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica la marca de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly model: {
                        readonly type: "string";
                        readonly description: "Cadena de caracteres que indica el modelo de un ítem. Aplica para facturas electrónicas de exportación.";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Costa Rica";
                readonly type: "object";
                readonly properties: {
                    readonly reference: {
                        readonly description: "Objeto reference que indica la referencia del producto.";
                        readonly type: "object";
                        readonly properties: {
                            readonly reference: {
                                readonly description: "India el código de referencia establecido para el producto.";
                                readonly type: "string";
                            };
                            readonly type: {
                                readonly description: "Indica el tipo de referencia del producto.";
                                readonly type: "string";
                            };
                        };
                    };
                    readonly productKey: {
                        readonly description: "Indica la clave del producto";
                        readonly type: "string";
                    };
                    readonly tariffHeading: {
                        readonly description: "Cadena de 12 caracteres que indica la partida arancelaria de un ítem.";
                        readonly type: "string";
                    };
                };
            }, {
                readonly title: "Item Mexico";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la clave de producto o ProdServKey.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }, {
                readonly title: "Item Panama";
                readonly type: "object";
                readonly properties: {
                    readonly productKey: {
                        readonly description: "Indica la codificación panameña de bienes y servicios.";
                        readonly type: "string";
                    };
                    readonly id: {
                        readonly description: "Identificador único que representa un producto o servicio específico. La aplicación lo asigna automáticamente.";
                        readonly type: "string";
                    };
                    readonly name: {
                        readonly description: "Nombre del item.";
                        readonly type: "string";
                    };
                    readonly description: {
                        readonly description: "Descripción del item.";
                        readonly type: "string";
                    };
                    readonly reference: {
                        readonly description: "Referencia o código que identifica un item.";
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "array";
                        readonly description: "Indica los precios asociados al item.";
                        readonly items: {
                            readonly title: "PriceList";
                            readonly type: "object";
                            readonly properties: {
                                readonly idPriceList: {
                                    readonly type: "string";
                                    readonly description: "Identificador que representa una lista de precios.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre de la lista de precios.";
                                };
                                readonly price: {
                                    readonly type: "number";
                                    readonly description: "Precio del producto en esa lista de precios.";
                                };
                            };
                        };
                    };
                    readonly tax: {
                        readonly type: "array";
                        readonly description: "Indica el impuesto asociado al item.";
                        readonly items: {
                            readonly title: "Tax";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Identificador del impuesto.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del impuesto.";
                                };
                                readonly percentage: {
                                    readonly type: "number";
                                    readonly description: "Porcentaje del impuesto.";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly description: "Descripción del impuesto.";
                                };
                                readonly status: {
                                    readonly description: "Estado del impuesto, puede ser active para un impuesto activo, o inactive para un impuesto que se encuentra inactivo.";
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                    readonly category: {
                        readonly title: "Category";
                        readonly description: "Objeto que contiene la información de la categoría asociada al producto o servicio. Este objeto indica la categoría de Alegra a la cual se llevan los registros de tus ventas cuando realizas movimientos con este producto o servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador de la categoría";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la categoría";
                            };
                        };
                    };
                    readonly inventory: {
                        readonly title: "Inventory";
                        readonly description: "Objeto que contiene la información del inventario del producto. Si este objeto está presente indica que el artículo es inventariable, si no lo está se asume como servicio.";
                        readonly type: "object";
                        readonly properties: {
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Indica la unidad de medida del producto.";
                            };
                            readonly availableQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.";
                            };
                            readonly unitCost: {
                                readonly type: "integer";
                                readonly description: "Indica el costo unitario del producto.";
                            };
                            readonly initialQuantity: {
                                readonly type: "integer";
                                readonly description: "Indica la cantidad inicial con la cual se creó el producto. Si el producto se encuentra";
                            };
                            readonly warehouses: {
                                readonly type: "array";
                                readonly description: "Array de objetos warehouse que indican las bodegas asociadas al producto";
                                readonly items: {
                                    readonly title: "Warehouse";
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "Identificador único de la bodega.";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                            readonly description: "Nombre de la bodega.";
                                        };
                                        readonly observations: {
                                            readonly type: "string";
                                            readonly description: "Observaciones de la bodega.";
                                        };
                                        readonly isDefault: {
                                            readonly type: "boolean";
                                            readonly description: "Indica si la bodega es la de por defecto.";
                                        };
                                        readonly address: {
                                            readonly type: "string";
                                            readonly description: "Dirección de la bodega.";
                                        };
                                        readonly status: {
                                            readonly type: "string";
                                            readonly description: "Estado de la bodega, puede ser active o inactive.";
                                        };
                                        readonly initialQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad inicial del producto en la bodega.";
                                        };
                                        readonly availableQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad disponible del producto en la bodega.";
                                        };
                                        readonly minQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                                        };
                                        readonly maxQuantity: {
                                            readonly type: "string";
                                            readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    readonly status: {
                        readonly title: "Status";
                        readonly description: "Indica el estado del producto o servicio, active: para productos que se encuentran activos, inactive: para productos que se encuentran inactivos.\n\n`inactive` `active`";
                        readonly type: "string";
                        readonly enum: readonly ["inactive", "active"];
                    };
                    readonly type: {
                        readonly title: "Type";
                        readonly description: "Indica el tipo del producto, simple: Producto sencillo, kit: Producto que está compuesto por otros, variantParent: Producto con características variantes (como el color o la talla). Es el item padre, compuesto de items variantes, variant: Producto asociado a un item con variantes, representa un conjunto de variantes en especifico. Es el item hijo asociado a un padre.\n\n`simple` `kit` `variantParent` `variant`";
                        readonly type: "string";
                        readonly enum: readonly ["simple", "kit", "variantParent", "variant"];
                    };
                    readonly subitems: {
                        readonly type: "array";
                        readonly description: "Array de objetos que contienen la información de los productos que componen el kit. Aplica únicamente para productos tipo kit.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly quantity: {
                                    readonly description: "Cantidad del subitem necesaria para conformar el kit.";
                                    readonly type: "number";
                                };
                                readonly item: {
                                    readonly description: "Objeto item que contiene toda la información del producto relacionado al combo";
                                };
                            };
                        };
                    };
                    readonly kitWarehouse: {
                        readonly title: "Warehouse";
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "Identificador único de la bodega.";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Nombre de la bodega.";
                            };
                            readonly observations: {
                                readonly type: "string";
                                readonly description: "Observaciones de la bodega.";
                            };
                            readonly isDefault: {
                                readonly type: "boolean";
                                readonly description: "Indica si la bodega es la de por defecto.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Dirección de la bodega.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly description: "Estado de la bodega, puede ser active o inactive.";
                            };
                            readonly initialQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad inicial del producto en la bodega.";
                            };
                            readonly availableQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad disponible del producto en la bodega.";
                            };
                            readonly minQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad mínima establecida para el producto en la bodega.";
                            };
                            readonly maxQuantity: {
                                readonly type: "string";
                                readonly description: "Cantidad máxima establecida para el producto en la bodega.";
                            };
                        };
                    };
                    readonly itemCategory: {
                        readonly description: "Objeto que indica la categoría de ítem asociada. Contiene un objeto itemCategory.";
                        readonly type: "object";
                        readonly additionalProperties: true;
                    };
                    readonly customFields: {
                        readonly description: "Array con atributos adicionales asociados al producto.";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "CustomFields";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo adicional.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo adicional.";
                                };
                                readonly key: {
                                    readonly type: "string";
                                    readonly description: "Identificador del atributo adicional.";
                                };
                                readonly value: {
                                    readonly type: "string";
                                    readonly description: "Valor del atributo adicional para el item.";
                                };
                            };
                        };
                    };
                    readonly variantAttributes: {
                        readonly description: "Array con atributos variantes asociados al producto. Aplica únicamente para items de tipo \"variantParent\" y \"variant\"";
                        readonly type: "array";
                        readonly items: {
                            readonly title: "VariantAttributes";
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "Id del atributo variante.";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "Nombre del atributo variante.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly description: "Estado del atributo variante.";
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Array con las opciones del atributo variante.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                    readonly itemVariants: {
                        readonly description: "Array con los subitems del item variantes. Aplica únicamente para items de tipo \"variantParent\". Un item con variantes contiene un item variante por cada una de las combinaciones posibles de sus atributos variantes, ej: La compañía X tiene un item que contiene los atributos variantes \"COLOR\" y \"TALLA\" con las opciones \"Color: Blanco\", \"Color:Rojo\", \"Talla: XS\", \"Talla: M\". Esto quiere decir que el item padre, contendrá 4 items variantes (un item Blanco XS, otro Blanco M, otro Rojo XS y otro Rojo M)";
                    };
                    readonly accounting: {
                        readonly title: "Accounting";
                        readonly description: "Objeto que representa las cuentas de inventario y costo de ventas. Solo aplica para items inventariables.";
                        readonly properties: {
                            readonly inventory: {
                                readonly type: "number";
                                readonly description: "Cuenta de inventario";
                            };
                            readonly inventariablePurchase: {
                                readonly type: "number";
                                readonly description: "Costo del inventario";
                            };
                        };
                        readonly type: "object";
                    };
                };
            }];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutPriceListsId: {
    readonly body: {
        readonly title: "PricesListPut";
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la lista de precios. Longitud máxima permitida: 90.";
                readonly type: "string";
            };
            readonly description: {
                readonly description: "Descripción de la lista de precios.";
                readonly type: "string";
            };
            readonly type: {
                readonly description: "Tipo de la lista de precios, los valores posibles son: amount (valor) y  percentage (porcentaje) con este tipo el parámetro percentage es obligatorio.";
                readonly type: "string";
                readonly enum: readonly ["amount", "percentage"];
            };
            readonly percentage: {
                readonly description: "Valor del porcentaje, si el tipo de la lista de precios es percentage entonces este parámetro es obligatorio.";
                readonly type: "number";
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la lista de precios que se quiere editar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "PricesListGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una lista de precios específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la lista de precios";
                    readonly type: "string";
                };
                readonly description: {
                    readonly description: "Descripción de la lista de precios.";
                    readonly type: "string";
                };
                readonly type: {
                    readonly description: "Tipo de lista de precios, amount: indica que la lista de precios establece un  valor específico, percentage: indica que la lista de precios descuenta el porcentaje  indicado del precio normal.\n\n`amount` `percentage`";
                    readonly type: "string";
                    readonly enum: readonly ["amount", "percentage"];
                };
                readonly percentage: {
                    readonly description: "Porcentaje que se aplica sobre el precio normal. Éste atributo únicamente se envía, cuando la lista es de tipo percentage";
                    readonly type: "number";
                };
                readonly status: {
                    readonly description: "Estado de la lista de precios.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutVariantAttributesId: {
    readonly body: {
        readonly title: "VariantPut";
        readonly properties: {
            readonly name: {
                readonly description: "Nombre del atributo variante";
                readonly type: "string";
            };
            readonly options: {
                readonly description: "Array con las opciones disponibles para el atributo variante.";
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly description: "Id de la opción.";
                            readonly type: "string";
                        };
                        readonly value: {
                            readonly description: "Opción";
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly status: {
                readonly description: "Estado del atributo variante.";
                readonly type: "string";
                readonly enum: readonly ["active", "inactive"];
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la variante que se quiere editar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "VariantGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa un atributo variante específico.  La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre del atributo variante";
                    readonly type: "string";
                };
                readonly status: {
                    readonly description: "Estado del atributo variante.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
                readonly options: {
                    readonly description: "Array con las opciones disponibles para el atributo variante.";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly description: "Id de la opción.";
                                readonly type: "string";
                            };
                            readonly value: {
                                readonly description: "Opción";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutWarehouseTransfersId: {
    readonly body: {
        readonly title: "Warehouses Transfer Put";
        readonly properties: {
            readonly observations: {
                readonly description: "Observaciones de la transferencia de bodegas.";
                readonly type: "string";
                readonly examples: readonly ["Descripción de mi transferencia de bodegas."];
            };
            readonly origin: {
                readonly description: "Bodega origen de la transferencia.";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly destination: {
                readonly description: "Bodega destino de la transferencia.";
                readonly type: "object";
                readonly additionalProperties: true;
            };
            readonly date: {
                readonly description: "Fecha de la transferencia de bodega.";
                readonly type: "string";
                readonly format: "date";
                readonly examples: readonly ["2023-01-31"];
            };
            readonly items: {
                readonly description: "Array de objetos item (productos/servicios) que se van transferir.";
                readonly type: "array";
                readonly items: {
                    readonly properties: {
                        readonly id: {
                            readonly description: "identificador del producto o servicio.";
                            readonly type: "string";
                            readonly examples: readonly ["4"];
                        };
                        readonly quantity: {
                            readonly description: "Cantidades que se van a transferir.";
                            readonly type: "number";
                            readonly examples: readonly [10];
                        };
                    };
                    readonly required: readonly ["id", "quantity"];
                    readonly type: "object";
                };
            };
        };
        readonly required: readonly ["items"];
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Id de la transferencia que se quiere editar";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Warehouses Transfer Put";
            readonly properties: {
                readonly observations: {
                    readonly description: "Observaciones de la transferencia de bodegas.";
                    readonly type: "string";
                    readonly examples: readonly ["Descripción de mi transferencia de bodegas."];
                };
                readonly origin: {
                    readonly description: "Bodega origen de la transferencia.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly destination: {
                    readonly description: "Bodega destino de la transferencia.";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly date: {
                    readonly description: "Fecha de la transferencia de bodega.";
                    readonly type: "string";
                    readonly format: "date";
                    readonly examples: readonly ["2023-01-31"];
                };
                readonly items: {
                    readonly description: "Array de objetos item (productos/servicios) que se van transferir.";
                    readonly type: "array";
                    readonly items: {
                        readonly properties: {
                            readonly id: {
                                readonly description: "identificador del producto o servicio.";
                                readonly type: "string";
                                readonly examples: readonly ["4"];
                            };
                            readonly quantity: {
                                readonly description: "Cantidades que se van a transferir.";
                                readonly type: "number";
                                readonly examples: readonly [10];
                            };
                        };
                        readonly required: readonly ["id", "quantity"];
                        readonly type: "object";
                    };
                };
            };
            readonly required: readonly ["items"];
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PutWarehousesId: {
    readonly body: {
        readonly title: "WarehousePut";
        readonly properties: {
            readonly name: {
                readonly description: "Nombre de la bodega";
                readonly type: "string";
            };
            readonly observations: {
                readonly description: "Observaciones de la bodega";
                readonly type: "string";
            };
            readonly address: {
                readonly description: "Dirección de la bodega";
                readonly type: "string";
            };
            readonly costCenter: {
                readonly description: "El objeto costCenter indica que se desea asociar un centro de costo. Si se desea asociar el centro de costo en Alegra, se debe mandar este objeto con el siguiente atributo : id (int) : Identificador del centro de costo.";
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly description: "Representa el identificador del centro de costo que queremos asociar";
                        readonly type: "string";
                    };
                };
            };
        };
        readonly type: "object";
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Identificador de la bodega que se quiere editar.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "WarehouseGet";
            readonly properties: {
                readonly id: {
                    readonly description: "Identificador único que representa una bodega específica. La aplicación lo asigna automáticamente.";
                    readonly type: "string";
                };
                readonly name: {
                    readonly description: "Nombre de la bodega";
                    readonly type: "string";
                };
                readonly observations: {
                    readonly description: "Observaciones de la bodega";
                    readonly type: "string";
                };
                readonly address: {
                    readonly description: "Dirección de la bodega";
                    readonly type: "string";
                };
                readonly isDefault: {
                    readonly description: "Indica si la bodega es la principal de la compañía";
                    readonly type: "boolean";
                };
                readonly costCenter: {
                    readonly description: "El objeto costCenter indica el centro de costo asociado a la bodega";
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly status: {
                    readonly description: "Estado de la bodega.\n\n`active` `inactive`";
                    readonly type: "string";
                    readonly enum: readonly ["active", "inactive"];
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { DeleteCustomFieldsId, DeleteInventoryAdjustmentsId, DeleteInventoryAdjustmentsNumerationsId, DeleteItemCategoriesAttachmentIdattachment, DeleteItemCategoriesId, DeleteItems, DeleteItemsAttachmentIdattachment, DeleteItemsId, DeletePriceListsId, DeleteVariantAttributesId, DeleteWarehouseTransfersId, DeleteWarehousesId, GetCustomFields, GetCustomFieldsId, GetInventoryAdjustments, GetInventoryAdjustmentsId, GetInventoryAdjustmentsNumerations, GetInventoryAdjustmentsNumerationsId, GetItemCategories, GetItemCategoriesId, GetItems, GetItemsId, GetPriceLists, GetPriceListsId, GetVariantAttributes, GetVariantAttributesId, GetWarehouseTransfers, GetWarehouseTransfersId, GetWarehouses, GetWarehousesId, PostCustomFields, PostInventoryAdjustments, PostInventoryAdjustmentsNumerations, PostItemCategories, PostItemCategoriesIdAttachment, PostItems, PostItemsIdAttachment, PostPriceLists, PostVariantAttributes, PostWarehouseTransfers, PostWarehouses, PutCustomFieldsId, PutInventoryAdjustmentsId, PutInventoryAdjustmentsNumerationsId, PutItemCategoriesId, PutItemsId, PutPriceListsId, PutVariantAttributesId, PutWarehouseTransfersId, PutWarehousesId };
