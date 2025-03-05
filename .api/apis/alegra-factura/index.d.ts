import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
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
    auth(...values: string[] | number[]): this;
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
    server(url: string, variables?: {}): void;
    /**
     * Endpoint que retorna las facturas registradas en la cuenta de Alegra. Si no se envía
     * límite de facturas, por defecto se envían 30 facturas.
     *
     * @summary Lista de facturas de venta
     * @throws FetchError<404, types.GetInvoicesResponse404> Bad request - Límite sobrepasa máximo permitido
     */
    getInvoices(metadata?: types.GetInvoicesMetadataParam): Promise<FetchResponse<200, types.GetInvoicesResponse200>>;
    /**
     * Endpoint que permite crear una factura de venta desde cero.
     *
     * @summary Crear factura de venta
     * @throws FetchError<400, types.PostInvoicesResponse400> Bad request
     */
    postInvoices(body: types.PostInvoicesBodyParam): Promise<FetchResponse<200, types.PostInvoicesResponse200>>;
    /**
     * Endpoint que permite consultar una factura de venta registrada en la aplicación. Retorna
     * toda la información asociada al ID de la factura de venta que se envía como parámetro.
     *
     * @summary Consultar una factura de venta
     * @throws FetchError<404, types.GetInvoicesIdResponse404> Not Found
     */
    getInvoicesId(metadata: types.GetInvoicesIdMetadataParam): Promise<FetchResponse<200, types.GetInvoicesIdResponse200>>;
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
    putInvoicesId(body: types.PutInvoicesIdBodyParam, metadata: types.PutInvoicesIdMetadataParam): Promise<FetchResponse<200, types.PutInvoicesIdResponse200>>;
    /**
     * Endpoint que permite eliminar una factura de venta en estado borrador/draft.
     *
     * @summary Eliminar factura de venta
     * @throws FetchError<404, types.DeleteInvoicesIdResponse404> Not Found
     */
    deleteInvoicesId(metadata: types.DeleteInvoicesIdMetadataParam): Promise<FetchResponse<200, types.DeleteInvoicesIdResponse200>>;
    /**
     * Endpoint para envíar una factura de venta por correo.
     *
     * @summary Enviar factura por correo
     * @throws FetchError<404, types.PostInvoicesIdEmailResponse404> Not Found
     */
    postInvoicesIdEmail(body: types.PostInvoicesIdEmailBodyParam, metadata: types.PostInvoicesIdEmailMetadataParam): Promise<FetchResponse<200, types.PostInvoicesIdEmailResponse200>>;
    /**
     * Para adjuntar un archivo a una factura de venta se debe enviar un request en el cual se
     * debe especificar el header Content-Type como multipart/form-data.
     *
     * Se debe tener en cuenta que solo se puede enviar un archivo por request. El tamaño
     * máximo permitido para éste es 2MB.
     *
     * Si la operación fue exitosa se retorna una URL para acceder al archivo asociado. Esta
     * URL tiene vencimiento de 30 minutos; después de este período se debe consultar la
     * factura de venta para obtener una nueva URL válida.
     *
     *
     * @summary Adjuntar archivos a facturas de venta
     * @throws FetchError<404, types.PostInvoicesIdAttachmentResponse404> Not Found
     */
    postInvoicesIdAttachment(body: types.PostInvoicesIdAttachmentBodyParam, metadata: types.PostInvoicesIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostInvoicesIdAttachmentResponse200>>;
    postInvoicesIdAttachment(metadata: types.PostInvoicesIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostInvoicesIdAttachmentResponse200>>;
    /**
     * Eliminar un archivo adjunto de una factura de venta
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteInvoicesAttachmentIdattachmentResponse404> No se ha encontrado el archivo con el id especificado
     */
    deleteInvoicesAttachmentIdattachment(metadata: types.DeleteInvoicesAttachmentIdattachmentMetadataParam): Promise<FetchResponse<200, types.DeleteInvoicesAttachmentIdattachmentResponse200>>;
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
    postInvoicesIdOpen(body: types.PostInvoicesIdOpenBodyParam, metadata: types.PostInvoicesIdOpenMetadataParam): Promise<FetchResponse<200, types.PostInvoicesIdOpenResponse200>>;
    /**
     * Endpoint que permite anular una factura de venta.
     *
     * @summary Anular factura de venta
     * @throws FetchError<404, types.PostInvoicesIdVoidResponse404> Not Found
     */
    postInvoicesIdVoid(body: types.PostInvoicesIdVoidBodyParam, metadata: types.PostInvoicesIdVoidMetadataParam): Promise<FetchResponse<200, types.PostInvoicesIdVoidResponse200>>;
    /**
     * Endpoint que permite editar retenciones aplicadas a factura de venta abierta. Enviar
     * arreglo vacio si desea remover todas las retenciones aplicadas
     *
     * @summary Edita las retenciones aplicadas a factura de venta
     * @throws FetchError<400, types.PutInvoicesIdRetentionsappliedResponse400> Bad request
     */
    putInvoicesIdRetentionsapplied(body: types.PutInvoicesIdRetentionsappliedBodyParam, metadata: types.PutInvoicesIdRetentionsappliedMetadataParam): Promise<FetchResponse<200, types.PutInvoicesIdRetentionsappliedResponse200>>;
    /**
     * Endpoint que permite generar la url para consultar el pdf de la vista previa de la
     * creación de la factura de venta.
     *
     * @summary Vista previa factura de venta
     * @throws FetchError<400, types.PostInvoicesPreviewResponse400> Bad request
     */
    postInvoicesPreview(body: types.PostInvoicesPreviewBodyParam): Promise<FetchResponse<200, types.PostInvoicesPreviewResponse200>>;
    /**
     * Endpoint que permite timbrar hasta 10 facturas cuando se encuentran es estado borrador o
     * en estado abierto.
     *
     * @summary Emitir facturas de venta masivamente
     * @throws FetchError<400, types.PostInvoicesStampResponse400> Bad request
     */
    postInvoicesStamp(body: types.PostInvoicesStampBodyParam): Promise<FetchResponse<200, types.PostInvoicesStampResponse200>>;
    /**
     * Endpoint que retorna los pagos registrados en la cuenta de Alegra. Si no se envía límite
     * de pagos por defecto se envían 30.
     *
     * @summary Lista de pagos
     * @throws FetchError<404, types.GetPaymentsResponse404> Bad request - Límite sobrepasa máximo permitido
     */
    getPayments(metadata?: types.GetPaymentsMetadataParam): Promise<FetchResponse<200, types.GetPaymentsResponse200>>;
    /**
     * Endpoint que permite registrar un pago en la aplicación.
     *
     * @summary Crear pago
     * @throws FetchError<400, types.PostPaymentsResponse400> Bad request
     */
    postPayments(body: types.PostPaymentsBodyParam): Promise<FetchResponse<200, types.PostPaymentsResponse200>>;
    /**
     * Endpoint que retorna el pago registrado en la cuenta de Alegra que está identificado con
     * el id que se envía como parámetro.
     *
     * @summary Consultar un pago
     * @throws FetchError<404, types.GetPaymentsIdResponse404> Bad request - Not Found
     */
    getPaymentsId(metadata: types.GetPaymentsIdMetadataParam): Promise<FetchResponse<200, types.GetPaymentsIdResponse200>>;
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
    putPaymentsId(body: types.PutPaymentsIdBodyParam, metadata: types.PutPaymentsIdMetadataParam): Promise<FetchResponse<200, types.PutPaymentsIdResponse200>>;
    /**
     * Endpoint disponible para eliminar pagos recibidos o transacciones realizadas
     *
     * @summary Eliminar pago
     * @throws FetchError<400, types.DeletePaymentsIdResponse400> Bad request - Error
     * @throws FetchError<404, types.DeletePaymentsIdResponse404> Bad request - Not Found
     */
    deletePaymentsId(metadata: types.DeletePaymentsIdMetadataParam): Promise<FetchResponse<200, types.DeletePaymentsIdResponse200>>;
    /**
     * Endpoint que permite anular un pago en la aplicación. La anulación de pagos sirve para
     * mantener registro del pago en la aplicación pero que este documento no tenga efecto en
     * la contabilidad o reportes de la aplicación. Para reconocer un pago anulado se debe
     * verificar la propiedad "status", la cual para un pago anulado debe estar en "void".
     *
     * @summary Anular pago
     * @throws FetchError<400, types.PostPaymentsIdVoidResponse400> Bad request
     */
    postPaymentsIdVoid(metadata: types.PostPaymentsIdVoidMetadataParam): Promise<FetchResponse<200, types.PostPaymentsIdVoidResponse200>>;
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
    postPaymentsIdOpen(metadata: types.PostPaymentsIdOpenMetadataParam): Promise<FetchResponse<200, types.PostPaymentsIdOpenResponse200>>;
    /**
     * Endpoint que permite adjuntar archivos a un pago. Para adjuntar un archivo a un pago se
     * debe enviar un request en el cual se debe especificar el header Content-Type como
     * multipart/form-data.
     *
     * Se debe tener en cuenta que solo se puede enviar un archivo por request. El tamaño
     * máximo permitido para éste es 2MB.
     *
     * Si la operación fue exitosa se retorna una URL para acceder al archivo asociado. Esta
     * URL tiene vencimiento de 30 minutos; después de este período se debe consultar el pago
     * para obtener una nueva URL válida.
     *
     *
     * @summary Adjuntar archivos a pagos
     */
    postPaymentsIdAttachment(body: types.PostPaymentsIdAttachmentBodyParam, metadata: types.PostPaymentsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostPaymentsIdAttachmentResponse200>>;
    postPaymentsIdAttachment(metadata: types.PostPaymentsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostPaymentsIdAttachmentResponse200>>;
    /**
     * Endpoint que permite consultar las notas de crédito registradas en la cuenta de Alegra.
     * Si no se envía límite de notas de crédito por defecto se envían 30.
     *
     * @summary Lista de notas de crédito
     */
    getCreditNotes(metadata?: types.GetCreditNotesMetadataParam): Promise<FetchResponse<200, types.GetCreditNotesResponse200>>;
    /**
     * Endpoint que permite crear una nota de crédito desde cero.
     *
     * @summary Crear nota de crédito
     * @throws FetchError<400, types.PostCreditNotesResponse400> Bad request
     */
    postCreditNotes(body: types.PostCreditNotesBodyParam): Promise<FetchResponse<200, types.PostCreditNotesResponse200>>;
    /**
     * Endpoint que permite consultar una nota de crédito registrada en la aplicación.
     *
     * @summary Consultar una nota de crédito
     * @throws FetchError<404, types.GetCreditNotesIdResponse404> Not Found
     */
    getCreditNotesId(metadata: types.GetCreditNotesIdMetadataParam): Promise<FetchResponse<200, types.GetCreditNotesIdResponse200>>;
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
    putCreditNotesId(body: types.PutCreditNotesIdBodyParam, metadata: types.PutCreditNotesIdMetadataParam): Promise<FetchResponse<200, types.PutCreditNotesIdResponse200>>;
    /**
     * Endpoint para eliminar la información de una nota de crédito.
     *
     * @summary Eliminar nota de crédito
     * @throws FetchError<404, types.DeleteCreditNotesIdResponse404> Not Found
     */
    deleteCreditNotesId(metadata: types.DeleteCreditNotesIdMetadataParam): Promise<FetchResponse<200, types.DeleteCreditNotesIdResponse200>>;
    /**
     * Enpoint para envíar una nota de crédito por correo.
     *
     * @summary Enviar nota de crédito por correo
     * @throws FetchError<404, types.PostCreditNotesIdEmailResponse404> Not Found
     */
    postCreditNotesIdEmail(body: types.PostCreditNotesIdEmailBodyParam, metadata: types.PostCreditNotesIdEmailMetadataParam): Promise<FetchResponse<200, types.PostCreditNotesIdEmailResponse200>>;
    /**
     * Endpoint que permite consultar un listado de notas débito cliente registradas en alegra.
     *
     * @summary Lista de notas débito cliente
     */
    getIncomeDebitNotes(metadata?: types.GetIncomeDebitNotesMetadataParam): Promise<FetchResponse<200, types.GetIncomeDebitNotesResponse200>>;
    /**
     * Endpoint que permite crear una nota débito cliente desde cero.
     *
     * @summary Crear nota débito cliente
     * @throws FetchError<400, types.PostIncomeDebitNotesResponse400> Bad request
     */
    postIncomeDebitNotes(body: types.PostIncomeDebitNotesBodyParam): Promise<FetchResponse<200, types.PostIncomeDebitNotesResponse200>>;
    /**
     * Endpoint que permite consultar una nota débito cliente registrada en la aplicación.
     *
     * @summary Consultar una nota débito cliente
     * @throws FetchError<404, types.GetIncomeDebitNotesIdResponse404> Not Found
     */
    getIncomeDebitNotesId(metadata: types.GetIncomeDebitNotesIdMetadataParam): Promise<FetchResponse<200, types.GetIncomeDebitNotesIdResponse200>>;
    /**
     * Endpoint que permite editar una nota débito cliente en la aplicación. Únicamente se
     * modifican los atributos que se envían en el request, los otros atributos del objeto que
     * no se envían quedan intactos. Se retorna la nota débito cliente que se ha modificado.
     *
     * @summary Editar nota débito cliente
     * @throws FetchError<400, types.PutIncomeDebitNotesIdResponse400> Bad request
     */
    putIncomeDebitNotesId(body: types.PutIncomeDebitNotesIdBodyParam, metadata: types.PutIncomeDebitNotesIdMetadataParam): Promise<FetchResponse<200, types.PutIncomeDebitNotesIdResponse200>>;
    /**
     * Endpoint para eliminar la información de una nota débito cliente.
     *
     * @summary Eliminar nota débito cliente
     * @throws FetchError<404, types.DeleteIncomeDebitNotesIdResponse404> Not Found
     */
    deleteIncomeDebitNotesId(metadata: types.DeleteIncomeDebitNotesIdMetadataParam): Promise<FetchResponse<200, types.DeleteIncomeDebitNotesIdResponse200>>;
    /**
     * Endpoint que permite consultar las cotizaciones registradas en la aplicación.
     *
     * @summary Lista de cotizaciones
     * @throws FetchError<404, types.GetEstimatesResponse404> Bad request - Límite sobrepasa máximo permitido
     */
    getEstimates(metadata?: types.GetEstimatesMetadataParam): Promise<FetchResponse<200, types.GetEstimatesResponse200>>;
    /**
     * Endpoint que permite crear una cotización desde cero.
     *
     * @summary Crear una cotización
     * @throws FetchError<400, types.PostEstimatesResponse400> Bad request
     */
    postEstimates(body: types.PostEstimatesBodyParam): Promise<FetchResponse<200, types.PostEstimatesResponse200>>;
    /**
     * Endpoint que retorna la cotización registrada en la aplicación y está identificada con
     * el id que se envía como parámetro.
     *
     * @summary Consultar una cotización
     * @throws FetchError<404, types.GetEstimatesIdResponse404> No se ha encontrado la cotización con el id especificado
     */
    getEstimatesId(metadata: types.GetEstimatesIdMetadataParam): Promise<FetchResponse<200, types.GetEstimatesIdResponse200>>;
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
    putEstimatesId(body: types.PutEstimatesIdBodyParam, metadata: types.PutEstimatesIdMetadataParam): Promise<FetchResponse<200, types.PutEstimatesIdResponse200>>;
    /**
     * Endpoint para eliminar la información de una cotización.
     *
     * @summary Eliminar una cotización
     * @throws FetchError<400, types.DeleteEstimatesIdResponse400> Cotización con facturas de venta asociadas
     * @throws FetchError<404, types.DeleteEstimatesIdResponse404> No se ha encontrado la cotización con el id especificado
     */
    deleteEstimatesId(metadata: types.DeleteEstimatesIdMetadataParam): Promise<FetchResponse<200, types.DeleteEstimatesIdResponse200>>;
    /**
     * Enpoint para enviar una cotización por correo
     *
     * @summary Enviar cotización por correo
     * @throws FetchError<404, types.PostEstimatesIdEmailResponse404> No se ha encontrado la cotización con el id especificado
     */
    postEstimatesIdEmail(body: types.PostEstimatesIdEmailBodyParam, metadata: types.PostEstimatesIdEmailMetadataParam): Promise<FetchResponse<200, types.PostEstimatesIdEmailResponse200>>;
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
    getRemissions(metadata?: types.GetRemissionsMetadataParam): Promise<FetchResponse<200, types.GetRemissionsResponse200>>;
    /**
     * Endpoint que permite crear una remisión desde cero.
     *
     * @summary Crea una remisión
     * @throws FetchError<400, types.PostRemissionsResponse400> Bad request
     */
    postRemissions(body: types.PostRemissionsBodyParam): Promise<FetchResponse<200, types.PostRemissionsResponse200>>;
    /**
     * Endpoint que permite consultar las remisiones registradas en la aplicación.
     *
     * @summary Consultar una remisión
     * @throws FetchError<404, types.GetRemissionsIdResponse404> No se ha encontrado la remisión con el id especificado
     */
    getRemissionsId(metadata: types.GetRemissionsIdMetadataParam): Promise<FetchResponse<200, types.GetRemissionsIdResponse200>>;
    /**
     * Endpoint que permite editar una remisión.
     *
     * @summary Editar una remisión
     * @throws FetchError<400, types.PutRemissionsIdResponse400> Bad request
     */
    putRemissionsId(body: types.PutRemissionsIdBodyParam, metadata: types.PutRemissionsIdMetadataParam): Promise<FetchResponse<200, types.PutRemissionsIdResponse200>>;
    /**
     * Endpoint para eliminar la información de una remisión.
     *
     * @summary Eliminar una remisión
     * @throws FetchError<400, types.DeleteRemissionsIdResponse400> Remisión con facturas de venta asociadas
     * @throws FetchError<404, types.DeleteRemissionsIdResponse404> No se ha encontrado la remisión con el id especificado
     */
    deleteRemissionsId(metadata: types.DeleteRemissionsIdMetadataParam): Promise<FetchResponse<200, types.DeleteRemissionsIdResponse200>>;
    /**
     * Endpoint para abrir una remisión.
     *
     * @summary Abrir remisión
     * @throws FetchError<404, types.PostRemissionsIdOpenResponse404> No se ha encontrado la remisión con el id especificado
     */
    postRemissionsIdOpen(metadata: types.PostRemissionsIdOpenMetadataParam): Promise<FetchResponse<200, types.PostRemissionsIdOpenResponse200>>;
    /**
     * Endpoint para anular una remisión.
     *
     * @summary Anular remisión
     * @throws FetchError<404, types.PostRemissionsIdVoidResponse404> No se ha encontrado la remisión con el id especificado
     */
    postRemissionsIdVoid(metadata: types.PostRemissionsIdVoidMetadataParam): Promise<FetchResponse<200, types.PostRemissionsIdVoidResponse200>>;
    /**
     * Adjuntar archivos o imágenes a una remisión
     *
     * @summary Adjuntar archivos o imágenes
     * @throws FetchError<404, types.PostRemissionsIdAttachmentResponse404> No se ha encontrado la remisión con el id especificado
     */
    postRemissionsIdAttachment(body: types.PostRemissionsIdAttachmentBodyParam, metadata: types.PostRemissionsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostRemissionsIdAttachmentResponse200>>;
    postRemissionsIdAttachment(metadata: types.PostRemissionsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostRemissionsIdAttachmentResponse200>>;
    /**
     * Eliminar un archivo adjunto de la remisión
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteRemissionsAttachmentIdattachmentResponse404> No se ha encontrado la remisión con el id especificado
     */
    deleteRemissionsAttachmentIdattachment(metadata: types.DeleteRemissionsAttachmentIdattachmentMetadataParam): Promise<FetchResponse<200, types.DeleteRemissionsAttachmentIdattachmentResponse200>>;
    /**
     * Endpoint que permite consultar las facturas globales registradas en la aplicación.
     *
     * @summary Lista de facturas globales
     */
    getGlobalInvoices(): Promise<FetchResponse<200, types.GetGlobalInvoicesResponse200>>;
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
    postGlobalInvoices(body?: types.PostGlobalInvoicesBodyParam): Promise<FetchResponse<201, types.PostGlobalInvoicesResponse201>>;
    /**
     * Endpoint que permite consultar una factura global registrada en la aplicación
     *
     * @summary Consultar una factura global
     * @throws FetchError<404, types.GetGlobalInvoicesIdResponse404> Objeto que representa la respuesta de la factura no encontrada
     */
    getGlobalInvoicesId(metadata: types.GetGlobalInvoicesIdMetadataParam): Promise<FetchResponse<200, types.GetGlobalInvoicesIdResponse200>>;
    /**
     * Endpoint que permite editar una factura global registrada en la aplicación.
     * Únicamente se modifican los atributos que se envían en el request, los otros atributos
     * del objeto que no se envían quedan intactos.
     *
     * Nota: Solo se pueden editar facturas globales que no hayan sido timbradas.
     *
     *
     * @summary Editar factura global
     * @throws FetchError<400, types.PutGlobalInvoicesIdResponse400> La factura global no puede ser editada
     */
    putGlobalInvoicesId(body: types.PutGlobalInvoicesIdBodyParam, metadata: types.PutGlobalInvoicesIdMetadataParam): Promise<FetchResponse<200, types.PutGlobalInvoicesIdResponse200>>;
    putGlobalInvoicesId(metadata: types.PutGlobalInvoicesIdMetadataParam): Promise<FetchResponse<200, types.PutGlobalInvoicesIdResponse200>>;
    /**
     * Endpoint que permite eliminar una factura global registrada en la aplicación
     *
     * @summary Eliminar factura global
     * @throws FetchError<400, types.DeleteGlobalInvoicesIdResponse400> La factura global no puede ser eliminada.
     * @throws FetchError<404, types.DeleteGlobalInvoicesIdResponse404> No se ha encontrado la factura global con el id especificado
     */
    deleteGlobalInvoicesId(metadata: types.DeleteGlobalInvoicesIdMetadataParam): Promise<FetchResponse<200, types.DeleteGlobalInvoicesIdResponse200>>;
    /**
     * Endpoint que permite consultar los documentos de traslado registrados en la aplicación.
     *
     * @summary Lista de documentos de traslado
     * @throws FetchError<400, types.GetTransportationReceiptsResponse400> Bad request - Límite sobrepasa máximo permitido
     */
    getTransportationReceipts(metadata?: types.GetTransportationReceiptsMetadataParam): Promise<FetchResponse<200, types.GetTransportationReceiptsResponse200>>;
    /**
     * Endpoint que permite registrar un documento de traslado en la aplicación.
     *
     * @summary Crear un documento de traslado
     * @throws FetchError<400, types.PostTransportationReceiptsResponse400> Bad Request
     */
    postTransportationReceipts(body: types.PostTransportationReceiptsBodyParam): Promise<FetchResponse<201, types.PostTransportationReceiptsResponse201>>;
    /**
     * Endpoint que permite consultar un documento de traslado registrada en la aplicación.
     * Retorna toda la información asociada al ID del documento de traslado que se envía como
     * parámetro.
     *
     * @summary Consultar un documento de traslado
     * @throws FetchError<404, types.GetTransportationReceiptsIdResponse404> Not Found
     */
    getTransportationReceiptsId(metadata: types.GetTransportationReceiptsIdMetadataParam): Promise<FetchResponse<200, types.GetTransportationReceiptsIdResponse200>>;
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
    putTransportationReceiptsId(body: types.PutTransportationReceiptsIdBodyParam, metadata: types.PutTransportationReceiptsIdMetadataParam): Promise<FetchResponse<200, types.PutTransportationReceiptsIdResponse200>>;
    /**
     * Endpoint que permite eliminar un documento de traslado en estado borrador/draft.
     *
     * @summary Eliminar documento de traslado
     * @throws FetchError<404, types.DeleteTransportationReceiptsIdResponse404> Not Found
     */
    deleteTransportationReceiptsId(metadata: types.DeleteTransportationReceiptsIdMetadataParam): Promise<FetchResponse<200, types.DeleteTransportationReceiptsIdResponse200>>;
    /**
     * Endpoint para envíar un documento de traslado por correo.
     *
     * @summary Enviar documento por correo
     * @throws FetchError<404, types.PostTransportationReceiptsIdEmailResponse404> Not Found
     */
    postTransportationReceiptsIdEmail(body: types.PostTransportationReceiptsIdEmailBodyParam, metadata: types.PostTransportationReceiptsIdEmailMetadataParam): Promise<FetchResponse<200, types.PostTransportationReceiptsIdEmailResponse200>>;
    /**
     * Para adjuntar un archivo a un documento de traslado se debe enviar un request en el cual
     * se debe especificar el header Content-Type como multipart/form-data.
     *
     * Se debe tener en cuenta que solo se puede enviar un archivo por request. El tamaño
     * máximo permitido para éste es 2MB.
     *
     * Si la operación fue exitosa se retorna una URL para acceder al archivo asociado. Esta
     * URL tiene vencimiento de 30 minutos; después de este período se debe consultar la
     * Documento de traslado para obtener una nueva URL válida.
     *
     *
     * @summary Adjuntar archivos a un documento de traslado
     * @throws FetchError<404, types.PostTransportationReceiptsIdAttachmentResponse404> Not Found
     */
    postTransportationReceiptsIdAttachment(body: types.PostTransportationReceiptsIdAttachmentBodyParam, metadata: types.PostTransportationReceiptsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostTransportationReceiptsIdAttachmentResponse200>>;
    postTransportationReceiptsIdAttachment(metadata: types.PostTransportationReceiptsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostTransportationReceiptsIdAttachmentResponse200>>;
    /**
     * Eliminar un archivo adjunto de un documento de traslado
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteTransportationReceiptsAttachmentIdattachmentResponse404> No se ha encontrado el archivo con el id especificado
     */
    deleteTransportationReceiptsAttachmentIdattachment(metadata: types.DeleteTransportationReceiptsAttachmentIdattachmentMetadataParam): Promise<FetchResponse<200, types.DeleteTransportationReceiptsAttachmentIdattachmentResponse200>>;
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
    postTransportationReceiptsIdOpen(body: types.PostTransportationReceiptsIdOpenBodyParam, metadata: types.PostTransportationReceiptsIdOpenMetadataParam): Promise<FetchResponse<200, types.PostTransportationReceiptsIdOpenResponse200>>;
    /**
     * Endpoint que permite anular un documento de traslado.
     *
     * @summary Anular documento de traslado
     * @throws FetchError<404, types.PostTransportationReceiptsIdVoidResponse404> Not Found
     */
    postTransportationReceiptsIdVoid(body: types.PostTransportationReceiptsIdVoidBodyParam, metadata: types.PostTransportationReceiptsIdVoidMetadataParam): Promise<FetchResponse<200, types.PostTransportationReceiptsIdVoidResponse200>>;
    /**
     * Endpoint que permite generar la url para consultar el pdf de la vista previa de la
     * creación del documento de traslado.
     *
     * @summary Vista previa de un documento de traslado
     * @throws FetchError<400, types.PostTransportationReceiptsPreviewResponse400> Bad request
     */
    postTransportationReceiptsPreview(body: types.PostTransportationReceiptsPreviewBodyParam): Promise<FetchResponse<200, types.PostTransportationReceiptsPreviewResponse200>>;
    /**
     * Endpoint que retorna las facturas recurrentes registradas en la cuenta de Alegra. Si no
     * se envía límite de facturas, por defecto se envían 30 facturas.
     *
     * @summary Lista de facturas recurrentes
     */
    getRecurringInvoices(metadata?: types.GetRecurringInvoicesMetadataParam): Promise<FetchResponse<200, types.GetRecurringInvoicesResponse200>>;
    /**
     * Endpoint que permite crear una factura recurrente.
     *
     * @summary Crea una factura recurrente
     * @throws FetchError<400, types.PostRecurringInvoicesResponse400> Bad request
     */
    postRecurringInvoices(body: types.PostRecurringInvoicesBodyParam): Promise<FetchResponse<200, types.PostRecurringInvoicesResponse200>>;
    /**
     * Endpoint que permite consultar una factura recurrente registrada en la aplicación.
     * Retorna toda la información asociada al ID de la factura recurrente que se envía como
     * parámetro.
     *
     * @summary Consultar una factura recurrente
     * @throws FetchError<404, types.GetRecurringInvoicesIdResponse404> Not Found
     */
    getRecurringInvoicesId(metadata: types.GetRecurringInvoicesIdMetadataParam): Promise<FetchResponse<200, types.GetRecurringInvoicesIdResponse200>>;
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
    putRecurringInvoicesId(body: types.PutRecurringInvoicesIdBodyParam, metadata: types.PutRecurringInvoicesIdMetadataParam): Promise<FetchResponse<200, types.PutRecurringInvoicesIdResponse200>>;
    /**
     * Endpoint que permite eliminar una factura recurrente.
     *
     * @summary Eliminar una factura recurrente
     * @throws FetchError<404, types.DeleteRecurringInvoicesIdResponse404> Not Found
     */
    deleteRecurringInvoicesId(metadata: types.DeleteRecurringInvoicesIdMetadataParam): Promise<FetchResponse<200, types.DeleteRecurringInvoicesIdResponse200>>;
    /**
     * Endpoint que retorna llos tickets registrados en la cuenta de Alegra. Si no se envía
     * límite de tickets, por defecto se envían 30.
     *
     * @summary Lista de tickets de venta
     * @throws FetchError<400, types.GetSaleTicketsResponse400> Bad request - Límite sobrepasa máximo permitido
     */
    getSaleTickets(metadata?: types.GetSaleTicketsMetadataParam): Promise<FetchResponse<200, types.GetSaleTicketsResponse200>>;
    /**
     * Endpoint que permite convertir un ticket en factura.
     *
     * @summary Convertir ticket en factura
     * @throws FetchError<404, types.PostSaleTicketsConvertInvoiceResponse404> Ticket de venta no encontrado
     */
    postSaleTicketsConvertInvoice(body: types.PostSaleTicketsConvertInvoiceBodyParam): Promise<FetchResponse<200, types.PostSaleTicketsConvertInvoiceResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
