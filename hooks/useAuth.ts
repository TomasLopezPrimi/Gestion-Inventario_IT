// Testing auth con AppScript

export function useAuth () {

    function usuarioEsValido (usuario: string) {
        const idAppScript = "AKfycbzCe1m5cGor4seiffpw8s9_LZcD12iXyEXHtIoqCM11mV1VdBcDnAi8LuJ8Sbwd5qO3"
        fetch(`https://script.google.com/macros/s/${idAppScript}/exec?usuario=${usuario}`)
            .then(response => {
                // Verifica si la respuesta es exitosa
                if (!response.ok) {
                throw new Error('La red no respondió correctamente');
                }
                // Parsea la respuesta como JSON
                return response.json();
            })
            .then(data => {
                // Manipula los datos obtenidos
                console.log(data);
                return data
            })
            .catch(error => {
                // Maneja los errores
                console.error('Hubo un problema con la operación fetch:', error);
            }); 

        }
        
    return {usuarioEsValido}
    


}