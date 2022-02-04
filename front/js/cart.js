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


// Intégration des produits dans la page

async function displayCart(productList) {

    // Insertion dynamique des éléments

    let cartItemArticle = document.createElement('article');
    document.getElementById('cart__items').appendChild(cartItemArticle);
    cartItemArticle.className = 'cart__item';

    let cartItemImgDiv = document.createElement('div');
    document.querySelector('.cart__item').appendChild(cartItemImgDiv);
    cartItemImgDiv.className = 'cart__item__img';

    let imgItem = document.createElement('img')
    imgItem.src = productList.imageUrl;
    imgItem.alt = productList.alt;
};