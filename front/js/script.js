//Ouverture de l'API

fetch("http://localhost:3000/api/products")

    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (productsList) {
        console.log(productsList);
    })
    .catch(function (error) {
        alert("une erreur est survenue")
    });

//Intégration dynamique des éléments dans le DOM

function displayData(productsList) {

    for (let article in productsList) {

        let productLink = document.createElement("a");
        document.getElementById('items').appendChild(productLink);
        productLink.href = `product.html?id=${productsList[article]._id}`;

        let productArticle = document.createElement('article');
        productLink.appendChild(productArticle);

        let productImg = document.createElement('img');
        productArticle.appendChild(productImg);
        productImg.src = productsList[article].imageUrl;
        productImg.alt = productsList[article].altTxt;

        let productName = document.createElement('h3')
        productArticle.appendChild(productName);
        productName.textContent = productsList[article].name;

        let productDescription = document.createElement('p');
        productArticle.appendChild(productDescription);
        productDescription.textContent = productsList[article].description;

    }

    .catch (function (error) {
        alert("Une erreur est survenue")
    }
}

displayData();