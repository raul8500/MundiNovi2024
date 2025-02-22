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
     * Endpoint que permite consultar los productos o servicios registrados en la aplicación
     *
     * @summary Listado de items
     * @throws FetchError<400, types.GetItemsResponse400> Objeto que representa la respuesta cuando se sobrepasa el límite de productos a
     * retornar
     * @throws FetchError<404, types.GetItemsResponse404> 404 Not found
     */
    getItems(metadata?: types.GetItemsMetadataParam): Promise<FetchResponse<200, types.GetItemsResponse200>>;
    /**
     * Endpoint que permite crear un producto o servicio
     *
     * @summary Crear ítem
     * @throws FetchError<400, types.PostItemsResponse400> Bad request
     */
    postItems(body: types.PostItemsBodyParam): Promise<FetchResponse<200, types.PostItemsResponse200>>;
    /**
     * Endpoint que permite eliminar varios productos y/o servicios.
     *
     * @summary Eliminar ítem
     * @throws FetchError<400, types.DeleteItemsResponse400> Objeto que representa la respuesta al intentar eliminar varios productos y/o servicios
     */
    deleteItems(metadata?: types.DeleteItemsMetadataParam): Promise<FetchResponse<200, types.DeleteItemsResponse200>>;
    /**
     * Endpoint que permite consultar un producto o servicio registrado en la aplicación
     *
     * @summary Consultar un ítem
     * @throws FetchError<404, types.GetItemsIdResponse404> Objeto que representa la respuesta de un producto o servicio no encontrado
     */
    getItemsId(metadata: types.GetItemsIdMetadataParam): Promise<FetchResponse<200, types.GetItemsIdResponse200>>;
    /**
     * Endpoint que permite editar un producto o servicio registrado en la aplicación
     *
     * @summary Editar ítem
     */
    putItemsId(body: types.PutItemsIdBodyParam, metadata: types.PutItemsIdMetadataParam): Promise<FetchResponse<200, types.PutItemsIdResponse200>>;
    /**
     * Endpoint que permite eliminar un producto o servicio registrado en la aplicación
     *
     * @summary Eliminar ítem
     * @throws FetchError<400, types.DeleteItemsIdResponse400> Objeto que representa la respuesta al intentar eliminar un producto o servicio
     * @throws FetchError<404, types.DeleteItemsIdResponse404> Objeto que representa la respuesta al intentar eliminar un producto o servicio que no
     * existe
     */
    deleteItemsId(metadata: types.DeleteItemsIdMetadataParam): Promise<FetchResponse<200, types.DeleteItemsIdResponse200>>;
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
    postItemsIdAttachment(body: types.PostItemsIdAttachmentBodyParam, metadata: types.PostItemsIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostItemsIdAttachmentResponse200>>;
    /**
     * Endpoint que permite eliminar un archivo de un producto o servicio registrado en la
     * aplicación
     *
     * @summary Eliminar un adjunto de un ítem
     * @throws FetchError<400, types.DeleteItemsAttachmentIdattachmentResponse400> Objeto que representa la respuesta al intentar eliminar un archivo adjunto.
     */
    deleteItemsAttachmentIdattachment(metadata: types.DeleteItemsAttachmentIdattachmentMetadataParam): Promise<FetchResponse<200, types.DeleteItemsAttachmentIdattachmentResponse200>>;
    /**
     * Endpoint que permite consultar las bodegas registradas en la aplicación
     *
     * @summary Listado de bodegas
     */
    getWarehouses(metadata?: types.GetWarehousesMetadataParam): Promise<FetchResponse<200, types.GetWarehousesResponse200>>;
    /**
     * Endpoint que permite crear una bodega
     *
     * @summary Crear bodega
     */
    postWarehouses(body: types.PostWarehousesBodyParam): Promise<FetchResponse<200, types.PostWarehousesResponse200>>;
    /**
     * Endpoint que permite consultar una bodega registrada en la aplicación
     *
     * @summary Consultar bodega
     */
    getWarehousesId(metadata: types.GetWarehousesIdMetadataParam): Promise<FetchResponse<200, types.GetWarehousesIdResponse200>>;
    /**
     * Endpoint que permite editar una bodega
     *
     * @summary Editar bodega
     */
    putWarehousesId(body: types.PutWarehousesIdBodyParam, metadata: types.PutWarehousesIdMetadataParam): Promise<FetchResponse<200, types.PutWarehousesIdResponse200>>;
    putWarehousesId(metadata: types.PutWarehousesIdMetadataParam): Promise<FetchResponse<200, types.PutWarehousesIdResponse200>>;
    /**
     * Endpoint que permite eliminar una bodega registrada en la aplicación
     *
     * @summary Eliminar bodega
     */
    deleteWarehousesId(metadata: types.DeleteWarehousesIdMetadataParam): Promise<FetchResponse<200, types.DeleteWarehousesIdResponse200>>;
    /**
     * Endpoint que permite consultar las transferencias de bodegas registradas en la
     * aplicación
     *
     * @summary Listado de transferencias de bodegas
     */
    getWarehouseTransfers(metadata?: types.GetWarehouseTransfersMetadataParam): Promise<FetchResponse<200, types.GetWarehouseTransfersResponse200>>;
    /**
     * Endpoint que permite crear una transferencia de bodegas.
     *
     * @summary Crear transferencia de bodegas
     */
    postWarehouseTransfers(body: types.PostWarehouseTransfersBodyParam): Promise<FetchResponse<200, types.PostWarehouseTransfersResponse200>>;
    /**
     * Endpoint que permite consultar una transferencia de bodegas registrada en la aplicación
     *
     * @summary Consultar una transferencia de bodegas
     */
    getWarehouseTransfersId(metadata: types.GetWarehouseTransfersIdMetadataParam): Promise<FetchResponse<200, types.GetWarehouseTransfersIdResponse200>>;
    /**
     * Endpoint que permite editar una transferencia de bodegas
     *
     * @summary Editar transferencia de bodegas
     */
    putWarehouseTransfersId(body: types.PutWarehouseTransfersIdBodyParam, metadata: types.PutWarehouseTransfersIdMetadataParam): Promise<FetchResponse<200, types.PutWarehouseTransfersIdResponse200>>;
    /**
     * Endpoint que permite eliminar una transferencia de bodegas registrada en la aplicación
     *
     * @summary Eliminar transferencia de bodegas
     */
    deleteWarehouseTransfersId(metadata: types.DeleteWarehouseTransfersIdMetadataParam): Promise<FetchResponse<200, types.DeleteWarehouseTransfersIdResponse200>>;
    /**
     * Endpoint que permite consultar los ajustes de inventario registrados en la aplicación
     *
     * @summary Listado de ajustes de inventario
     */
    getInventoryAdjustments(metadata?: types.GetInventoryAdjustmentsMetadataParam): Promise<FetchResponse<200, types.GetInventoryAdjustmentsResponse200>>;
    /**
     * Endpoint que permite crear un ajuste de inventario.
     *
     * @summary Crear ajuste de inventario
     */
    postInventoryAdjustments(body: types.PostInventoryAdjustmentsBodyParam): Promise<FetchResponse<200, types.PostInventoryAdjustmentsResponse200>>;
    /**
     * Endpoint que permite consultar un ajuste de inventario registrado en la aplicación
     *
     * @summary Consultar ajuste de inventario
     */
    getInventoryAdjustmentsId(metadata: types.GetInventoryAdjustmentsIdMetadataParam): Promise<FetchResponse<200, types.GetInventoryAdjustmentsIdResponse200>>;
    /**
     * Endpoint que permite editar un ajuste de inventario
     *
     * @summary Editar ajuste de inventario
     */
    putInventoryAdjustmentsId(body: types.PutInventoryAdjustmentsIdBodyParam, metadata: types.PutInventoryAdjustmentsIdMetadataParam): Promise<FetchResponse<200, types.PutInventoryAdjustmentsIdResponse200>>;
    putInventoryAdjustmentsId(metadata: types.PutInventoryAdjustmentsIdMetadataParam): Promise<FetchResponse<200, types.PutInventoryAdjustmentsIdResponse200>>;
    /**
     * Endpoint que permite eliminar un ajuste de inventario
     *
     * @summary Eliminar ajuste de inventario
     */
    deleteInventoryAdjustmentsId(metadata: types.DeleteInventoryAdjustmentsIdMetadataParam): Promise<FetchResponse<200, types.DeleteInventoryAdjustmentsIdResponse200>>;
    /**
     * Endpoint que permite listar las numeraciones de ajuste de inventario.
     *
     * @summary Listar numeraciones de ajustes de inventario
     */
    getInventoryAdjustmentsNumerations(metadata?: types.GetInventoryAdjustmentsNumerationsMetadataParam): Promise<FetchResponse<200, types.GetInventoryAdjustmentsNumerationsResponse200>>;
    /**
     * Endpoint que permite crear una numeración de ajuste de inventario.
     *
     * @summary Crear numeración de ajuste de inventario
     */
    postInventoryAdjustmentsNumerations(body: types.PostInventoryAdjustmentsNumerationsBodyParam): Promise<FetchResponse<200, types.PostInventoryAdjustmentsNumerationsResponse200>>;
    /**
     * Endpoint que permite consultar una numeración de ajuste de inventario
     *
     * @summary Consultar una numeración de ajuste de inventario
     */
    getInventoryAdjustmentsNumerationsId(metadata: types.GetInventoryAdjustmentsNumerationsIdMetadataParam): Promise<FetchResponse<200, types.GetInventoryAdjustmentsNumerationsIdResponse200>>;
    /**
     * Endpoint que permite editar una numeración de ajuste de inventario
     *
     * @summary Editar numeración de ajuste de inventario
     */
    putInventoryAdjustmentsNumerationsId(body: types.PutInventoryAdjustmentsNumerationsIdBodyParam, metadata: types.PutInventoryAdjustmentsNumerationsIdMetadataParam): Promise<FetchResponse<200, types.PutInventoryAdjustmentsNumerationsIdResponse200>>;
    putInventoryAdjustmentsNumerationsId(metadata: types.PutInventoryAdjustmentsNumerationsIdMetadataParam): Promise<FetchResponse<200, types.PutInventoryAdjustmentsNumerationsIdResponse200>>;
    /**
     * Endpoint que permite eliminar una numeración de ajuste de inventario
     *
     * @summary Eliminar numeración de ajuste de inventario
     */
    deleteInventoryAdjustmentsNumerationsId(metadata: types.DeleteInventoryAdjustmentsNumerationsIdMetadataParam): Promise<FetchResponse<200, types.DeleteInventoryAdjustmentsNumerationsIdResponse200>>;
    /**
     * Endpoint que permite consultar las listas de precios registradas en la aplicación
     *
     * @summary Listar listas de precios
     */
    getPriceLists(metadata?: types.GetPriceListsMetadataParam): Promise<FetchResponse<200, types.GetPriceListsResponse200>>;
    /**
     * Endpoint que permite crear una lista de precios
     *
     * @summary Crear lista de precio
     */
    postPriceLists(body: types.PostPriceListsBodyParam): Promise<FetchResponse<200, types.PostPriceListsResponse200>>;
    /**
     * Endpoint que permite consultar una lista de precios registrada en la aplicación
     *
     * @summary Consultar lista de precio
     */
    getPriceListsId(metadata: types.GetPriceListsIdMetadataParam): Promise<FetchResponse<200, types.GetPriceListsIdResponse200>>;
    /**
     * Endpoint que permite editar una lista de precios
     *
     * @summary Editar lista de precio
     */
    putPriceListsId(body: types.PutPriceListsIdBodyParam, metadata: types.PutPriceListsIdMetadataParam): Promise<FetchResponse<200, types.PutPriceListsIdResponse200>>;
    putPriceListsId(metadata: types.PutPriceListsIdMetadataParam): Promise<FetchResponse<200, types.PutPriceListsIdResponse200>>;
    /**
     * Endpoint que permite eliminar una lista de precios registrada en la aplicación
     *
     * @summary Eliminar lista de precio
     */
    deletePriceListsId(metadata: types.DeletePriceListsIdMetadataParam): Promise<FetchResponse<200, types.DeletePriceListsIdResponse200>>;
    /**
     * Endpoint que permite consultar los campos adicionales registrados en la aplicación.
     *
     * @summary Listar campos adicionales
     * @throws FetchError<400, types.GetCustomFieldsResponse400> Objeto que representa la respuesta al intentar consultar la lista de campos adicionales
     */
    getCustomFields(metadata?: types.GetCustomFieldsMetadataParam): Promise<FetchResponse<200, types.GetCustomFieldsResponse200>>;
    /**
     * Endpoint que permite crear un campo adicional.
     *
     * @summary Crear campo adicional
     */
    postCustomFields(body: types.PostCustomFieldsBodyParam): Promise<FetchResponse<200, types.PostCustomFieldsResponse200>>;
    /**
     * Endpoint que permite consultar un campo adicional registrado en la aplicación
     *
     * @summary Consultar campo adicional
     * @throws FetchError<404, types.GetCustomFieldsIdResponse404> Objeto que representa la respuesta al intentar consultar un campo adicional.
     */
    getCustomFieldsId(metadata: types.GetCustomFieldsIdMetadataParam): Promise<FetchResponse<200, types.GetCustomFieldsIdResponse200>>;
    /**
     * Endpoint que permite editar un campo adicional
     *
     * @summary Editar campo adicional
     */
    putCustomFieldsId(body: types.PutCustomFieldsIdBodyParam, metadata: types.PutCustomFieldsIdMetadataParam): Promise<FetchResponse<200, types.PutCustomFieldsIdResponse200>>;
    putCustomFieldsId(metadata: types.PutCustomFieldsIdMetadataParam): Promise<FetchResponse<200, types.PutCustomFieldsIdResponse200>>;
    /**
     * Endpoint que permite eliminar un campo adicional registrado en la aplicación
     *
     * @summary Eliminar campo adicional
     */
    deleteCustomFieldsId(metadata: types.DeleteCustomFieldsIdMetadataParam): Promise<FetchResponse<200, types.DeleteCustomFieldsIdResponse200>>;
    /**
     * Endpoint que permite consultar las variantes registradas en la aplicación.
     *
     * @summary Listado de atributos variantes
     */
    getVariantAttributes(metadata?: types.GetVariantAttributesMetadataParam): Promise<FetchResponse<200, types.GetVariantAttributesResponse200>>;
    /**
     * Endpoint que permite crear una variante.
     *
     * @summary Crear atributos variante
     */
    postVariantAttributes(body: types.PostVariantAttributesBodyParam): Promise<FetchResponse<200, types.PostVariantAttributesResponse200>>;
    /**
     * Endpoint que permite consultar una variante registrada en la aplicación
     *
     * @summary Consultar atributos variante
     * @throws FetchError<404, types.GetVariantAttributesIdResponse404> Objeto que representa la respuesta al intentar consultar una variante no existente.
     */
    getVariantAttributesId(metadata: types.GetVariantAttributesIdMetadataParam): Promise<FetchResponse<200, types.GetVariantAttributesIdResponse200>>;
    /**
     * Endpoint que permite editar una variante
     *
     * @summary Editar atributos variante
     * @throws FetchError<400, types.PutVariantAttributesIdResponse400> Objeto que representa la respuesta al intentar editar una variante.
     */
    putVariantAttributesId(body: types.PutVariantAttributesIdBodyParam, metadata: types.PutVariantAttributesIdMetadataParam): Promise<FetchResponse<200, types.PutVariantAttributesIdResponse200>>;
    putVariantAttributesId(metadata: types.PutVariantAttributesIdMetadataParam): Promise<FetchResponse<200, types.PutVariantAttributesIdResponse200>>;
    /**
     * Endpoint que permite eliminar una variante registrada en la aplicación
     *
     * @summary Eliminar atributos variante
     * @throws FetchError<400, types.DeleteVariantAttributesIdResponse400> Objeto que representa la respuesta al intentar eliminar una variante.
     */
    deleteVariantAttributesId(metadata: types.DeleteVariantAttributesIdMetadataParam): Promise<FetchResponse<200, types.DeleteVariantAttributesIdResponse200>>;
    /**
     * Endpoint que permite consultar las categorías de ítems registradas en la aplicación
     *
     * @summary Listado de categoría de items
     */
    getItemCategories(metadata?: types.GetItemCategoriesMetadataParam): Promise<FetchResponse<200, types.GetItemCategoriesResponse200>>;
    /**
     * Endpoint que permite crear una categoría de ítems.
     *
     * @summary Crear categoría de item
     */
    postItemCategories(body: types.PostItemCategoriesBodyParam): Promise<FetchResponse<200, types.PostItemCategoriesResponse200>>;
    /**
     * Endpoint que permite consultar una categoría de ítems registrada en la aplicación
     *
     * @summary Consultar categoría de item
     */
    getItemCategoriesId(metadata: types.GetItemCategoriesIdMetadataParam): Promise<FetchResponse<200, types.GetItemCategoriesIdResponse200>>;
    /**
     * Endpoint que permite editar una categoría de ítems
     *
     * @summary Editar categoría de item
     */
    putItemCategoriesId(body: types.PutItemCategoriesIdBodyParam, metadata: types.PutItemCategoriesIdMetadataParam): Promise<FetchResponse<200, types.PutItemCategoriesIdResponse200>>;
    putItemCategoriesId(metadata: types.PutItemCategoriesIdMetadataParam): Promise<FetchResponse<200, types.PutItemCategoriesIdResponse200>>;
    /**
     * Endpoint que permite eliminar una categoría de item registrada en la aplicación
     *
     * @summary Eliminar categoría de item
     */
    deleteItemCategoriesId(metadata: types.DeleteItemCategoriesIdMetadataParam): Promise<FetchResponse<200, types.DeleteItemCategoriesIdResponse200>>;
    /**
     * Endpoint que permite adjuntar un archivo a una categoría de items registrado en la
     * aplicación. Para adjuntar una imagen o un archivo a una categoría de items se debe
     * enviar un request en el cual se debe especificar el header Content-Type como
     * multipart/form-data. Para adjuntar un archivo a una categoría de items el contenido del
     * archivo debe enviarse en el atributo file. Si se desea asociar la imagen de un categoría
     * de items a éste se debe enviar la información en el atributo image. Se debe tener en
     * cuenta que solo se puede enviar un archivo o imagen por request. El tamaño máximo
     * permitido para ésta es 2MB. Si la operación fue exitosa se retorna una URL para acceder
     * al archivo/imagen asociada. Esta URL tiene vencimiento de 30 minutos; después de este
     * período se debe consultar el ítem para obtener una nueva URL válida.
     *
     * @summary Adjuntar archivo a una categoría de items
     */
    postItemCategoriesIdAttachment(body: types.PostItemCategoriesIdAttachmentBodyParam, metadata: types.PostItemCategoriesIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostItemCategoriesIdAttachmentResponse200>>;
    postItemCategoriesIdAttachment(metadata: types.PostItemCategoriesIdAttachmentMetadataParam): Promise<FetchResponse<200, types.PostItemCategoriesIdAttachmentResponse200>>;
    /**
     * Endpoint que permite eliminar un archivo de una Categoría de ítems registrada en la
     * aplicación
     *
     * @summary Eliminar un archivo adjunto de una categoría de items
     * @throws FetchError<400, types.DeleteItemCategoriesAttachmentIdattachmentResponse400> Objeto que representa la respuesta al intentar eliminar un archivo adjunto.
     */
    deleteItemCategoriesAttachmentIdattachment(metadata: types.DeleteItemCategoriesAttachmentIdattachmentMetadataParam): Promise<FetchResponse<200, types.DeleteItemCategoriesAttachmentIdattachmentResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
