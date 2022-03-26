////////// Affichage de l'ID de la commande //////////////
let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderId");


let displayOrderId = document.querySelector('#orderId');
displayOrderId.innerHTML = orderId;
localStorage.clear();
