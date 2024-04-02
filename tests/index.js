const articlesExample = [
    { id : "1234", price: 40, weightKg : 0.3, quantity:2},
    { id : "5678", price: 20, weightKg : 0.1, quantity:5}
];

//Frais de port : 10 euros le kg (poids total de la commande)
function getShippingCost(articles) {
    const totalWeight = articles.reduce(
        (total, article) => total + article.weightKg*article.quantity,
        0
    );
    return totalWeight*10;
}

console.log(getShippingCost(articlesExample));