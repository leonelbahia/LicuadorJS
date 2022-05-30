class Licuadora {
    constructor (id, nombre, marca, modelo, estado, mensaje, yo){
        this.id = id; //0
        this.nombre = nombre; //1
        this.marca = marca; //2
        this.modelo = modelo; //3
        this.estado = estado; //4
        this.mensaje = mensaje; //5
        this.yo = yo; //5
    }

    mostrarInfo(){
        let imgLicuadora;
        if (this.estado == "Encendida") {
            imgLicuadora = `<div id="Lic-${this.id}" class="licuadora activa"><div id="${this.id}-${this.nombre}-${this.yo}" class="licuadora-boton"></div></div>`;
        } else {
            imgLicuadora = `<div id="Lic-${this.id}" class="licuadora"><div id="${this.id}-${this.nombre}-${this.yo}" class="licuadora-boton"></div></div>`;
        }
        let licuadoras = `<div class = "licCSS">${imgLicuadora}<h3 class="titulo nombre">${this.nombre}</h3><h3 class="titulo">${this.marca} - ${this.modelo}</h3><h3 class="titulo mensaje">${this.mensaje}</h3></div>`;
         document.getElementById("contenedor").innerHTML +=licuadoras;
    }
}


class MostrarHtml {

    constructor (sesionNombre, sesionMarca, sesionModelo, licuadorasLocales = new Array(), licuadorasInstanciadas = new Array()){
        this.sesionNombre = sesionNombre;
        this.sesionMarca = sesionMarca;
        this.sesionModelo = sesionModelo;
        this.licuadorasLocales = licuadorasLocales;
        this.licuadorasInstanciadas = licuadorasInstanciadas;
    }

    ingresarDatos(){
        while(true) { var valor = prompt('Ingresá tu NOMBRE:'); if (valor === '' || valor === null){ alert("No puede quedar vacío"); } else { this.sesionNombre = valor; break; } }
        this.sesionMarca =  prompt("Ingresá la MARCA de tu Licuadora:");
        this.sesionModelo =  prompt("Ingresá el MODELO:");       
        const cargaInicialdeLicuadoras = async () => {   
            try { 
                const consulta = await fetch(`https://mikao.ar/api/Licuadoras/?no=${this.sesionNombre}&ma=${this.sesionMarca}&mo=${this.sesionModelo}`);
                if(consulta.status ===200){ console.log("Sesion iniciada");
                } else {console.log("BatiError 1 desconocido");}
            } catch (error) {
            console.log(error.message)
            }
        }
        cargaInicialdeLicuadoras();
    }

    hacerPeticion(){
        const cargarLicuadoras = async () => { 
            try { 
                const consulta = await fetch(`https://mikao.ar/api/Licuadoras/`);
                if(consulta.status ===200){
                    const datos = await consulta.json();

                    datos.respuesta.forEach(licuadora =>{
                        this.licuadorasInstanciadas[licuadora.id] = 
                        [datos.yo, licuadora.id, licuadora.nombre, licuadora.marca, licuadora.modelo, licuadora.estado, licuadora.mensaje]; 
                    });
                        if (JSON.stringify(this.licuadorasLocales) === JSON.stringify(this.licuadorasInstanciadas)){
                            console.log("Sin cambios");
                        } else {
                            this.licuadorasLocales = this.licuadorasInstanciadas.slice();
                            console.log("Acutalizando...");
                            this.crearContenedor();
                        }
                } else {console.log("BatiError 2 desconocido");}
            } catch (error) {
            console.log(error.message)
            }
        }
        cargarLicuadoras();
    }

    crearContenedor(){
        document.getElementById('contenedor').innerHTML = '';
        this.licuadorasLocales.forEach (listita => { 
            let licua = new Licuadora(listita[1], listita[2], listita[3], listita[4], listita[5], listita[6], this.sesionNombre);
            licua.mostrarInfo();
        });
    }

    encenderApagar(key, from, to, toID){   
        let sonidoBoton = document.querySelector ("#licuadora-boton-sonido");
        sonidoBoton.play(); 
        const actualizarLicuadoras = async () => {   
            try { 
                const consulta = await fetch(`https://mikao.ar/api/Licuadoras/?key=${key}&from=${from}&to=${to}&toID=${toID}`);
                if(consulta.status ===200){ console.log("Actualizado!");
                } else {console.log("BatiError 1 desconocido");}
            } catch (error) {
            console.log(error.message)
            }
        }
        actualizarLicuadoras(key, from, to, toID);
    }

}

// Inicio JS
let pantalla = new MostrarHtml; 
pantalla.ingresarDatos();
let peticion = pantalla.hacerPeticion();
window.onclick = function(e) {  
    if (e.target.className == 'licuadora-boton') {
        var pizza = e.target.id; var porciones = pizza.split('-'); pantalla.encenderApagar('load', porciones[2], porciones[1], porciones[0]);
     }    
    
};
setInterval(function () {pantalla.hacerPeticion()}, 2000);

window.addEventListener("beforeunload", function (e) {
   console.log("Cerrado");
  });