getUserInfo();
function showToast(message, isSuccess) {
    const toastElement = document.getElementById('toastMessage');
    const toastHeader = toastElement.querySelector('.toast-header');
    const toastBody = document.getElementById('toastBody');
    
    // Limpia las clases anteriores en el toast
    toastElement.classList.remove('bg-success', 'bg-primary');
    toastHeader.classList.remove('bg-success', 'bg-primary');

    // Cambia el color del toast dependiendo del éxito
    if (isSuccess) {
        toastElement.classList.add('bg-success'); // Verde para éxito
        toastHeader.classList.add('bg-success');
    } else {
        toastElement.classList.add('bg-primary'); // Azul para no hay cortes
        toastHeader.classList.add('bg-primary');
    }

    // Establece el mensaje en el cuerpo del toast
    toastBody.textContent = message;

    // Inicializa el toast de Bootstrap con duración de 10 segundos
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
    toast.show();
}

function getUserInfo() {
    fetch('/api/verifySesion')
        .then(response => response.json())
        .then(data => {
            let userInfo = data;
            getCortesFinales(userInfo);
        })
        .catch(error => console.log(error));
}

function getCortesFinales(userInfo) {
    fetch('/api/cortesFinalesUser/' + userInfo._id)
        .then(response => response.json())
        .then(data => {
            
            // Muestra el toast dependiendo del éxito
            if (data.success === false) {
                showToast('No hay cortes abiertos', false); // Azul
            } else {
                showToast('Corte de venta abierto', true); // Verde
                showCorteFields(data.data)
            }
        })
        .catch(error => {
            console.log(error);
            showToast('Error al buscar cortes', false); // Azul
        });
}

function showCorteFields(data){
    document.getElementById('pagoTarjetas').value = data.total_tarjetas
    document.getElementById('pagoTransferencia').value = data.monto_transferencias
    document.getElementById('pagoDocCobrar').value = data.monto_doc_cobrar
}
