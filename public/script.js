let usuarios1 = document.getElementById("usuarios1")
let usuarios2 = document.getElementById("usuarios2")
let formTransferencia = document.getElementById("transferencia")
let formSaldo = document.getElementById("formSaldo")
let saldoUsuario = document.getElementById("saldoUsuario")
let rutSaldo = document.getElementById("rutSaldo")


document.addEventListener('DOMContentLoaded', async ()=> {
    try {
        
        let response = await fetch("/api/datos")
        let datos = await response.json()
        datos.map((dato) =>{
            usuarios1.innerHTML += `<option value=${dato.rut}>${dato.nombre} ${dato.apellido}</option>`
            usuarios2.innerHTML += `<option value=${dato.rut}>${dato.nombre} ${dato.apellido}</option>`
            
        })
    } catch (error) {
        console.log("hubo un error")
    }
});

formTransferencia.addEventListener("submit", async(e) =>{
    try {
        e.preventDefault()
        let monto = document.getElementById("monto").value;
        let rutOrigen = document.getElementById("usuarios1").value;
        let rutDestino = document.getElementById("usuarios2").value;
        let alerta = document.getElementById("alerta")

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "rutOrigen": rutOrigen,
            "rutDestino": rutDestino,
            "monto": monto
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        let response = await fetch("http://localhost:3000/api/transferencias", requestOptions)
        mostrarAlerta("Transferencia Realizada Con Éxito", "success")

    } catch (error) {
        mostrarAlerta("Hubo Un Problema Con Al Realizar La Transferencia", "danger")
    }
    
})



formSaldo.addEventListener("submit", async(e)=>{

    try {
        e.preventDefault()
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify({
            "rut": rutSaldo.value
        });
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        let response = await fetch("/api/saldo", requestOptions)
        let datos = await response.json()
        console.log(datos)

        saldoUsuario.innerHTML = ""

        saldoUsuario.innerHTML += `
            <h4>Nombre Cliente: ${datos.nombre} ${datos.apellido}</h4>
            <p>Rut Cliente: ${datos.rut} </p>
            <p>Saldo Disponible: ${datos.saldo}</p>

        `
    } catch (error) {
        mostrarAlerta("Hubo Un Problema Con Al Realizar La Solicitud", "danger")
    }
    
})


function mostrarAlerta(mensaje, tipo) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('hide');
        setTimeout(() => alert.remove(), 1000);
    }, 5000);
}