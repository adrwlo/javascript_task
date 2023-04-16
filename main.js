// Function to make API requests
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to calculate the distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

(async () => {
    // Fetch users data
    const users = await fetchData("https://fakestoreapi.com/users");

    // Fetch carts data
    const carts = await fetchData("https://fakestoreapi.com/carts");

    // Fetch products data
    const products = await fetchData("https://fakestoreapi.com/products");

    console.log("Zadanie 1")

    console.log("Users");
    console.log(users);

    console.log("Carts");
    console.log(carts);
    
    console.log("Products");
    console.log(products);

    const categoryValues = new Map();

    // Loop through all products and calculate their total value
    for (const product of products) {
        // If the category already exists in the Map, add the product value to its total
        if (categoryValues.has(product.category)) {
            const currentValue = categoryValues.get(product.category);
            categoryValues.set(
                product.category,
                currentValue + parseFloat(product.price)
            );
        } else {
            // If the category doesn't exist in the Map, add it with the product value as its total
            categoryValues.set(product.category, parseFloat(product.price));
        }
    }

    console.log("Zadanie 2");
    console.log(categoryValues);

    let highestCartValue = 0;
    let highestCartOwner = "";

    // Loop through all carts and calculate their total value
    for (const cart of carts) {
        let totalValue = 0;

        // Loop through all items in the cart and add their value to the total
        for (const item of cart.products) {
            const product = products.find((p) => p.id === item.productId);
            totalValue += parseFloat(product.price) * item.quantity;
        }

        // If the current cart has a higher value than the previous highest, update the values
        if (totalValue > highestCartValue) {
            highestCartValue = totalValue;
            const owner = users.find((u) => u.id === cart.userId);
            highestCartOwner = owner.name.firstname + " " + owner.name.lastname;
        }
    }

    console.log("Zadanie 3");
    console.log(
        `The owner of highest cart value is ${highestCartOwner} with value ${highestCartValue}`
    );

    let maxDistance = 0;
    let furthestUsers = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const user1 = users[i];
            const user2 = users[j];
            const distance = getDistance(
                user1.address.geolocation.lat,
                user1.address.geolocation.long,
                user2.address.geolocation.lat,
                user2.address.geolocation.long
            );
            if (distance > maxDistance) {
                maxDistance = distance;
                furthestUsers = [user1, user2];
            }
        }
    }
    console.log("Zadanie 4");
    console.log(
        `The two users living furthest away from each other are ${
            furthestUsers[0].name.firstname
        } ${furthestUsers[0].name.lastname} and ${
            furthestUsers[1].name.firstname
        } ${
            furthestUsers[1].name.lastname
        }, with a distance of ${maxDistance.toFixed(2)} km.`
    );
})();
