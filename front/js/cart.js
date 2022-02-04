const idCarts = [];
let localStorageArea = JSON.parse(localStorage.getItem('productStorage'));

// On récupére l'id de tous les produits du panier

function getIdCart() {



    if (localStorageArea) {

        for (let id of localStorageArea) {

            let idCart = id.productId;
            idCarts.push(idCart);
        }
    };

    console.log(idCarts)
};

getIdCart();

// Récupération des données des produits du panier par leur id

function getProductCard() {


    idCarts.forEach(productId => fetch("http://localhost:3000/api/products/" + productId)


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
        })
    )
};

getProductCard();