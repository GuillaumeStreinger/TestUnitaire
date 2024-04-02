const articlesExample = [
    { id : "1234", price: 40, weightKg : 0.3, quantity:2},
    { id : "5678", price: 20, weightKg : 0.1, quantity:5},
    {id : "5678", price: 20, weightKg : 0.1, quantity:5}
];

const articlesExample1 = [
    { id : "1234", price: 10, weightKg : 0.3, quantity:2},
    { id : "5678", price: 2, weightKg : 0.1, quantity:5},
];

//Frais de port : 10 euros le kg (poids total de la commande)
function getShippingCost(articles) {
    console.log(articles);
    const totalPrice = articles.reduce(
        (total,article)=> total+ article.price*article.quantity,0
    );
    return totalPrice >= 100 ? 0 :articles.reduce(
        (total, article) => total + article.weightKg*article.quantity,
        0
    )*10
}


console.log(getShippingCost(articlesExample));
console.log(getShippingCost(articlesExample1));