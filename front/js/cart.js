const idCarts = [];


// On récupére l'id de tous les produits du panier

function getCartById() {

    let localStorageArea = JSON.parse(localStorage.getItem('productStorage'));

    if (localStorageArea) {

        for (let id of localStorageArea) {

            let idCart = id.productId;
            idCarts.push(idCart);
        }
    };

    console.log(idCarts)
};

getCartById();

// Récupération des données des produits du panier

for (let id of idCarts) {

    fetch("http://localhost:3000/api/products/" + id)

        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })

        .then(function (productList) {
            console.log(productList);
            displayCart(productList);
        })

        .catch(function (error) {
            alert("Une erreur est survenue")
        });
};