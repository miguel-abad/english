/* =====================================================
   VARIABLES
===================================================== */

let todasLasFichas = [];

let fichasFiltradas = [];

let indiceActual = 0;


/* =====================================================
   ELEMENTOS HTML
===================================================== */

const galeria =
    document.getElementById("galeria");

const contador =
    document.getElementById("contador");

const sinResultados =
    document.getElementById("sinResultados");

const filtroGrado =
    document.getElementById("filtroGrado");

const buscar =
    document.getElementById("buscar");


const visor =
    document.getElementById("visor");

const imagenGrande =
    document.getElementById("imagenGrande");

const nombreImagen =
    document.getElementById("nombreImagen");


/* =====================================================
   CARGAR JSON
===================================================== */

async function cargarFichas() {

    try {

        const respuesta =
            await fetch(
                "fichas.json?nocache=" +
                Date.now()
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar fichas.json"
            );

        }


        todasLasFichas =
            await respuesta.json();


        mostrarGaleria();

    }

    catch (error) {

        console.error(error);

        contador.innerHTML =
            "❌ No se pudo cargar el catálogo de fichas.";

    }

}


/* =====================================================
   MOSTRAR GALERÍA
===================================================== */

function mostrarGaleria() {

    const gradoSeleccionado =
        filtroGrado.value;


    const textoBusqueda =
        buscar.value
            .trim()
            .toLowerCase();


    fichasFiltradas =
        todasLasFichas.filter(
            ficha => {

                /* FILTRO GRADO */

                const coincideGrado =
                    gradoSeleccionado === "todos" ||
                    ficha.grado === gradoSeleccionado;


                /* FILTRO BUSCADOR */

                const coincideBusqueda =
                    textoBusqueda === "" ||

                    ficha.nombre
                        .toLowerCase()
                        .includes(textoBusqueda);


                return (
                    coincideGrado &&
                    coincideBusqueda
                );

            }
        );


    /* LIMPIAR */

    galeria.innerHTML = "";


    /* SIN RESULTADOS */

    if (
        fichasFiltradas.length === 0
    ) {

        contador.textContent =
            "0 fichas encontradas.";

        sinResultados.style.display =
            "block";

        return;

    }


    sinResultados.style.display =
        "none";


    contador.textContent =
        `${fichasFiltradas.length} ficha(s) encontrada(s).`;


    /* CREAR TARJETAS */

    fichasFiltradas.forEach(
        (ficha, indice) => {

            const tarjeta =
                document.createElement("article");


            tarjeta.className =
                "tarjeta";


            tarjeta.innerHTML = `

                <img
                    src="${ficha.ruta}"
                    alt="${ficha.nombre}"
                    loading="lazy"
                >

                <div class="info">

                    <span class="grado">
                        ${ficha.grado.toUpperCase()}
                    </span>

                    <span class="nombre">
                        ${ficha.nombre}
                    </span>

                </div>

            `;


            tarjeta.addEventListener(
                "click",
                () => abrirVisor(indice)
            );


            galeria.appendChild(
                tarjeta
            );

        }
    );

}


/* =====================================================
   ABRIR VISOR
===================================================== */

function abrirVisor(indice) {

    indiceActual = indice;

    actualizarImagen();

    visor.classList.add("activo");

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   ACTUALIZAR IMAGEN
===================================================== */

function actualizarImagen() {

    const ficha =
        fichasFiltradas[indiceActual];


    if (!ficha) {

        return;

    }


    imagenGrande.src =
        ficha.ruta;


    imagenGrande.alt =
        ficha.nombre;


    nombreImagen.textContent =
        `${ficha.grado.toUpperCase()} — ${ficha.nombre}`;

}


/* =====================================================
   CERRAR VISOR
===================================================== */

function cerrarVisor() {

    visor.classList.remove("activo");

    document.body.style.overflow =
        "";

    imagenGrande.src = "";

}


/* =====================================================
   SIGUIENTE
===================================================== */

function siguienteImagen() {

    if (
        fichasFiltradas.length === 0
    ) {

        return;

    }


    indiceActual++;


    if (
        indiceActual >=
        fichasFiltradas.length
    ) {

        indiceActual = 0;

    }


    actualizarImagen();

}


/* =====================================================
   ANTERIOR
===================================================== */

function anteriorImagen() {

    if (
        fichasFiltradas.length === 0
    ) {

        return;

    }


    indiceActual--;


    if (indiceActual < 0) {

        indiceActual =
            fichasFiltradas.length - 1;

    }


    actualizarImagen();

}


/* =====================================================
   EVENTOS
===================================================== */

filtroGrado.addEventListener(
    "change",
    mostrarGaleria
);


buscar.addEventListener(
    "input",
    mostrarGaleria
);


document
    .getElementById("cerrarVisor")
    .addEventListener(
        "click",
        cerrarVisor
    );


document
    .getElementById("siguiente")
    .addEventListener(
        "click",
        siguienteImagen
    );


document
    .getElementById("anterior")
    .addEventListener(
        "click",
        anteriorImagen
    );


/* Cerrar haciendo clic fuera de la imagen */

visor.addEventListener(
    "click",
    function(event) {

        if (
            event.target === visor
        ) {

            cerrarVisor();

        }

    }
);


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !visor.classList.contains(
                "activo"
            )
        ) {

            return;

        }


        if (
            event.key === "Escape"
        ) {

            cerrarVisor();

        }


        if (
            event.key === "ArrowRight"
        ) {

            siguienteImagen();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            anteriorImagen();

        }

    }
);


/* =====================================================
   INICIAR
===================================================== */

cargarFichas();