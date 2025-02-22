//Cargar regimenes
const facturaSi = document.getElementById('factura_si');
const facturaNo = document.getElementById('factura_no');
const rfcInput = document.getElementById('rfc');
const regimenSelect = document.getElementById('regimen');
const rfcClienteLabel = document.querySelector('label[for="rfc"]');
const nombreClienteLabel = document.querySelector('label[for="nombreCliente"]');
const telefonoPrincipalLabel = document.querySelector('label[for="telefonoPrincipal"]');
const correoElectronicoPersonalLabel = document.querySelector('label[for="correoElectronicoPersonal"]');
const correoElectronicoContactoLabel = document.querySelector('label[for="correoElectronicoContacto"]');
const calleLabel = document.querySelector('label[for="calle"]');
const numeroExteriorLabel = document.querySelector('label[for="numeroExterior"]');
const numeroInteriorLabel = document.querySelector('label[for="numeroInterior"]');
const coloniaLabel = document.querySelector('label[for="colonia"]');
const localidadLabel = document.querySelector('label[for="localidad"]');
const municipioDelegacionLabel = document.querySelector('label[for="municipioDelegacion"]');
const estadoLabel = document.querySelector('label[for="estado"]');
const codigoPostalLabel = document.querySelector('label[for="codigoPostal"]');

function handleFacturaChange() {
    if (facturaSi.checked) {
        rfcInput.disabled = false;
        rfcInput.value = '';
        loadRegimenOptions(); // Cargar opciones según el RFC

        // Añadir asteriscos rojos a los campos
        addAsterisks(true);
    } else {
        rfcInput.disabled = true;
        rfcInput.value = '';

        // Limpiar y establecer solo "Sin Obligaciones Fiscales"
        regimenSelect.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = 'NO_REGIME';
        opt.text = 'Sin Obligaciones Fiscales';
        regimenSelect.add(opt);

        // Añadir asteriscos rojos solo a Nombre y Código Postal
        addAsterisks(false);
        nombreClienteLabel.innerHTML = 'Nombre: <span style="color: red; font-weight: bold;">*</span>';
        codigoPostalLabel.innerHTML = 'Código postal: <span style="color: red; font-weight: bold;">*</span>';
    }
}

function loadRegimenOptions() {
    const rfcValue = rfcInput.value.trim();

    // Limpia las opciones actuales del select
    regimenSelect.innerHTML = '';

    if (rfcValue.length === 12) {
        // Opciones para RFC con 12 caracteres (Personas Morales)
        const opciones12 = [
            { value: 'NO_REGIME', text: 'Sin régimen' },
            { value: 'GENERAL_REGIME_OF_MORAL_PEOPLE_LAW', text: 'Régimen General de Ley Personas Morales' },
            { value: 'REGIME_OF_MORAL_PEOPLE_NOT_PROFIT', text: 'Personas Morales con Fines no Lucrativos' },
            { value: 'PRIMARY_SECTOR_REGIME', text: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras (AGAPES)' },
            { value: 'REGIME_OF_THE_COORDINATED', text: 'Coordinados' },
            { value: 'REGIME_OF_COOPERATIVE_PRODUCTION_SOCIETIES', text: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
            { value: 'REGIME_OF_TRUST', text: 'Regimen simplificado de confianza (RESICO)' },
            { value: 'SIMPLIFIED_REGIME', text: 'Sin obligaciones fiscales' },
            { value: 'SOCIETIES_OPTIONAL_REGIME', text: 'Opcional para Grupos de Sociedades' }
        ];

        opciones12.forEach(opcion => {
            const opt = document.createElement('option');
            opt.value = opcion.value;
            opt.text = opcion.text;
            regimenSelect.add(opt);
        });
    } else if (rfcValue.length === 13) {
        // Opciones para RFC con 13 caracteres (Personas Físicas)
        const opciones13 = [
            { value: 'NO_REGIME', text: 'Sin régimen' },
            { value: 'BUSINESS_ACTIVITIES_REGIME', text: 'Personas Físicas con Actividades Empresariales y Profesionales' },
            { value: 'FISCAL_INCORPORATION_REGIME', text: 'Incorporación Fiscal' },
            { value: 'LEASEHOLD_REGIME', text: 'Arrendamiento' },
            { value: 'REGIME_OF_THE_TECHNOLOGICAL_PLATFORMS_INCOME_ACTIVITIES', text: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
            { value: 'SALARIED_REGIME', text: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
            { value: 'REGIME_OF_TRUST', text: 'Regimen simplificado de confianza (RESICO)' },
            { value: 'SIMPLIFIED_REGIME', text: 'Sin obligaciones fiscales' },
            { value: 'DIVIDEND_INCOME', text: 'Ingresos por Dividendos (socios y accionistas)' },
        ];

        opciones13.forEach(opcion => {
            const opt = document.createElement('option');
            opt.value = opcion.value;
            opt.text = opcion.text;
            regimenSelect.add(opt);
        });
    }
}

function addAsterisks(isRequired) {
    const fields = [
        rfcClienteLabel,
        nombreClienteLabel,
        telefonoPrincipalLabel,
        correoElectronicoContactoLabel,
        calleLabel,
        numeroExteriorLabel,
        numeroInteriorLabel,
        coloniaLabel,
        localidadLabel,
        municipioDelegacionLabel,
        estadoLabel,
        codigoPostalLabel
    ];

    fields.forEach(label => {
        if (isRequired) {
            if (!label.querySelector('span')) {
                label.innerHTML += ' <span style="color: red; font-weight: bold;">*</span>';
            }
        } else {
            const asterisk = label.querySelector('span');
            if (asterisk) {
                label.removeChild(asterisk);
            }
        }
    });
}

facturaSi.addEventListener('change', handleFacturaChange);
facturaNo.addEventListener('change', handleFacturaChange);
rfcInput.addEventListener('input', loadRegimenOptions);

// Inicializar con "No" seleccionado
handleFacturaChange();