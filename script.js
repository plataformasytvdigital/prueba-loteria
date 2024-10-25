document.addEventListener("DOMContentLoaded", () => {
    mostrarFechaActual();
    generarNumeros();
    cargarDatos(); // Cargar datos del localStorage

    document.getElementById('reiniciar').onclick = reiniciarSorteo;
    document.getElementById('guardar').onclick = guardarUsuario;
    document.getElementById('debe').onclick = () => cambiarEstado('debe');
    document.getElementById('pago').onclick = () => cambiarEstado('pago');
    document.getElementById('borrar').onclick = borrarUsuario;
});

let usuarios = {};
let numeroSeleccionado = null;

function mostrarFechaActual() {
    const fecha = new Date();
    document.getElementById('fecha').innerText = `Fecha actual: ${fecha.toLocaleString()}`;
}

function generarNumeros() {
    const container = document.getElementById('numeros-container');
    for (let i = 0; i < 100; i++) {
        const numeroDiv = document.createElement('div');
        numeroDiv.className = 'col-1 numeros libre';
        numeroDiv.innerText = i.toString().padStart(2, '0');
        numeroDiv.onclick = () => seleccionarNumero(i);
        container.appendChild(numeroDiv);
    }
}

function cargarDatos() {
    const datosGuardados = JSON.parse(localStorage.getItem('loteriaDatos'));
    if (datosGuardados) {
        usuarios = datosGuardados.usuarios || {};
        marcarNumeros();
        actualizarTablaUsuarios();
    }
}

function seleccionarNumero(numero) {
    numeroSeleccionado = numero;
    document.getElementById('nombre-participante').value = usuarios[numero]?.nombre || '';
    document.getElementById('celular-participante').value = usuarios[numero]?.celular || '';
    document.getElementById('acciones').style.display = 'block';

    // Resaltar el número seleccionado
    const numerosDiv = document.getElementsByClassName('numeros');
    for (let i = 0; i < numerosDiv.length; i++) {
        numerosDiv[i].classList.remove('selected');
    }
    numerosDiv[numero].classList.add('selected');
}

function guardarUsuario() {
    const nombre = document.getElementById('nombre-participante').value.trim();
    const celular = document.getElementById('celular-participante').value.trim();
    if (nombre && celular && numeroSeleccionado !== null) {
        usuarios[numeroSeleccionado] = { nombre, celular, estado: 'libre' };
        guardarDatos(); // Guardar datos en localStorage
        actualizarTablaUsuarios();
        marcarNumero(numeroSeleccionado);
    } else {
        alert("Por favor, ingrese su nombre y celular.");
    }
}

function cambiarEstado(nuevoEstado) {
    if (numeroSeleccionado !== null) {
        if (usuarios[numeroSeleccionado]) {
            usuarios[numeroSeleccionado].estado = nuevoEstado;
            guardarDatos(); // Guardar datos en localStorage
        }
        actualizarTablaUsuarios();
        marcarNumero(numeroSeleccionado);
    }
}

function borrarUsuario() {
    if (numeroSeleccionado !== null) {
        delete usuarios[numeroSeleccionado];
        guardarDatos(); // Guardar datos en localStorage
        actualizarTablaUsuarios();
        marcarNumero(numeroSeleccionado);
        numeroSeleccionado = null;
        document.getElementById('acciones').style.display = 'none';
    }
}

function actualizarTablaUsuarios() {
    const lista = document.getElementById('usuarios-lista');
    lista.innerHTML = '';

    for (let num in usuarios) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="numeros ${usuarios[num].estado}" onclick="seleccionarNumero(${num})">${num.toString().padStart(2, '0')}</td>
            <td>${usuarios[num].nombre}</td>
            <td><a href="https://wa.me/${usuarios[num].celular}" class="text-decoration-none text-light">${usuarios[num].celular}</a></td>
            <td class="${usuarios[num].estado}">${usuarios[num].estado}</td>
        `;
        lista.appendChild(tr);
    }
}

function marcarNumeros() {
    const numerosDiv = document.getElementsByClassName('numeros');
    for (let i = 0; i < numerosDiv.length; i++) {
        numerosDiv[i].classList.remove('libre', 'debe', 'pago', 'selected');
        if (usuarios[i]) {
            numerosDiv[i].classList.add(usuarios[i].estado);
        } else {
            numerosDiv[i].classList.add('libre');
        }
    }
}

function guardarDatos() {
    localStorage.setItem('loteriaDatos', JSON.stringify({ usuarios }));
}

function reiniciarSorteo() {
    usuarios = {};
    numeroSeleccionado = null;
    guardarDatos(); // Limpiar localStorage
    actualizarTablaUsuarios();
    const numerosDiv = document.getElementsByClassName('numeros');
    for (let i = 0; i < numerosDiv.length; i++) {
        numerosDiv[i].className = 'col-1 numeros libre';
    }
    document.getElementById('acciones').style.display = 'none';
}
