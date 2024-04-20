document.addEventListener('DOMContentLoaded', () => {

  //  console.log('DOM completamente cargado');

const socket = io.connect('http://localhost:8080')
const form = document.getElementById('addForm')

//console.log('Formulario de adición:', form);
const botonProds = document.getElementById('botonProductos')
const removeform = document.getElementById('removeForm')

//console.log('Formulario de adición:', form);
    console.log('Formulario de eliminación:', removeform);

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    //console.log('Formulario enviado');
    const datForm = new FormData(e.target) //Me genera un objeto iterador
    
    //console.log('Datos del formulario:', datForm);
    const prod = Object.fromEntries(datForm) //De un objeto iterable genero un objeto simple

    //console.log('Producto a agregar:', prod);
    await socket.emit('nuevoProducto', prod)

    //console.log('Mensaje enviado al servidor');
    await socket.emit('update-products');

    //console.log('Solicitud de actualización enviada al servidor');
    e.target.reset()
})

// removeform.addEventListener('submit', async (e) => {
//     e.preventDefault()
//     const code = removeform.elements["code"].value;
//     await socket.emit('remove-product', code)
//     await socket.emit('update-products');
//     e.target.reset()
    
// })

socket.on('products-data', (products) => {
        const tableBody = document.querySelector("#productsTable tbody");
        console.log("Table body:", tableBody);

        let tableContent = '';
        if (products && Array.isArray(products)) {
        products.forEach(product => {
            tableContent += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${product.thumbnail}</td>
                    <td>${product.code}</td>
                    <td>${product.stock}</td>
                </tr>
            `;
        });
    } else {
        console.error('Productos no definidos o no es un array:', products);
    }

        tableBody.innerHTML = tableContent;
        
    }); 

    socket.on("status-changed", (result)=>{
       const msg = result.msg
       const tit = result.status
    
             
    })


    
    socket.emit('update-products');
});