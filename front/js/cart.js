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

async function getProductCart() {

    const productList = [];

    for (const p in localStorageArea) {

        const product = localStorageArea[p];
        const productFromApi = await getProductFromApi(product.productId);
        productList.push(productFromApi);
        productListFromApi[product.productId] = productFromApi;
    }

    displayCart(productList);
    totalCartPrice(productListFromApi);
};

getProductCart();


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


        // Au clic on supprime le produit dans le local storage

        deleteItem.addEventListener('click', (event) => {

            // On filtre les produits qui ne sont pas identique

            localStorageArea = localStorageArea.filter(el => el.productId !== idProduct || el.colorChoice !== color);

            // On sauvegarde le résultat dans le local storage et on supprime du DOM

            cartItemArticle.remove();

            localStorage.setItem('productStorage', JSON.stringify(localStorageArea));

            totalCartPrice(productListFromApi);

            return;
        });
    };
};

// Affichage du prix total du panier et du nombre d'articles


function totalCartPrice(productListFromApi) {

    let totalPriceDisplay = document.getElementById('totalPrice');
    let totalQuantityDisplay = document.getElementById('totalQuantity');

    let totalPrice = 0;
    let totalQuantity = 0;

    // Quantité totale

    for (let p in localStorageArea) {

        totalQuantity += JSON.parse(localStorageArea[p].quantityChoice);
    };

    totalQuantityDisplay.innerHTML = totalQuantity;


    // Prix total

    for (let i in localStorageArea) {

        const productId = localStorageArea[i].productId;
        totalPrice += JSON.parse(productListFromApi[productId].price) * JSON.parse(localStorageArea[i].quantityChoice);
    }

    totalPriceDisplay.innerHTML = totalPrice;
};

//////////// Validation des inputs ///////////////////////////////

// On cible les inputs dans le DOM

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

// Déclaration des regexp 

let nameRegexp = new RegExp('^[a-zA-Z\D]+$');
let addressRegexp = new RegExp('^[0-9]+.*([a-zA-Zéèàùçîï]+([a-zA-Zéèàùçîï]+)+)$');
let emailRegexp = new RegExp('^[a-zA-Z0-9._]+[@][a-zA-Z0-9._]+[.][a-z]{2,3}$');

// On écoute les modifications des champs de saisies du formulaire
// On test l'expression réguliére avec le champs du formulaire

// Input du prénom

firstName.addEventListener('input', function () {

    testRegexpFirstName(firstName);
});


function testRegexpFirstName(inputText) {

    RegexpFirstName = nameRegexp.test(inputText.value);
    let messErrFirstName = document.getElementById('firstNameErrorMsg');
    console.log('testRegexpFirstName', RegexpFirstName);

    if (RegexpFirstName) {

        messErrFirstName.innerHTML = '';
        return true;
    }

    messErrFirstName.innerHTML = "Le prénom n'est pas valide, seul les lettres sont autorisé";
    return false;
};

// Input du nom

lastName.addEventListener('input', function () {

    testRegexpLastName(lastName);
});


function testRegexpLastName(inputText) {

    RegexpLastName = nameRegexp.test(inputText.value);
    let messErrLastName = document.getElementById('lastNameErrorMsg');
    console.log('testRegexpLastName', RegexpLastName);

    if (RegexpLastName) {

        messErrLastName.innerHTML = "";
        return true;
    }

    messErrLastName.innerHTML = "Le nom n'est pas valide, seul les lettres sont autorisé";
    return false;
};

// Input de l'adresse

address.addEventListener('input', function () {

    testRegexpAddress(address);
});


function testRegexpAddress(inputText) {

    RegexpAddress = addressRegexp.test(inputText.value);
    let messErrAddress = document.getElementById('addressErrorMsg');
    console.log('testRegexpAddress', RegexpAddress)

    if (RegexpAddress) {

        messErrAddress.innerHTML = "";
        return true;
    }

    messErrAddress.innerHTML = "L'adresse n'est pas valide, ne pas saisir votre numéro postal, Ex: 10, rue du code.";
    return false;
};

// Input Ville

city.addEventListener('input', function () {

    testRegexpCity(city);
});


function testRegexpCity(inputText) {

    RegexpCity = nameRegexp.test(inputText.value);
    let messErrCity = document.getElementById('cityErrorMsg');
    console.log('testRegexpCity', RegexpCity)

    if (RegexpCity) {

        messErrCity.innerHTML = '';
        return true;
    }

    messErrCity.innerHTML = "Le nom de la ville n'est pas valide, seul les lettres sont autorisé";
    return false;
};

// Input email

email.addEventListener('input', function () {

    testRegexpEmail(email);
});


function testRegexpEmail(inputText) {

    RegexpEmail = emailRegexp.test(inputText.value);
    let messErrEmail = document.getElementById('emailErrorMsg');
    console.log('testRegexpEmail', RegexpEmail)

    if (RegexpEmail) {

        messErrEmail.innerHTML = '';
        return true;
    }

    messErrEmail.innerHTML = "L'adresse email n'est pas valide";
    return false;
};


/////////////// Envoi du formulaire  ////////////////


getDataUser();

// On récupére les données de l'utilisateur

async function getDataUser() {

    // On cible le formulaire dans le DOM 

    const formInputs = document.querySelector('.cart__order__form');

    // On écoute le click du bouton commander et on créer les éléments à poster

    formInputs.order.addEventListener('click', function (event) {

        event.preventDefault();

        // Si un des champs du formulaire n'est pas valide on modifie l'action de l'événement

        if (!RegexpFirstName || !RegexpLastName || !RegexpAddress || !RegexpCity || !RegexpEmail) {

            alert('Le formulaire est invalide');
            return;
        }

        // Sinon, les champs du formulaire sont valide, on construit l'objet à envoyer
        // Création de l'array des ID de produits commandé

        let productsId = [];

        // Pour chaque produit dans le local storage on récupére son ID

        for (let p in localStorageArea) {

            const productId = localStorageArea[p].productId;
            productsId.push(productId);
            console.log('productsId', productsId)
        }

        const order = {

            // Création de l'objet contact

            contact: {

                firstName: formInputs.firstName.value,
                lastName: formInputs.lastName.value,
                address: formInputs.address.value,
                city: formInputs.city.value,
                email: formInputs.email.value,
            },

            products: productsId,
        }

        // Contenu des informations à envoyer

        const orderConfig = {

            method: 'POST',
            body: JSON.stringify(order),
            headers: {

                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }

        sendData(orderConfig);
    });
};

// On envoi les données à l'API

function sendData(orderConfig) {

    fetch("http://localhost:3000/api/products/order", orderConfig)

        .then(function (res) {

            if (res.ok) {

                return res.json();
            }
        })

        // On récupére l'ID de la commande retourné par l'API

        .then(function (dataApi) {

            console.log('order', dataApi.orderId);
            window.location.href = `confirmation.html?orderId=${dataApi.orderId}`;
            alert('Le formulaire à été envoyé');
        })

        .catch(function (error) {

            alert("Une erreur est survenue avec l'API")
        });
};
