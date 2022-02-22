let localStorageArea = JSON.parse(localStorage.getItem('productStorage'));
let productListFromApi = [];

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
        productListFromApi[product.productId] = productFromApi;
        console.log('productListFromApi', productListFromApi);
    }

    displayCart(productList);
    totalCartPrice(productListFromApi);
    console.log('productList', productList);
};

getProductCard();


///////////// Intégration dynamique des éléments dans le DOM ////////////////


function displayCart(productList) {

    // Pour chaque objets dans l'array liste du panier

    for (let item in productList) {

        const product = productList[item];
        const idProduct = product._id;
        const color = localStorageArea[item].colorChoice;
        const quantity = localStorageArea[item].quantityChoice;

        // Insertion dynamique des éléments

        let cartItemArticle = document.createElement('article');
        document.getElementById('cart__items').appendChild(cartItemArticle);
        cartItemArticle.className = 'cart__item';
        cartItemArticle.setAttribute('data-id', idProduct);
        cartItemArticle.setAttribute('data-color', product.colorChoice);

        let cartItemImgDiv = document.createElement('div');
        cartItemArticle.appendChild(cartItemImgDiv);
        cartItemImgDiv.className = 'cart__item__img';

        let imgItem = document.createElement('img')
        cartItemImgDiv.appendChild(imgItem);
        imgItem.src = product.imageUrl;
        imgItem.alt = product.altTxt;

        let cartItemContentDiv = document.createElement('div');
        cartItemImgDiv.appendChild(cartItemContentDiv);
        cartItemContentDiv.className = 'cart__item__content';

        let cartItemContentDescriptionDiv = document.createElement('div');
        cartItemContentDiv.appendChild(cartItemContentDescriptionDiv);
        cartItemContentDescriptionDiv.className = 'cart__item__content__description';

        let productName = document.createElement('h2');
        cartItemContentDescriptionDiv.appendChild(productName);
        productName.textContent = product.name;

        let productColor = document.createElement('p');
        cartItemContentDescriptionDiv.appendChild(productColor);
        productColor.textContent = color;

        let productPrice = document.createElement('p');
        cartItemContentDescriptionDiv.appendChild(productPrice);
        productPrice.className = 'price';
        productPrice.textContent = product.price + ' €';

        let cardItemContentSettingsDiv = document.createElement('div');
        cardItemContentSettingsDiv.className = 'cart__item__content__settings';
        cartItemContentDiv.appendChild(cardItemContentSettingsDiv);

        let cartItemContentSettingsQuantityDiv = document.createElement('div');
        cartItemContentSettingsQuantityDiv.className = 'cart__item__content__settings__quantity';
        cardItemContentSettingsDiv.appendChild(cartItemContentSettingsQuantityDiv);

        let quantityProduct = document.createElement('p');
        cartItemContentSettingsQuantityDiv.appendChild(quantityProduct);
        quantityProduct.textContent = 'Qté : ';

        let inputModifyProduct = document.createElement('input');
        cartItemContentSettingsQuantityDiv.appendChild(inputModifyProduct);
        inputModifyProduct.className = 'itemQuantity';
        inputModifyProduct.setAttribute('type', 'number');
        inputModifyProduct.setAttribute('name', 'itemQuantity');
        inputModifyProduct.setAttribute('min', "1");
        inputModifyProduct.setAttribute('max', "100");
        inputModifyProduct.setAttribute('value', quantity);


        // Au changement de la quantité du produit

        inputModifyProduct.addEventListener('change', (event) => {

            let resultQuantity = inputModifyProduct.value;

            // On cherche le produit dont la valeur à changé

            const productFound = localStorageArea.find(el => el.quantityChoice !== resultQuantity && el.productId == idProduct && el.colorChoice == color);

            productFound.quantityChoice = resultQuantity;

            localStorage.setItem('productStorage', JSON.stringify(localStorageArea));

            totalCartPrice(productListFromApi);

            return;

        });


        let cartItemContentSettingsDeleteDiv = document.createElement('div');
        cardItemContentSettingsDiv.appendChild(cartItemContentSettingsDeleteDiv);
        cartItemContentSettingsDeleteDiv.className = 'cart__item__content__settings__delete';

        let deleteItem = document.createElement('p');
        cartItemContentSettingsDeleteDiv.appendChild(deleteItem);
        deleteItem.textContent = 'Supprimer';


        // Au clic on suprime le produit dans le local storage

        deleteItem.addEventListener('click', (event) => {

            // On filtre les produits qui ne sont pas identique

            localStorageArea = localStorageArea.filter(el => el.productId !== idProduct || el.colorChoice !== color);

            // On sauvegarde le résultat dans le local storage

            cartItemArticle.remove();

            localStorage.setItem('productStorage', JSON.stringify(localStorageArea));

            totalCartPrice(productListFromApi);

            return;

        });


    };

};

// Affichage du prix total du panier et du nombre d'article


function totalCartPrice(productListFromApi) {

    let totalPriceDisplay = document.getElementById('totalPrice');
    let totalQuantityDisplay = document.getElementById('totalQuantity');

    let totalPrice = 0;
    let totalQuantity = 0;

    // Quantité total

    for (let p in localStorageArea) {

        totalQuantity += JSON.parse(localStorageArea[p].quantityChoice);
    };

    totalQuantityDisplay.innerHTML = totalQuantity;

    console.log('totalQuantity', totalQuantity);

    // Prix total

    for (let i in localStorageArea) {

        const productId = localStorageArea[i].productId;
        totalPrice += JSON.parse(productListFromApi[productId].price) * JSON.parse(localStorageArea[i].quantityChoice);
    }

    totalPriceDisplay.innerHTML = totalPrice;

    console.log('totalPrice', totalPrice);

};

//////////// Validation des inputs ///////////////////////////////

ValidForm();

function ValidForm() {

    // On cible les inputs dans le DOM

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');

    // Déclaration des regexp 

    let nameRegexp = new RegExp('^[a-zA-Z\D]+$');
    let addressRegexp = new RegExp('^[0-9]+.*([a-zA-Zéèàùç]+( [a-zA-Zéèàùç]+)+)$');
    let emailRegexp = new RegExp('^[a-zA-Z0-9._]+[@][a-zA-Z0-9._]+[.][a-z]{2,3}$');

    // On écoute les modifications des champs de saisies du formulaire
    // On test l'expression réguliére avec le champs du formulaire

    // Input du prénom

    firstName.addEventListener('input', function () {

        validFirstName(this);
    });


    let validFirstName = function (inputTextFirstName) {

        testFirstName = nameRegexp.test(inputTextFirstName.value);
        let messErrFirstName = document.getElementById('firstNameErrorMsg');
        console.log('testFirstName', testFirstName);

        if (testFirstName) {

            messErrFirstName.innerHTML = '';
            return;
        }

        messErrFirstName.innerHTML = "Le prénom n'est pas valide, seul les lettres sont autorisé";
    };

    // Input du nom

    lastName.addEventListener('input', function () {

        validLastName(this);
    });


    let validLastName = function (inputTextLastName) {

        testLastName = nameRegexp.test(inputTextLastName.value);
        let messErrLastName = document.getElementById('lastNameErrorMsg');
        console.log('testLastName', testLastName);

        if (testLastName) {

            messErrLastName.innerHTML = "";
            return;
        }

        messErrLastName.innerHTML = "Le nom n'est pas valide, seul les lettres sont autorisé";
    };

    // Input de l'adresse

    address.addEventListener('input', function () {

        validAddress(this);
    });


    let validAddress = function (inputTextAddress) {

        testAddress = addressRegexp.test(inputTextAddress.value);
        let messErrAddress = document.getElementById('addressErrorMsg');
        console.log('testAddress', testAddress)

        if (testAddress) {

            messErrAddress.innerHTML = "";
            return;
        }

        messErrAddress.innerHTML = "L'adresse n'est pas valide, seul les chiffres et lettres sont autorisé, l'adresse doit comporter plus que 4 caractères et maximum 60 caractères";
    };

    // Input Ville

    city.addEventListener('input', function () {

        validCity(this);
    });


    let validCity = function (inputTextCity) {

        testCity = nameRegexp.test(inputTextCity.value);
        let messErrCity = document.getElementById('cityErrorMsg');
        console.log('testCity', testCity)

        if (testCity) {

            messErrCity.innerHTML = '';
            return;
        }

        messErrCity.innerHTML = "Le nom de la ville n'est pas valide, seul les lettres sont autorisé";
    };

    // Input email

    email.addEventListener('input', function () {

        validEmail(this);
    });


    let validEmail = function (inputTextEmail) {

        testEmail = emailRegexp.test(inputTextEmail.value);

        let messErrEmail = document.getElementById('emailErrorMsg');
        console.log('testEmail', testEmail)

        if (testEmail) {

            messErrEmail.innerHTML = '';
            return;
        }

        messErrEmail.innerHTML = "L'adresse email n'est pas valide";
    };

};

function resultatValidation() {

    if (validFirstName == true) {

        return true;

    }

    return false;
}

/////////////// Envoi du formulaire  ////////////////

function sendForm() {

    // On cible le formulaire dans le DOM

    const formInputs = document.querySelector('.cart__order__form');

    // On écoute les inputs du formulaire lorsque l'on valide sont envoi
    // Si les champs du formulaire sont valide

    if (resultatValidation === true) {

        formInputs.addEventListener('submit', function (e) {

            // Création de l'objet contact

            let contact = {

                firstName: formInputs.firstName.value,
                lastName: formInputs.lastName.value,
                address: formInputs.address.value,
                city: formInputs.city.value,
                email: formInputs.email.value
            }

            // Création de l'array des ID de produits commandé

            let products = [''];

            // Pour chaque produit dans le local storage on récupére son ID

            for (let p in localStorageArea) {
                3




                const productId = localStorageArea[p].productId;
                products.push(productId);
            }

            alert('Formulaire envoyé');
        });
    };

    alert('Le formulaire n\'est pas valide');
    e.preventDefault();
    return;

};
