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
     * Endpoint que retorna las facturas registradas en la cuenta de Alegra. Si no se envía
     * límite de facturas, por defecto se envían 30 facturas.
     *
     * @summary Lista de facturas de venta
     * @throws FetchError<404, types.GetInvoicesResponse404> Bad request - Límite sobrepasa máximo permitido
     */
    SDK.prototype.getInvoices = function (metadata) {
        return this.core.fetch('/invoices', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una factura de venta desde cero.
     *
     * @summary Crear factura de venta
     * @throws FetchError<400, types.PostInvoicesResponse400> Bad request
     */
    SDK.prototype.postInvoices = function (body) {
        return this.core.fetch('/invoices', 'post', body);
    };
    /**
     * Endpoint que permite consultar una factura de venta registrada en la aplicación. Retorna
     * toda la información asociada al ID de la factura de venta que se envía como parámetro.
     *
     * @summary Consultar una factura de venta
     * @throws FetchError<404, types.GetInvoicesIdResponse404> Not Found
     */
    SDK.prototype.getInvoicesId = function (metadata) {
        return this.core.fetch('/invoices/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar una factura de venta. Únicamente se modifican los atributos
     * que se envían en el request, los otros atributos del objeto que no se envían quedan
     * intactos.  Se retorna la factura de venta que se ha modificado.
     *
     * Por ejemplo para editar la fecha de creación de una factura de venta se debe enviar el
     * siguiente JSON: {"date" : "2016-06-27"}. Para eliminar algún dato de la factura de venta
     * enviar el atributo en null, así: {"observations" : null}.
     *
     *
     * @summary Editar factura de venta
     * @throws FetchError<400, types.PutInvoicesIdResponse400> Bad request
     */
    SDK.prototype.putInvoicesId = function (body, metadata) {
        return this.core.fetch('/invoices/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una factura de venta en estado borrador/draft.
     *
     * @summary Eliminar factura de venta
     * @throws FetchError<404, types.DeleteInvoicesIdResponse404> Not Found
     */
    SDK.prototype.deleteInvoicesId = function (metadata) {
        return this.core.fetch('/invoices/{id}', 'delete', metadata);
    };
    /**
     * Endpoint para envíar una factura de venta por correo.
     *
     * @summary Enviar factura por correo
     * @throws FetchError<404, types.PostInvoicesIdEmailResponse404> Not Found
     */
    SDK.prototype.postInvoicesIdEmail = function (body, metadata) {
        return this.core.fetch('/invoices/{id}/email', 'post', body, metadata);
    };
    SDK.prototype.postInvoicesIdAttachment = function (body, metadata) {
        return this.core.fetch('/invoices/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Eliminar un archivo adjunto de una factura de venta
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteInvoicesAttachmentIdattachmentResponse404> No se ha encontrado el archivo con el id especificado
     */
    SDK.prototype.deleteInvoicesAttachmentIdattachment = function (metadata) {
        return this.core.fetch('/invoices/attachment/{idAttachment}', 'delete', metadata);
    };
    /**
     * Endpoint que permite revertir la anulación de una factura.
     *
     * Nota: En caso de no enviar el objeto stamp se asume que se desea abrir la factura sin
     * timbrar.
     *
     *
     * @summary Abrir factura de venta
     * @throws FetchError<404, types.PostInvoicesIdOpenResponse404> Not Found
     */
    SDK.prototype.postInvoicesIdOpen = function (body, metadata) {
        return this.core.fetch('/invoices/{id}/open', 'post', body, metadata);
    };
    /**
     * Endpoint que permite anular una factura de venta.
     *
     * @summary Anular factura de venta
     * @throws FetchError<404, types.PostInvoicesIdVoidResponse404> Not Found
     */
    SDK.prototype.postInvoicesIdVoid = function (body, metadata) {
        return this.core.fetch('/invoices/{id}/void', 'post', body, metadata);
    };
    /**
     * Endpoint que permite editar retenciones aplicadas a factura de venta abierta. Enviar
     * arreglo vacio si desea remover todas las retenciones aplicadas
     *
     * @summary Edita las retenciones aplicadas a factura de venta
     * @throws FetchError<400, types.PutInvoicesIdRetentionsappliedResponse400> Bad request
     */
    SDK.prototype.putInvoicesIdRetentionsapplied = function (body, metadata) {
        return this.core.fetch('/invoices/{id}/retentionsApplied', 'put', body, metadata);
    };
    /**
     * Endpoint que permite generar la url para consultar el pdf de la vista previa de la
     * creación de la factura de venta.
     *
     * @summary Vista previa factura de venta
     * @throws FetchError<400, types.PostInvoicesPreviewResponse400> Bad request
     */
    SDK.prototype.postInvoicesPreview = function (body) {
        return this.core.fetch('/invoices/preview', 'post', body);
    };
    /**
     * Endpoint que permite timbrar hasta 10 facturas cuando se encuentran es estado borrador o
     * en estado abierto.
     *
     * @summary Emitir facturas de venta masivamente
     * @throws FetchError<400, types.PostInvoicesStampResponse400> Bad request
     */
    SDK.prototype.postInvoicesStamp = function (body) {
        return this.core.fetch('/invoices/stamp', 'post', body);
    };
    /**
     * Endpoint que retorna los pagos registrados en la cuenta de Alegra. Si no se envía límite
     * de pagos por defecto se envían 30.
     *
     * @summary Lista de pagos
     * @throws FetchError<404, types.GetPaymentsResponse404> Bad request - Límite sobrepasa máximo permitido
     */
    SDK.prototype.getPayments = function (metadata) {
        return this.core.fetch('/payments', 'get', metadata);
    };
    /**
     * Endpoint que permite registrar un pago en la aplicación.
     *
     * @summary Crear pago
     * @throws FetchError<400, types.PostPaymentsResponse400> Bad request
     */
    SDK.prototype.postPayments = function (body) {
        return this.core.fetch('/payments', 'post', body);
    };
    /**
     * Endpoint que retorna el pago registrado en la cuenta de Alegra que está identificado con
     * el id que se envía como parámetro.
     *
     * @summary Consultar un pago
     * @throws FetchError<404, types.GetPaymentsIdResponse404> Bad request - Not Found
     */
    SDK.prototype.getPaymentsId = function (metadata) {
        return this.core.fetch('/payments/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar un pago en la aplicación. Únicamente se modifican los
     * atributos que se envían en el request, los otros atributos del objeto que no se envían
     * quedan intactos. Se retorna el pago que se ha modificado.
     *
     * Por ejemplo para editar la fecha de creación de un pago se debe enviar el siguiente
     * JSON: {"date" : "2016-06-27"}
     * Para eliminar algún dato del pago enviar el atributo en null, así: {"observations" :
     * null}
     *
     * Se debe tener en cuenta que el tipo del pago no puede se modificado, es decir, un pago
     * tipo in, no puede editarse a tipo out.
     *
     *
     * @summary Editar pago
     * @throws FetchError<400, types.PutPaymentsIdResponse400> Bad request
     */
    SDK.prototype.putPaymentsId = function (body, metadata) {
        return this.core.fetch('/payments/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint disponible para eliminar pagos recibidos o transacciones realizadas
     *
     * @summary Eliminar pago
     * @throws FetchError<400, types.DeletePaymentsIdResponse400> Bad request - Error
     * @throws FetchError<404, types.DeletePaymentsIdResponse404> Bad request - Not Found
     */
    SDK.prototype.deletePaymentsId = function (metadata) {
        return this.core.fetch('/payments/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite anular un pago en la aplicación. La anulación de pagos sirve para
     * mantener registro del pago en la aplicación pero que este documento no tenga efecto en
     * la contabilidad o reportes de la aplicación. Para reconocer un pago anulado se debe
     * verificar la propiedad "status", la cual para un pago anulado debe estar en "void".
     *
     * @summary Anular pago
     * @throws FetchError<400, types.PostPaymentsIdVoidResponse400> Bad request
     */
    SDK.prototype.postPaymentsIdVoid = function (metadata) {
        return this.core.fetch('/payments/{id}/void', 'post', metadata);
    };
    /**
     * Endpoint que permite revertir la anulación de un pago. Para revertir la anulación de un
     * pago y que éste tenga efecto en la contabilidad y reportes de la aplicación se debe
     * convertir a abierto el pago, de esta forma el comprobante vuelve a su estado natural el
     * cual es "open".
     *
     * La api retorna el pago que se convirtió a abierto.
     *
     *
     * @summary Convertir pago a abierto
     * @throws FetchError<400, types.PostPaymentsIdOpenResponse400> Bad request
     */
    SDK.prototype.postPaymentsIdOpen = function (metadata) {
        return this.core.fetch('/payments/{id}/open', 'post', metadata);
    };
    SDK.prototype.postPaymentsIdAttachment = function (body, metadata) {
        return this.core.fetch('/payments/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Endpoint que permite consultar las notas de crédito registradas en la cuenta de Alegra.
     * Si no se envía límite de notas de crédito por defecto se envían 30.
     *
     * @summary Lista de notas de crédito
     */
    SDK.prototype.getCreditNotes = function (metadata) {
        return this.core.fetch('/credit-notes', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una nota de crédito desde cero.
     *
     * @summary Crear nota de crédito
     * @throws FetchError<400, types.PostCreditNotesResponse400> Bad request
     */
    SDK.prototype.postCreditNotes = function (body) {
        return this.core.fetch('/credit-notes', 'post', body);
    };
    /**
     * Endpoint que permite consultar una nota de crédito registrada en la aplicación.
     *
     * @summary Consultar una nota de crédito
     * @throws FetchError<404, types.GetCreditNotesIdResponse404> Not Found
     */
    SDK.prototype.getCreditNotesId = function (metadata) {
        return this.core.fetch('/credit-notes/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar una nota de crédito en la aplicación. Únicamente se
     * modifican los atributos que se envían en el request, los otros atributos del objeto que
     * no se envían quedan intactos. Se retorna la nota de crédito que se ha modificado.
     *
     * Por ejemplo para editar la fecha de creación de una nota de crédito se debe enviar el
     * siguiente JSON: {"date" : "2016-06-27"}.
     * Para eliminar algún dato de la nota de crédito enviar el atributo en null, así:
     * {"observations" : null}
     *
     *
     * @summary Editar nota crédito
     * @throws FetchError<400, types.PutCreditNotesIdResponse400> Not Found
     */
    SDK.prototype.putCreditNotesId = function (body, metadata) {
        return this.core.fetch('/credit-notes/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint para eliminar la información de una nota de crédito.
     *
     * @summary Eliminar nota de crédito
     * @throws FetchError<404, types.DeleteCreditNotesIdResponse404> Not Found
     */
    SDK.prototype.deleteCreditNotesId = function (metadata) {
        return this.core.fetch('/credit-notes/{id}', 'delete', metadata);
    };
    /**
     * Enpoint para envíar una nota de crédito por correo.
     *
     * @summary Enviar nota de crédito por correo
     * @throws FetchError<404, types.PostCreditNotesIdEmailResponse404> Not Found
     */
    SDK.prototype.postCreditNotesIdEmail = function (body, metadata) {
        return this.core.fetch('/credit-notes/{id}/email', 'post', body, metadata);
    };
    /**
     * Endpoint que permite consultar un listado de notas débito cliente registradas en alegra.
     *
     * @summary Lista de notas débito cliente
     */
    SDK.prototype.getIncomeDebitNotes = function (metadata) {
        return this.core.fetch('/income-debit-notes', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una nota débito cliente desde cero.
     *
     * @summary Crear nota débito cliente
     * @throws FetchError<400, types.PostIncomeDebitNotesResponse400> Bad request
     */
    SDK.prototype.postIncomeDebitNotes = function (body) {
        return this.core.fetch('/income-debit-notes', 'post', body);
    };
    /**
     * Endpoint que permite consultar una nota débito cliente registrada en la aplicación.
     *
     * @summary Consultar una nota débito cliente
     * @throws FetchError<404, types.GetIncomeDebitNotesIdResponse404> Not Found
     */
    SDK.prototype.getIncomeDebitNotesId = function (metadata) {
        return this.core.fetch('/income-debit-notes/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar una nota débito cliente en la aplicación. Únicamente se
     * modifican los atributos que se envían en el request, los otros atributos del objeto que
     * no se envían quedan intactos. Se retorna la nota débito cliente que se ha modificado.
     *
     * @summary Editar nota débito cliente
     * @throws FetchError<400, types.PutIncomeDebitNotesIdResponse400> Bad request
     */
    SDK.prototype.putIncomeDebitNotesId = function (body, metadata) {
        return this.core.fetch('/income-debit-notes/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint para eliminar la información de una nota débito cliente.
     *
     * @summary Eliminar nota débito cliente
     * @throws FetchError<404, types.DeleteIncomeDebitNotesIdResponse404> Not Found
     */
    SDK.prototype.deleteIncomeDebitNotesId = function (metadata) {
        return this.core.fetch('/income-debit-notes/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las cotizaciones registradas en la aplicación.
     *
     * @summary Lista de cotizaciones
     * @throws FetchError<404, types.GetEstimatesResponse404> Bad request - Límite sobrepasa máximo permitido
     */
    SDK.prototype.getEstimates = function (metadata) {
        return this.core.fetch('/estimates', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una cotización desde cero.
     *
     * @summary Crear una cotización
     * @throws FetchError<400, types.PostEstimatesResponse400> Bad request
     */
    SDK.prototype.postEstimates = function (body) {
        return this.core.fetch('/estimates', 'post', body);
    };
    /**
     * Endpoint que retorna la cotización registrada en la aplicación y está identificada con
     * el id que se envía como parámetro.
     *
     * @summary Consultar una cotización
     * @throws FetchError<404, types.GetEstimatesIdResponse404> No se ha encontrado la cotización con el id especificado
     */
    SDK.prototype.getEstimatesId = function (metadata) {
        return this.core.fetch('/estimates/{id}', 'get', metadata);
    };
    /**
     * Endpoint para editar una cotización. Únicamente se modifican los atributos que se envían
     * en el request, los otros atributos del objeto que no se envían quedan intactos. Se
     * retorna el pago que se ha modificado.
     *
     * Por ejemplo para editar la fecha de creación de una cotización se debe enviar el
     * siguiente JSON: {"date" : "2016-06-27"}
     * Para eliminar algún dato de la cotización se debe enviar el atributo en null, así:
     * {"observations" : null}
     *
     *
     * @summary Editar una cotización
     * @throws FetchError<400, types.PutEstimatesIdResponse400> Bad request
     */
    SDK.prototype.putEstimatesId = function (body, metadata) {
        return this.core.fetch('/estimates/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint para eliminar la información de una cotización.
     *
     * @summary Eliminar una cotización
     * @throws FetchError<400, types.DeleteEstimatesIdResponse400> Cotización con facturas de venta asociadas
     * @throws FetchError<404, types.DeleteEstimatesIdResponse404> No se ha encontrado la cotización con el id especificado
     */
    SDK.prototype.deleteEstimatesId = function (metadata) {
        return this.core.fetch('/estimates/{id}', 'delete', metadata);
    };
    /**
     * Enpoint para enviar una cotización por correo
     *
     * @summary Enviar cotización por correo
     * @throws FetchError<404, types.PostEstimatesIdEmailResponse404> No se ha encontrado la cotización con el id especificado
     */
    SDK.prototype.postEstimatesIdEmail = function (body, metadata) {
        return this.core.fetch('/estimates/{id}/email', 'post', body, metadata);
    };
    /**
     * Endpoint que permite consultar una remisión registrada en la aplicación. Si no se envía
     * límite de remisiones, por defecto se envían 30 remisiones.
     *
     * Se debe tener en cuenta que el valor máximo para el atributo limit es 30, si se supera
     * ese valor la aplicación retorna el código de error: `{"code":903,
     * "message": "El límite debe ser menor o igual a 30"}`
     *
     *
     * @summary Lista de remisiones
     * @throws FetchError<400, types.GetRemissionsResponse400> Bad request - Límite sobrepasa máximo permitido
     */
    SDK.prototype.getRemissions = function (metadata) {
        return this.core.fetch('/remissions', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una remisión desde cero.
     *
     * @summary Crea una remisión
     * @throws FetchError<400, types.PostRemissionsResponse400> Bad request
     */
    SDK.prototype.postRemissions = function (body) {
        return this.core.fetch('/remissions', 'post', body);
    };
    /**
     * Endpoint que permite consultar las remisiones registradas en la aplicación.
     *
     * @summary Consultar una remisión
     * @throws FetchError<404, types.GetRemissionsIdResponse404> No se ha encontrado la remisión con el id especificado
     */
    SDK.prototype.getRemissionsId = function (metadata) {
        return this.core.fetch('/remissions/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar una remisión.
     *
     * @summary Editar una remisión
     * @throws FetchError<400, types.PutRemissionsIdResponse400> Bad request
     */
    SDK.prototype.putRemissionsId = function (body, metadata) {
        return this.core.fetch('/remissions/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint para eliminar la información de una remisión.
     *
     * @summary Eliminar una remisión
     * @throws FetchError<400, types.DeleteRemissionsIdResponse400> Remisión con facturas de venta asociadas
     * @throws FetchError<404, types.DeleteRemissionsIdResponse404> No se ha encontrado la remisión con el id especificado
     */
    SDK.prototype.deleteRemissionsId = function (metadata) {
        return this.core.fetch('/remissions/{id}', 'delete', metadata);
    };
    /**
     * Endpoint para abrir una remisión.
     *
     * @summary Abrir remisión
     * @throws FetchError<404, types.PostRemissionsIdOpenResponse404> No se ha encontrado la remisión con el id especificado
     */
    SDK.prototype.postRemissionsIdOpen = function (metadata) {
        return this.core.fetch('/remissions/{id}/open', 'post', metadata);
    };
    /**
     * Endpoint para anular una remisión.
     *
     * @summary Anular remisión
     * @throws FetchError<404, types.PostRemissionsIdVoidResponse404> No se ha encontrado la remisión con el id especificado
     */
    SDK.prototype.postRemissionsIdVoid = function (metadata) {
        return this.core.fetch('/remissions/{id}/void', 'post', metadata);
    };
    SDK.prototype.postRemissionsIdAttachment = function (body, metadata) {
        return this.core.fetch('/remissions/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Eliminar un archivo adjunto de la remisión
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteRemissionsAttachmentIdattachmentResponse404> No se ha encontrado la remisión con el id especificado
     */
    SDK.prototype.deleteRemissionsAttachmentIdattachment = function (metadata) {
        return this.core.fetch('/remissions/attachment/{idAttachment}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar las facturas globales registradas en la aplicación.
     *
     * @summary Lista de facturas globales
     */
    SDK.prototype.getGlobalInvoices = function () {
        return this.core.fetch('/global-invoices', 'get');
    };
    /**
     * Endpoint que permite crear una factura global
     *
     * Nota: Las facturas globales son timbradas automáticamente, en caso de error de timbre
     * son creadas en estado Borrador.
     *
     *
     * @summary Crear factura global
     * @throws FetchError<400, types.PostGlobalInvoicesResponse400> La factura global no puede ser creada
     */
    SDK.prototype.postGlobalInvoices = function (body) {
        return this.core.fetch('/global-invoices', 'post', body);
    };
    /**
     * Endpoint que permite consultar una factura global registrada en la aplicación
     *
     * @summary Consultar una factura global
     * @throws FetchError<404, types.GetGlobalInvoicesIdResponse404> Objeto que representa la respuesta de la factura no encontrada
     */
    SDK.prototype.getGlobalInvoicesId = function (metadata) {
        return this.core.fetch('/global-invoices/{id}', 'get', metadata);
    };
    SDK.prototype.putGlobalInvoicesId = function (body, metadata) {
        return this.core.fetch('/global-invoices/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una factura global registrada en la aplicación
     *
     * @summary Eliminar factura global
     * @throws FetchError<400, types.DeleteGlobalInvoicesIdResponse400> La factura global no puede ser eliminada.
     * @throws FetchError<404, types.DeleteGlobalInvoicesIdResponse404> No se ha encontrado la factura global con el id especificado
     */
    SDK.prototype.deleteGlobalInvoicesId = function (metadata) {
        return this.core.fetch('/global-invoices/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que permite consultar los documentos de traslado registrados en la aplicación.
     *
     * @summary Lista de documentos de traslado
     * @throws FetchError<400, types.GetTransportationReceiptsResponse400> Bad request - Límite sobrepasa máximo permitido
     */
    SDK.prototype.getTransportationReceipts = function (metadata) {
        return this.core.fetch('/transportation-receipts', 'get', metadata);
    };
    /**
     * Endpoint que permite registrar un documento de traslado en la aplicación.
     *
     * @summary Crear un documento de traslado
     * @throws FetchError<400, types.PostTransportationReceiptsResponse400> Bad Request
     */
    SDK.prototype.postTransportationReceipts = function (body) {
        return this.core.fetch('/transportation-receipts', 'post', body);
    };
    /**
     * Endpoint que permite consultar un documento de traslado registrada en la aplicación.
     * Retorna toda la información asociada al ID del documento de traslado que se envía como
     * parámetro.
     *
     * @summary Consultar un documento de traslado
     * @throws FetchError<404, types.GetTransportationReceiptsIdResponse404> Not Found
     */
    SDK.prototype.getTransportationReceiptsId = function (metadata) {
        return this.core.fetch('/transportation-receipts/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar un documento de traslado. Únicamente se modifican los
     * atributos que se envían en el request, los otros atributos del objeto que no se envían
     * quedan intactos.  Se retorna el documento de traslado que se ha modificado.
     *
     * Por ejemplo para editar la fecha de creación de un documento de traslado se debe enviar
     * el siguiente JSON: {"date" : "2016-06-27"}. Para eliminar algún dato de la factura
     * enviar el atributo en null, así: {"observations" : null}.
     *
     *
     * @summary Editar documento de traslado
     * @throws FetchError<400, types.PutTransportationReceiptsIdResponse400> Bad Request
     */
    SDK.prototype.putTransportationReceiptsId = function (body, metadata) {
        return this.core.fetch('/transportation-receipts/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar un documento de traslado en estado borrador/draft.
     *
     * @summary Eliminar documento de traslado
     * @throws FetchError<404, types.DeleteTransportationReceiptsIdResponse404> Not Found
     */
    SDK.prototype.deleteTransportationReceiptsId = function (metadata) {
        return this.core.fetch('/transportation-receipts/{id}', 'delete', metadata);
    };
    /**
     * Endpoint para envíar un documento de traslado por correo.
     *
     * @summary Enviar documento por correo
     * @throws FetchError<404, types.PostTransportationReceiptsIdEmailResponse404> Not Found
     */
    SDK.prototype.postTransportationReceiptsIdEmail = function (body, metadata) {
        return this.core.fetch('/transportation-receipts/{id}/email', 'post', body, metadata);
    };
    SDK.prototype.postTransportationReceiptsIdAttachment = function (body, metadata) {
        return this.core.fetch('/transportation-receipts/{id}/attachment', 'post', body, metadata);
    };
    /**
     * Eliminar un archivo adjunto de un documento de traslado
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteTransportationReceiptsAttachmentIdattachmentResponse404> No se ha encontrado el archivo con el id especificado
     */
    SDK.prototype.deleteTransportationReceiptsAttachmentIdattachment = function (metadata) {
        return this.core.fetch('/transportation-receipts/attachment/{idAttachment}', 'delete', metadata);
    };
    /**
     * Endpoint que permite revertir la anulación de una factura.
     *
     * Nota: En caso de no enviar el objeto stamp se asume que se desea abrir la factura sin
     * timbrar.
     *
     *
     * @summary Abrir documento de traslado
     * @throws FetchError<404, types.PostTransportationReceiptsIdOpenResponse404> Not Found
     */
    SDK.prototype.postTransportationReceiptsIdOpen = function (body, metadata) {
        return this.core.fetch('/transportation-receipts/{id}/open', 'post', body, metadata);
    };
    /**
     * Endpoint que permite anular un documento de traslado.
     *
     * @summary Anular documento de traslado
     * @throws FetchError<404, types.PostTransportationReceiptsIdVoidResponse404> Not Found
     */
    SDK.prototype.postTransportationReceiptsIdVoid = function (body, metadata) {
        return this.core.fetch('/transportation-receipts/{id}/void', 'post', body, metadata);
    };
    /**
     * Endpoint que permite generar la url para consultar el pdf de la vista previa de la
     * creación del documento de traslado.
     *
     * @summary Vista previa de un documento de traslado
     * @throws FetchError<400, types.PostTransportationReceiptsPreviewResponse400> Bad request
     */
    SDK.prototype.postTransportationReceiptsPreview = function (body) {
        return this.core.fetch('/transportation-receipts/preview', 'post', body);
    };
    /**
     * Endpoint que retorna las facturas recurrentes registradas en la cuenta de Alegra. Si no
     * se envía límite de facturas, por defecto se envían 30 facturas.
     *
     * @summary Lista de facturas recurrentes
     */
    SDK.prototype.getRecurringInvoices = function (metadata) {
        return this.core.fetch('/recurring-invoices', 'get', metadata);
    };
    /**
     * Endpoint que permite crear una factura recurrente.
     *
     * @summary Crea una factura recurrente
     * @throws FetchError<400, types.PostRecurringInvoicesResponse400> Bad request
     */
    SDK.prototype.postRecurringInvoices = function (body) {
        return this.core.fetch('/recurring-invoices', 'post', body);
    };
    /**
     * Endpoint que permite consultar una factura recurrente registrada en la aplicación.
     * Retorna toda la información asociada al ID de la factura recurrente que se envía como
     * parámetro.
     *
     * @summary Consultar una factura recurrente
     * @throws FetchError<404, types.GetRecurringInvoicesIdResponse404> Not Found
     */
    SDK.prototype.getRecurringInvoicesId = function (metadata) {
        return this.core.fetch('/recurring-invoices/{id}', 'get', metadata);
    };
    /**
     * Endpoint que permite editar una factura recurrente. Únicamente se modifican los
     * atributos que se envían en el request, los otros atributos del objeto que no se envían
     * quedan intactos. Se retorna la factura recurrente que se ha modificado.
     *
     * Por ejemplo para editar el término de pago de una factura recurrente se debe enviar el
     * siguiente JSON: {"term" : 2}. Para eliminar algún dato de la factura de venta enviar el
     * atributo en null, así: {"observations" : null}.
     *
     *
     * @summary Editar una factura recurrente
     * @throws FetchError<400, types.PutRecurringInvoicesIdResponse400> Bad request
     * @throws FetchError<404, types.PutRecurringInvoicesIdResponse404> Not Found
     */
    SDK.prototype.putRecurringInvoicesId = function (body, metadata) {
        return this.core.fetch('/recurring-invoices/{id}', 'put', body, metadata);
    };
    /**
     * Endpoint que permite eliminar una factura recurrente.
     *
     * @summary Eliminar una factura recurrente
     * @throws FetchError<404, types.DeleteRecurringInvoicesIdResponse404> Not Found
     */
    SDK.prototype.deleteRecurringInvoicesId = function (metadata) {
        return this.core.fetch('/recurring-invoices/{id}', 'delete', metadata);
    };
    /**
     * Endpoint que retorna llos tickets registrados en la cuenta de Alegra. Si no se envía
     * límite de tickets, por defecto se envían 30.
     *
     * @summary Lista de tickets de venta
     * @throws FetchError<400, types.GetSaleTicketsResponse400> Bad request - Límite sobrepasa máximo permitido
     */
    SDK.prototype.getSaleTickets = function (metadata) {
        return this.core.fetch('/sale-tickets', 'get', metadata);
    };
    /**
     * Endpoint que permite convertir un ticket en factura.
     *
     * @summary Convertir ticket en factura
     * @throws FetchError<404, types.PostSaleTicketsConvertInvoiceResponse404> Ticket de venta no encontrado
     */
    SDK.prototype.postSaleTicketsConvertInvoice = function (body) {
        return this.core.fetch('/sale-tickets/convert/invoice', 'post', body);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
