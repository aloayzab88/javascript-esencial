// * Condicionarl if/else

let edad = 14;

if (edad < 18) { // esto es primero y al ser true el resto ya no se evalua
    console.log('Eres menor de edad. No puedes continuar.');
} else if (edad == 14) {
    console.log('Tienes 14 años');
} else if (edad > 65) {
    console.log('Tu edad supera la edad permitida.');
} else {
    console.log('Bienvenido al proceso de seleción laboral.');
}