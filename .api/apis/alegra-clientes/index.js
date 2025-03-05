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
        this.core = new core_1.default(this.spec, 'alegraswagger-test/1.0.0 (api/6.1.2)');
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
     * Endpoint que permite consultar los contactos registrados en la aplicación
     *
     * @summary Listado de contactos
     * @throws FetchError<400, types.ListContactsResponse400> Límite sobrepasa valor permitido
     */
    SDK.prototype.listContacts = function (metadata) {
        return this.core.fetch('/contacts', 'get', metadata);
    };
    /**
     * Endpoint que permite crear un contacto en la aplicación
     *
     * @summary Crear un contacto
     * @throws FetchError<400, types.PostContactsResponse400> Request incorrecto
     */
    SDK.prototype.postContacts = function (body) {
        return this.core.fetch('/contacts', 'post', body);
    };
    /**
     * Endpoint que permite eliminar varios contactos en la aplicación Se debe tener en cuenta
     * que un contacto que tenga documentos (facturas de venta, notas crédito, facturas de
     * compra, etc) no puede ser eliminado.
     *
     *
     * @summary Eliminar varios contactos
     * @throws FetchError<400, types.DeleteMultipleContactsResponse400> Error eliminar varios contactos
     */
    SDK.prototype.deleteMultipleContacts = function (metadata) {
        return this.core.fetch('/contacts', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar un contacto registrado en la aplicación
     *
     * @summary Obtener detalle de un contacto
     * @throws FetchError<404, types.ContactsDetailsResponse404> Error contacto no encontrado
     */
    SDK.prototype.contactsDetails = function (metadata) {
        return this.core.fetch('/contacts/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar un contacto en la aplicación
     *
     * @summary Editar contacto
     * @throws FetchError<400, types.EditContactResponse400> Request incorrecto
     * @throws FetchError<404, types.EditContactResponse404> Error contacto no encontrado
     */
    SDK.prototype.editContact = function (body, metadata) {
        return this.core.fetch('/contacts/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un contacto en la aplicación
     *
     * @summary Eliminar contacto
     * @throws FetchError<400, types.DeleteContactResponse400> Contacto con documentos recurrentes asociados
     * @throws FetchError<404, types.DeleteContactResponse404> Error contacto no encontrado
     */
    SDK.prototype.deleteContact = function (metadata) {
        return this.core.fetch('/contacts/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite adjuntar archivos a un contacto en la aplicación Para adjuntar un
     * archivo a un contacto se debe enviar un request en el cual se debe especificar el header
     * Content-Type como multipart/form-data. Se debe tener en cuenta que solo se puede enviar
     * un archivo por request. El tamaño máximo permitido para éste es 2MB.
     * Si la operación fue exitosa se retorna una URL para acceder al archivo asociado. Esta
     * URL tiene vencimiento de 30 minutos; después de este período se debe consultar el
     * contacto para obtener una nueva URL válida.
     *
     *
     * @summary Adjuntar archivos
     * @throws FetchError<400, types.ContactsAttachmentResponse400> Error
     */
    SDK.prototype.contactsAttachment = function (body, metadata) {
        return this.core.fetch('/contacts/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Endpoint que permite eliminar archivos a un contacto en la aplicación
     *
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteAttachmentContactResponse404> Archivo no encontrado
     */
    SDK.prototype.deleteAttachmentContact = function (metadata) {
        return this.core.fetch('/contacts/attachment/{idAttachment}', 'delete', metadata);
    };
    /**
     * Endpoint que permite restaurar un contacto en la aplicación
     *
     * @summary Restaurar contacto
     * @throws FetchError<404, types.RestoreContactResponse404> Error contacto no encontrado
     */
    SDK.prototype.restoreContact = function (metadata) {
        return this.core.fetch('/contacts/restore/{id}', 'put', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
