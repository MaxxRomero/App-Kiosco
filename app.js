//Vars
let inputNombre = document.getElementById('inputNombre');
let precioBulto = document.getElementById('precioBulto');
let precioUnidad = document.getElementById('precioUnidad');
let ganancia = document.getElementById('ganancia');
let precioVenta = document.getElementById('precioVenta');
let selectMarcas = document.getElementById('selectMarcas');
let btnAgregar = document.getElementById('btnAgregar');
let selectMarcasAum = document.getElementById('selectMarcasAum');
let porcAumento = document.getElementById('porcAumento');
let btnAumentar = document.getElementById('btnAumentar');
//Listas
let arcorList = document.getElementById('arcor-list');
let terraList = document.getElementById('terra-list');
let variosList = document.getElementById('varios-list');
let gaseoList = document.getElementById('gaseo-list');
let cigaList = document.getElementById('ciga-list');
let cerveList = document.getElementById('cerve-list');
let latasList = document.getElementById('latas-list');
let almaList = document.getElementById('alma-list');
//Filtro
let filter = document.getElementById('filter');


//EventListener
btnAgregar.addEventListener('click', agregarProducto);
filter.addEventListener('keyup', filtrarProducto);
document.addEventListener('DOMContentLoaded', cargarProdLocalStorage);
btnAumentar.addEventListener('click',aumentarPrecios);


function agregarProducto(e){
    var optionMarcas = selectMarcas.options[selectMarcas.selectedIndex].value;  
    switch (optionMarcas) {
        case "1":
            crearElementoTabla(arcorList);
        break;
        case "2":
            crearElementoTabla(terraList);
        break;
        case "3":
            crearElementoTabla(variosList);
        break;
        case "4":
            crearElementoTabla(gaseoList);
        break;
        case "5":
            crearElementoTabla(cigaList);
        break;
        case "6":
            crearElementoTabla(cerveList);
        break;
        case "7":
            crearElementoTabla(latasList);
        break;
        case "8":
            crearElementoTabla(almaList);
        break;
    }

    // Limpiar inputs
    inputNombre.value = '';
    precioBulto.value = '';
    precioUnidad.value = '';
    ganancia.value = '';
    precioVenta.value = '';

    e.preventDefault();
}

//Crear td con data del producto
function crearElementoTabla(lugarLista){
    var optionMarcas = selectMarcas.options[selectMarcas.selectedIndex].value;
    let arrayInputs = [inputNombre.value, precioBulto.value, precioUnidad.value, ganancia.value, calcularPorcentaje(),precioVenta.value,optionMarcas];
    let tr = document.createElement('tr');

    for(i = 0; i < arrayInputs.length - 1; i++){
        var td = document.createElement('td');
        td.append(arrayInputs[i]);
        tr.appendChild(td);
        lugarLista.appendChild(tr);
    }

    //Guardar en LS
    guardarLocalStorage(arrayInputs);

    tr.addEventListener('click', borrarProducto);
}

//Calcular %
function calcularPorcentaje(){
    let calculo = parseFloat(precioUnidad.value) + precioUnidad.value * ganancia.value / 100;
    return calculo.toFixed(1);
}

//Borrar elemento td al hacerle click
function borrarProducto(e){
    if(confirm('Borrar producto?')){
        e.target.parentElement.remove();

        //Borrar de LS
        borrarProdLocalStorage(e.target.parentElement);
    }
}

//Filtro
function filtrarProducto(e){
    let input = e.target.value.toLowerCase();

    document.querySelectorAll('#list-filtro').forEach
    (function(marca){
        let item = marca.textContent;

       if(item.toLowerCase().indexOf(input) != -1){
        marca.parentElement.parentElement.style.display = 'table';
       }else{
        marca.parentElement.parentElement.style.display = 'none';
       }
    });
}

//Aumentar
function aumentarPrecios(e){
    var optionMarcas = selectMarcasAum.options[selectMarcasAum.selectedIndex].value;
    let porcentaje = porcAumento.value;

    let datas = obtenerLocalStorage();
    datas.forEach(function(data){
        //Data[6] corresponde al lugar en las opciones
        if(optionMarcas === data[6]){
            //Data[1] corresponde al precio x bulto, data[2] al precio x unidad y data[4] al precio x unidad + el %.
            data[1] = calculoAumento(data[1],porcentaje);
            data[2] = calculoAumento(data[2],porcentaje);
            data[4] = nuevoPrecioAumentado(data[2],data[3]);

            localStorage.setItem('datas', JSON.stringify(datas));
        }
    });

    e.preventDefault();
}

function calculoAumento(precio,porcentaje){
    let calculo = parseFloat(precio) + parseFloat(precio) * parseFloat(porcentaje) / 100;
    return calculo.toFixed(1);
}

//Se aumenta pero con el porcentaje del valor en data[3], no el % que le ponemos al aumentar
function nuevoPrecioAumentado(precioNuevoUnidad,porcentaje){
    let calculo = parseFloat(precioNuevoUnidad) + parseFloat(precioNuevoUnidad) * parseFloat(porcentaje) / 100;
    return calculo.toFixed(1);
}

/////////////////////Local Storage////////////////////////////

function guardarLocalStorage(data){
    let datas = obtenerLocalStorage();
    datas.push(data);
    localStorage.setItem("datas", JSON.stringify(datas));
}

function obtenerLocalStorage(){
    if(!localStorage.getItem("datas")){
        return [];
    }

    return JSON.parse(localStorage.getItem("datas"));
}

//Cargar elementos de LS al recargar pag
function cargarProdLocalStorage(){
    let datas = obtenerLocalStorage();

    datas.forEach(function(data){
        let tr = document.createElement('tr');
        for(let i = 0;i < data.length - 1; i++){
            var td = document.createElement('td');;
            td.append(data[i]);
            tr.appendChild(td);

            //Recorrer switch para saber en que list va
            switch (data[6]) {
                case "1":
                    arcorList.appendChild(tr);
                break;
                case "2":
                    terraList.appendChild(tr);
                break;
                case "3":
                    variosList.appendChild(tr);
                break;
                case "4":
                    gaseoList.appendChild(tr);
                break;
                case "5":
                    cigaList.appendChild(tr);
                break;
                case "6":
                    cerveList.appendChild(tr);
                break;
                case "7":
                    latasList.appendChild(tr);
                break;
                case "8":
                    almaList.appendChild(tr);
                break;
            }
        }
        
        tr.addEventListener('click', borrarProducto); 
    });   
}


function borrarProdLocalStorage(prodItem){
    let datas = obtenerLocalStorage();

    datas.forEach(function(data,index){
        if(prodItem.firstChild.textContent === data[0]){
            datas.splice(index, 1);
        }
    });

    localStorage.setItem('datas', JSON.stringify(datas));
}
