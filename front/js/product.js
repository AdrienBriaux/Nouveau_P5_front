//Récupération des données du produit

var str = window.location.href;
var url = new URL(str);
var productId = url.searchParams.get("id");


//Charger la page avec le produit selectionné

fetch("http://localhost:3000/api/products/" + productId)

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


//Intégartion dynamique des informations du produit

function displayProduct(product) {

    const productById = product;

    //Insertion des éléments dynamique

    let productImg = document.createElement('img');
    document.querySelector('.item__img').appendChild(productImg);
    productImg.src = productById.imageUrl;
    productImg.alt = productById.altTxt;

    let productName = document.getElementById('title');
    productName.textContent = productById.name;

    let productPrice = document.querySelector("#price");
    productPrice.textContent = productById.price;

    let productDescription = document.getElementById('description');
    productDescription.textContent = productById.description;

    //Création du choix des couleurs dynamique

    for (let color in product.colors) {

        let productColor = document.createElement('option');
        document.getElementById('colors').appendChild(productColor);
        productColor.value = productById.colors[color];
        productColor.textContent = productById.colors[color];
    }

};

//Ajout du produit sélectionner dans le panier

function addToCart() {

    buttonIdAddToCart = document.getElementById('addToCart');

    //Au click on récupére les informations du produit selectionné

    buttonIdAddToCart.addEventListener('click', function () {


        let colorChoice = document.getElementById('colors');
        colorChoice = colorChoice.value;

        let quantityChoice = document.getElementById('quantity');
        quantityChoice = quantityChoice.value;

        //Creation d'un array contenant les informations du produit

        let productOption = {

            productId: productId,
            colorChoice: colorChoice,
            quantityChoice: quantityChoice

        };


        // Création du local storage

        let localStorageArea = JSON.parse(localStorage.getItem('productStorage'));

        console.log(localStorageArea);

        // Ajout des produits dans le panier
        // Si il y a déjà des produits enregistré

        if (localStorageArea) {

            localStorageArea.push(productOption);
            localStorage.setItem('productStorage', JSON.stringify(localStorageArea));
        }

        //Si il n'y a pas de produit enregistré dans le local storage

        else {

            localStorageArea = [];
            localStorageArea.push(productOption);
            localStorage.setItem('productStorage', JSON.stringify(localStorageArea));
        }

    });

};

addToCart(); 
