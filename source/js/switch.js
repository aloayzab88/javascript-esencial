// * Comparacion switch

let premiado = true;

switch (premiado) {
    case true:
        console.log('Ha sido premiado');
        break;
    case false:
        console.log('No has sido premiado');
        break;
}

console.log('Aqui va el resto del programa');

let dia = 4;

switch (dia) {
    case 1:
        console.log('Es lunes');
        break;
    case 2:
        console.log('Es martes');
        break;
    case 3:
        console.log('Es miercoles');
        break;
    case 4:
        console.log('Es jueves');
        break;
    case 5:
        console.log('Es viernes');
        break;
    case 6:
        console.log('Es sabado');
        break;
    case 7:
        console.log('Es domingo');
        break;
    default:
        console.log('Dia de semana no computado');
        break;
}