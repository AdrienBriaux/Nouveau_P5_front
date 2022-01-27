//Ouverture de l'API

fetch("http://localhost:3000/api/products")

    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (productsList) {
        console.log(productsList);
        displayProductList(productsList);
    })
    .catch(function (error) {
        alert("une erreur est survenue")
    });

//Intégration dynamique des éléments dans le DOM

function displayProductList(productsList) {

    for (let p in productsList) {
        const product = productsList[p];

        let productLink = document.createElement("a");
        document.getElementById('items').appendChild(productLink);
        productLink.href = `product.html?id=${product._id}`;

        let productArticle = document.createElement('article');
        productLink.appendChild(productArticle);

        let productImg = document.createElement('img');
        productArticle.appendChild(productImg);
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;

        let productName = document.createElement('h3')
        productArticle.appendChild(productName);
        productName.textContent = product.name;

        let productDescription = document.createElement('p');
        productArticle.appendChild(productDescription);
        productDescription.textContent = product.description;

    }
}