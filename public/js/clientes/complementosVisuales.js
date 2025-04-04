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
    } else {
        rfcInput.disabled = true;
        rfcInput.value = '';

        // Limpiar y establecer solo "Sin Obligaciones Fiscales"
        regimenSelect.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '616';
        opt.text = 'Sin Obligaciones Fiscales';
        regimenSelect.add(opt);

    }
}

function loadRegimenOptions() {
    const rfcValue = rfcInput.value.trim();

    // Limpia las opciones actuales del select
    regimenSelect.innerHTML = '';

    if (rfcValue.length === 12) {
        // Opciones para RFC con 12 caracteres (Personas Morales)
        const opciones12 = [
            { value: '616', text: 'Régimen General de Ley Personas Morales' },
            { value: '616', text: 'Personas Morales con Fines no Lucrativos' },
            { value: '616', text: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras (AGAPES)' },
            { value: '624', text: 'Coordinados' },
            { value: '620', text: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
            { value: '620', text: 'Regimen simplificado de confianza (RESICO)' },
            { value: '616', text: 'Sin obligaciones fiscales' },
            { value: '623', text: 'Opcional para Grupos de Sociedades' }
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
            { value: '612', text: 'Personas Físicas con Actividades Empresariales y Profesionales' },
            { value: '621', text: 'Incorporación Fiscal' },
            { value: '606', text: 'Arrendamiento' },
            { value: '625', text: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
            { value: '605', text: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
            { value: '626', text: 'Regimen simplificado de confianza (RESICO)' },
            { value: '616', text: 'Sin obligaciones fiscales' },
            { value: '611', text: 'Ingresos por Dividendos (socios y accionistas)' },
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