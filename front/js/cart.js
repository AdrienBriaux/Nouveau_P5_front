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

// Affichage dynamique des produits


/* for (let id in idCarts) {
    fetch("http://localhost:3000/api/products/" + idCart)

        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })

        .then(function (product) {
            console.log(product);
            displayProduct(product);
        })

        .catch(function (error) {
            alert("Une erreur est survenue")
        });
}; */