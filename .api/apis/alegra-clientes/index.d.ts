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
     * Endpoint que permite consultar los contactos registrados en la aplicación
     *
     * @summary Listado de contactos
     * @throws FetchError<400, types.ListContactsResponse400> Límite sobrepasa valor permitido
     */
    listContacts(metadata?: types.ListContactsMetadataParam): Promise<FetchResponse<200, types.ListContactsResponse200>>;
    /**
     * Endpoint que permite crear un contacto en la aplicación
     *
     * @summary Crear un contacto
     * @throws FetchError<400, types.PostContactsResponse400> Request incorrecto
     */
    postContacts(body: types.PostContactsBodyParam): Promise<FetchResponse<200, types.PostContactsResponse200>>;
    /**
     * Endpoint que permite eliminar varios contactos en la aplicación Se debe tener en cuenta
     * que un contacto que tenga documentos (facturas de venta, notas crédito, facturas de
     * compra, etc) no puede ser eliminado.
     *
     *
     * @summary Eliminar varios contactos
     * @throws FetchError<400, types.DeleteMultipleContactsResponse400> Error eliminar varios contactos
     */
    deleteMultipleContacts(metadata: types.DeleteMultipleContactsMetadataParam): Promise<FetchResponse<200, types.DeleteMultipleContactsResponse200>>;
    /**
     * Endpoint que permite consultar un contacto registrado en la aplicación
     *
     * @summary Obtener detalle de un contacto
     * @throws FetchError<404, types.ContactsDetailsResponse404> Error contacto no encontrado
     */
    contactsDetails(metadata: types.ContactsDetailsMetadataParam): Promise<FetchResponse<201, types.ContactsDetailsResponse201>>;
    /**
     * Endpoint que permite editar un contacto en la aplicación
     *
     * @summary Editar contacto
     * @throws FetchError<400, types.EditContactResponse400> Request incorrecto
     * @throws FetchError<404, types.EditContactResponse404> Error contacto no encontrado
     */
    editContact(body: types.EditContactBodyParam, metadata: types.EditContactMetadataParam): Promise<FetchResponse<201, types.EditContactResponse201>>;
    /**
     * Endpoint que permite eliminar un contacto en la aplicación
     *
     * @summary Eliminar contacto
     * @throws FetchError<400, types.DeleteContactResponse400> Contacto con documentos recurrentes asociados
     * @throws FetchError<404, types.DeleteContactResponse404> Error contacto no encontrado
     */
    deleteContact(metadata: types.DeleteContactMetadataParam): Promise<FetchResponse<200, types.DeleteContactResponse200>>;
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
    contactsAttachment(body: types.ContactsAttachmentBodyParam, metadata: types.ContactsAttachmentMetadataParam): Promise<FetchResponse<200, types.ContactsAttachmentResponse200>>;
    /**
     * Endpoint que permite eliminar archivos a un contacto en la aplicación
     *
     *
     * @summary Eliminar archivos adjuntos
     * @throws FetchError<404, types.DeleteAttachmentContactResponse404> Archivo no encontrado
     */
    deleteAttachmentContact(metadata: types.DeleteAttachmentContactMetadataParam): Promise<FetchResponse<200, types.DeleteAttachmentContactResponse200>>;
    /**
     * Endpoint que permite restaurar un contacto en la aplicación
     *
     * @summary Restaurar contacto
     * @throws FetchError<404, types.RestoreContactResponse404> Error contacto no encontrado
     */
    restoreContact(metadata: types.RestoreContactMetadataParam): Promise<FetchResponse<200, types.RestoreContactResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
