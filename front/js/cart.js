let localStorageArea = JSON.parse(localStorage.getItem('productStorage'));

// Récupération des données des produits du panier par leur id


async function getProductFromApi(productId) {
    const response = await fetch("http://localhost:3000/api/products/" + productId);
    const json = await response.json();
    return json;
}

// Pour chaque identifiants id on lance la fonction getProductFromApi
// On place la réponse de l'api dans un tableau  

async function getProductCard() {
    const productList = [];

    for (const p in localStorageArea) {
        const product = localStorageArea[p];
        const productFromApi = await getProductFromApi(product.productId);
        productList.push(productFromApi);
    }

    displayCart(productList);
    console.log('liste des produits', productList);
};

getProductCard();


// //Intégration dynamique des éléments dans le DOM

async function displayCart(productList) {

    // Pour chaque objets dans l'array liste du panier

    for (let p in productList) {

        const product = productList[p];


        // Insertion dynamique des éléments

        let cartItemArticle = document.createElement('article');
        document.getElementById('cart__items').appendChild(cartItemArticle);
        cartItemArticle.className = 'cart__item';

        let cartItemImgDiv = document.createElement('div');
        document.querySelector('.cart__item').appendChild(cartItemImgDiv);
        cartItemImgDiv.className = 'cart__item__img';

        let imgItem = document.createElement('img')
        document.querySelector('.cart__item__img').appendChild(imgItem);
        imgItem.src = product.imageUrl;
        imgItem.alt = product.alt;

        let cartItemContentDiv = document.createElement('div');
        document.querySelector('.cart__item').appendChild(cartItemContentDiv);

    }

};