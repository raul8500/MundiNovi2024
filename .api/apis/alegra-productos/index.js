"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'alegraswagger-test/1.0 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Endpoint que permite consultar los productos o servicios registrados en la aplicación
     *
     * @summary Listado de items
     * @throws FetchError<400, types.GetItemsResponse400> Objeto que representa la respuesta cuando se sobrepasa el límite de productos a
     * retornar
     * @throws FetchError<404, types.GetItemsResponse404> 404 Not found
     */
    SDK.prototype.getItems = function (metadata) {
        return this.core.fetch('/items', 'get', metadata);
    };
    /**
     * Endpoint que permite crear un producto o servicio
     *
     * @summary Crear ítem
     * @throws FetchError<400, types.PostItemsResponse400> Bad request
     */
    SDK.prototype.postItems = function (body) {
        return this.core.fetch('/items', 'post', body);
    };
    /**
     * Endpoint que permite eliminar varios productos y/o servicios.
     *
     * @summary Eliminar ítem
     * @throws FetchError<400, types.DeleteItemsResponse400> Objeto que representa la respuesta al intentar eliminar varios productos y/o servicios
     */
    SDK.prototype.deleteItems = function (metadata) {
        return this.core.fetch('/items', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar un producto o servicio registrado en la aplicación
     *
     * @summary Consultar un ítem
     * @throws FetchError<404, types.GetItemsIdResponse404> Objeto que representa la respuesta de un producto o servicio no encontrado
     */
    SDK.prototype.getItemsId = function (metadata) {
        return this.core.fetch('/items/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar un producto o servicio registrado en la aplicación
     *
     * @summary Editar ítem
     */
    SDK.prototype.putItemsId = function (body, metadata) {
        return this.core.fetch('/items/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un producto o servicio registrado en la aplicación
     *
     * @summary Eliminar ítem
     * @throws FetchError<400, types.DeleteItemsIdResponse400> Objeto que representa la respuesta al intentar eliminar un producto o servicio
     * @throws FetchError<404, types.DeleteItemsIdResponse404> Objeto que representa la respuesta al intentar eliminar un producto o servicio que no
     * existe
     */
    SDK.prototype.deleteItemsId = function (metadata) {
        return this.core.fetch('/items/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite adjuntar un archivo a un producto o servicio registrado en la
     * aplicación. Para adjuntar una imagen o un archivo a un producto o servicio se debe
     * enviar un request en el cual se debe especificar el header Content-Type como
     * multipart/form-data. Para adjuntar un archivo a un producto o servicio el contenido del
     * archivo debe enviarse en el atributo file. Si se desea asociar la imagen de un producto
     * o servicio a éste se debe enviar la información en el atributo image. Se debe tener en
     * cuenta que solo se puede enviar un archivo o imagen por request. El tamaño máximo
     * permitido para ésta es 2MB. Si la operación fue exitosa se retorna una URL para acceder
     * al archivo/imagen asociada. Esta URL tiene vencimiento de 30 minutos; después de este
     * período se debe consultar el ítem para obtener una nueva URL válida.
     *
     * @summary Adjuntar un archivo a un ítem
     */
    SDK.prototype.postItemsIdAttachment = function (body, metadata) {
        return this.core.fetch('/items/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un archivo de un producto o servicio registrado en la
     * aplicación
     *
     * @summary Eliminar un adjunto de un ítem
     * @throws FetchError<400, types.DeleteItemsAttachmentIdattachmentResponse400> Objeto que representa la respuesta al intentar eliminar un archivo adjunto.
     */
    SDK.prototype.deleteItemsAttachmentIdattachment = function (metadata) {
        return this.core.fetch('/items/attachment/{idAttachment}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las bodegas registradas en la aplicación
     *
     * @summary Listado de bodegas
     */
    SDK.prototype.getWarehouses = function (metadata) {
        return this.core.fetch('/warehouses', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una bodega
     *
     * @summary Crear bodega
     */
    SDK.prototype.postWarehouses = function (body) {
        return this.core.fetch('/warehouses', 'post', body);
    };
    /**
     * Endpoint que permite consultar una bodega registrada en la aplicación
     *
     * @summary Consultar bodega
     */
    SDK.prototype.getWarehousesId = function (metadata) {
        return this.core.fetch('/warehouses/{id}', 'get', metadata);
    };
    SDK.prototype.putWarehousesId = function (body, metadata) {
        return this.core.fetch('/warehouses/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una bodega registrada en la aplicación
     *
     * @summary Eliminar bodega
     */
    SDK.prototype.deleteWarehousesId = function (metadata) {
        return this.core.fetch('/warehouses/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las transferencias de bodegas registradas en la
     * aplicación
     *
     * @summary Listado de transferencias de bodegas
     */
    SDK.prototype.getWarehouseTransfers = function (metadata) {
        return this.core.fetch('/warehouse-transfers', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una transferencia de bodegas.
     *
     * @summary Crear transferencia de bodegas
     */
    SDK.prototype.postWarehouseTransfers = function (body) {
        return this.core.fetch('/warehouse-transfers', 'post', body);
    };
    /**
     * Endpoint que permite consultar una transferencia de bodegas registrada en la aplicación
     *
     * @summary Consultar una transferencia de bodegas
     */
    SDK.prototype.getWarehouseTransfersId = function (metadata) {
        return this.core.fetch('/warehouse-transfers/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar una transferencia de bodegas
     *
     * @summary Editar transferencia de bodegas
     */
    SDK.prototype.putWarehouseTransfersId = function (body, metadata) {
        return this.core.fetch('/warehouse-transfers/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una transferencia de bodegas registrada en la aplicación
     *
     * @summary Eliminar transferencia de bodegas
     */
    SDK.prototype.deleteWarehouseTransfersId = function (metadata) {
        return this.core.fetch('/warehouse-transfers/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar los ajustes de inventario registrados en la aplicación
     *
     * @summary Listado de ajustes de inventario
     */
    SDK.prototype.getInventoryAdjustments = function (metadata) {
        return this.core.fetch('/inventory-adjustments', 'get', metadata);
    };
    /**
     * Endpoint que permite crear un ajuste de inventario.
     *
     * @summary Crear ajuste de inventario
     */
    SDK.prototype.postInventoryAdjustments = function (body) {
        return this.core.fetch('/inventory-adjustments', 'post', body);
    };
    /**
     * Endpoint que permite consultar un ajuste de inventario registrado en la aplicación
     *
     * @summary Consultar ajuste de inventario
     */
    SDK.prototype.getInventoryAdjustmentsId = function (metadata) {
        return this.core.fetch('/inventory-adjustments/{id}', 'get', metadata);
    };
    SDK.prototype.putInventoryAdjustmentsId = function (body, metadata) {
        return this.core.fetch('/inventory-adjustments/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un ajuste de inventario
     *
     * @summary Eliminar ajuste de inventario
     */
    SDK.prototype.deleteInventoryAdjustmentsId = function (metadata) {
        return this.core.fetch('/inventory-adjustments/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite listar las numeraciones de ajuste de inventario.
     *
     * @summary Listar numeraciones de ajustes de inventario
     */
    SDK.prototype.getInventoryAdjustmentsNumerations = function (metadata) {
        return this.core.fetch('/inventory-adjustments/numerations', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una numeración de ajuste de inventario.
     *
     * @summary Crear numeración de ajuste de inventario
     */
    SDK.prototype.postInventoryAdjustmentsNumerations = function (body) {
        return this.core.fetch('/inventory-adjustments/numerations', 'post', body);
    };
    /**
     * Endpoint que permite consultar una numeración de ajuste de inventario
     *
     * @summary Consultar una numeración de ajuste de inventario
     */
    SDK.prototype.getInventoryAdjustmentsNumerationsId = function (metadata) {
        return this.core.fetch('/inventory-adjustments/numerations/{id}', 'get', metadata);
    };
    SDK.prototype.putInventoryAdjustmentsNumerationsId = function (body, metadata) {
        return this.core.fetch('/inventory-adjustments/numerations/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una numeración de ajuste de inventario
     *
     * @summary Eliminar numeración de ajuste de inventario
     */
    SDK.prototype.deleteInventoryAdjustmentsNumerationsId = function (metadata) {
        return this.core.fetch('/inventory-adjustments/numerations/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las listas de precios registradas en la aplicación
     *
     * @summary Listar listas de precios
     */
    SDK.prototype.getPriceLists = function (metadata) {
        return this.core.fetch('/price-lists', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una lista de precios
     *
     * @summary Crear lista de precio
     */
    SDK.prototype.postPriceLists = function (body) {
        return this.core.fetch('/price-lists', 'post', body);
    };
    /**
     * Endpoint que permite consultar una lista de precios registrada en la aplicación
     *
     * @summary Consultar lista de precio
     */
    SDK.prototype.getPriceListsId = function (metadata) {
        return this.core.fetch('/price-lists/{id}', 'get', metadata);
    };
    SDK.prototype.putPriceListsId = function (body, metadata) {
        return this.core.fetch('/price-lists/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una lista de precios registrada en la aplicación
     *
     * @summary Eliminar lista de precio
     */
    SDK.prototype.deletePriceListsId = function (metadata) {
        return this.core.fetch('/price-lists/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar los campos adicionales registrados en la aplicación.
     *
     * @summary Listar campos adicionales
     * @throws FetchError<400, types.GetCustomFieldsResponse400> Objeto que representa la respuesta al intentar consultar la lista de campos adicionales
     */
    SDK.prototype.getCustomFields = function (metadata) {
        return this.core.fetch('/custom-fields', 'get', metadata);
    };
    /**
     * Endpoint que permite crear un campo adicional.
     *
     * @summary Crear campo adicional
     */
    SDK.prototype.postCustomFields = function (body) {
        return this.core.fetch('/custom-fields', 'post', body);
    };
    /**
     * Endpoint que permite consultar un campo adicional registrado en la aplicación
     *
     * @summary Consultar campo adicional
     * @throws FetchError<404, types.GetCustomFieldsIdResponse404> Objeto que representa la respuesta al intentar consultar un campo adicional.
     */
    SDK.prototype.getCustomFieldsId = function (metadata) {
        return this.core.fetch('/custom-fields/{id}', 'get', metadata);
    };
    SDK.prototype.putCustomFieldsId = function (body, metadata) {
        return this.core.fetch('/custom-fields/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un campo adicional registrado en la aplicación
     *
     * @summary Eliminar campo adicional
     */
    SDK.prototype.deleteCustomFieldsId = function (metadata) {
        return this.core.fetch('/custom-fields/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las variantes registradas en la aplicación.
     *
     * @summary Listado de atributos variantes
     */
    SDK.prototype.getVariantAttributes = function (metadata) {
        return this.core.fetch('/variant-attributes', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una variante.
     *
     * @summary Crear atributos variante
     */
    SDK.prototype.postVariantAttributes = function (body) {
        return this.core.fetch('/variant-attributes', 'post', body);
    };
    /**
     * Endpoint que permite consultar una variante registrada en la aplicación
     *
     * @summary Consultar atributos variante
     * @throws FetchError<404, types.GetVariantAttributesIdResponse404> Objeto que representa la respuesta al intentar consultar una variante no existente.
     */
    SDK.prototype.getVariantAttributesId = function (metadata) {
        return this.core.fetch('/variant-attributes/{id}', 'get', metadata);
    };
    SDK.prototype.putVariantAttributesId = function (body, metadata) {
        return this.core.fetch('/variant-attributes/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una variante registrada en la aplicación
     *
     * @summary Eliminar atributos variante
     * @throws FetchError<400, types.DeleteVariantAttributesIdResponse400> Objeto que representa la respuesta al intentar eliminar una variante.
     */
    SDK.prototype.deleteVariantAttributesId = function (metadata) {
        return this.core.fetch('/variant-attributes/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las categorías de ítems registradas en la aplicación
     *
     * @summary Listado de categoría de items
     */
    SDK.prototype.getItemCategories = function (metadata) {
        return this.core.fetch('/item-categories', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una categoría de ítems.
     *
     * @summary Crear categoría de item
     */
    SDK.prototype.postItemCategories = function (body) {
        return this.core.fetch('/item-categories', 'post', body);
    };
    /**
     * Endpoint que permite consultar una categoría de ítems registrada en la aplicación
     *
     * @summary Consultar categoría de item
     */
    SDK.prototype.getItemCategoriesId = function (metadata) {
        return this.core.fetch('/item-categories/{id}', 'get', metadata);
    };
    SDK.prototype.putItemCategoriesId = function (body, metadata) {
        return this.core.fetch('/item-categories/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una categoría de item registrada en la aplicación
     *
     * @summary Eliminar categoría de item
     */
    SDK.prototype.deleteItemCategoriesId = function (metadata) {
        return this.core.fetch('/item-categories/{id}', 'delete', metadata);
    };
    SDK.prototype.postItemCategoriesIdAttachment = function (body, metadata) {
        return this.core.fetch('/item-categories/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un archivo de una Categoría de ítems registrada en la
     * aplicación
     *
     * @summary Eliminar un archivo adjunto de una categoría de items
     * @throws FetchError<400, types.DeleteItemCategoriesAttachmentIdattachmentResponse400> Objeto que representa la respuesta al intentar eliminar un archivo adjunto.
     */
    SDK.prototype.deleteItemCategoriesAttachmentIdattachment = function (metadata) {
        return this.core.fetch('/item-categories/attachment/{idAttachment}', 'delete', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
