
import {
    create,
    getAll,
    get,
    remove,
    rename
    } from './products.js';
//import postData from './posts.js';
import {dbConnection, closeConnection} from './mongoConnection.js';
//lets drop the database each time this is run
import { ObjectId } from 'mongodb';

const db = await dbConnection();
await db.dropDatabase();




//defining these here so I can use them later in the function
let product1 = undefined;
let product2 = undefined;
let product3 = undefined;




//1. Create a product of your choice.
try {
    product1 = await create(
      "83 inch LG C3 OLED TV",
    "The advanced LG OLED evo C-Series is better than ever...",
     "OLED83C3PUA",
       4757.29,
       "LG",
       "http://www.lgelectronics.com",
        ["TV", "Smart TV", "OLED", "LG", "Big Screen", "83 Inch"],
           ["Electronics", "Television & Video", "Televisions",  "OLED TVs"],
           "02/27/2023",
           false
  );
    console.log('1. Create a product of your choice (first product created)\n');
    //console.log(product1);
  } catch (e) {
    console.log(e);
  }




  //---

// 2. Log the newly created product. (Just that product, not all products)
console.log("\n2. Log the newly created product. (Just that product, not all products)\n");

try {
  const acquire = await get(product1._id.toString());
  console.log(acquire);
} catch (e) {
  console.log(e);
}

// //----------

// 3. Create another product of your choice.
try {
    product2 = await create(
        "Apple iPhone 14 Pro 1TB - Space Grey",
        "The all new iPhone 14 pro has many upgraded features................",
        "MQ2L3LL/A",
        1499,
        "Apple",
        "http://www.apple.com",
        ["Cell Phone", "Phone", "iPhone", "Apple", "Smartphone", "iPhone 14", "pro"],
        ["Electronics", "Cell Phones and Accessories", "Cell Phones"],
        "09/16/2022",
           false
  );
    console.log('\n3. Create another product of your choice (second product created)\n');
    //console.log(product2);
  } catch (e) {
    console.log(e);
  }

//   //----------

  // 4. Query all products, and log them all

 console.log('\n4. Query all products, and log them all\n');

try {
  const productList = await getAll();
  console.log(productList);
} catch (e) {
  console.log(e);
}


  //--------

  // 5. Create the 3rd product of your choice.
  try {
    product3 = await create(
        "Apple iPhone 13 mini 512GB - Product Red",
        "The iPhone 13 Mini is the perfect sized smartphone................",
        "MQ3L2ML/A",
        999,
        "Apple",
        "http://www.apple.com",
        ["Cell Phone", "Phone", "iPhone", "Apple", "Smartphone", "iPhone 13", "mini", "smaller smartphones"],
        ["Electronics", "Cell Phones and Accessories", "Cell Phones"],
        "09/24/2021",
           false
  );
    console.log('\n5. Create the 3rd product of your choice (third product created)\n');
    //console.log(product3);
  } catch (e) {
    console.log(e);
  }

  //--------

  // 6. Log the newly created 3rd product. (Just that product, not all product)
  console.log("\n6. Log the newly created 3rd product. (Just that product, not all product)\n");

try {
  const acquire = await get(product3._id.toString());
  console.log(acquire);
} catch (e) {
  console.log(e);
}

//----------

// 7. Rename the first product

console.log("\n7. Rename the first product (first product renamed)\n");

try {
  const renamedProduct = await rename(product1._id.toString(), "Apple iPhone 14 Pro 1TB - Deep Purple");
  console.log("Now product1's name is:\n");
  console.log(renamedProduct);
} catch (e) {
  console.log(e);
}

//--------

// 8. Log the first product with the updated name. 
console.log("\n8. Log the first product with the updated name\n");

try {
  const acquire = await get(product1._id.toString());
  console.log(acquire);
} catch (e) {
  console.log(e);
}



//--------

// //9. Remove the second product you created.

console.log("\n9. Remove the second product you created (second product removed)\n");

try {
  const gone = await remove(product2._id.toString());
  console.log(gone);
} catch (e) {
  console.log(e);
}

//---------

// 10. Query all products, and log them all
console.log('\n10. Query all products, and log them all\n');

try {
  const productList = await getAll();
  console.log(productList);
} catch (e) {
  console.log(e);
}


// 11. Try to create a product with bad input parameters to make sure it throws errors.
console.log("\nLet's create a product with bad input parameters...");

try {
  product1 = await create(
    83,
  "The advanced LG OLED evo C-Series is better than ever...",
   "OLED83C3PUA",
     4757.29,
     "LG",
     "http://www.lgelectronics.com",
      ["TV", "Smart TV", "OLED", "LG", "Big Screen", "83 Inch"],
         ["Electronics", "Television & Video", "Televisions",  "OLED TVs"],
         "02/27/2023",
         false
);
  console.log('Product 1 has been added');
  console.log(product1);
} catch (e) {
  console.log(e);
}

// ---------------------

// 12. Try to remove a product that does not exist to make sure it throws errors.
console.log("\nLet's now remove a product that does not exist...");

try {
  const gone = await remove("product id that does not exist");
  console.log(gone);
} catch (e) {
  console.log(e);
}

// ---------------------

// 13. Try to rename a product that does not exist to make sure it throws errors.
console.log("\nLet's rename a product that does not exist...");

try {
  const renamedProduct = await rename("product id that does not exist", "Apple iPhone 14 Pro 1TB - Deep Purple");
  console.log("Now product1's name is:");
  console.log(renamedProduct);
} catch (e) {
  console.log(e);
}

// --------------------

// 14. Try to rename a product passing in invalid data for the newProductName parameter to make sure it throws errors.
console.log("\nLet's rename a product passing in invalid data for the newProductName parameter...");

try {
  const renamedProduct = await rename(product1._id.toString(), 1);
  console.log("Now product1's name is:");
  console.log(renamedProduct);
} catch (e) {
  console.log(e);
}

// --------------------

// 15. Try getting a product by ID that does not exist to make sure it throws errors.
console.log("\nLet's now get a product by ID that does not exist...");

try {
  const acquire = await get('123');
  console.log(acquire);
} catch (e) {
  console.log(e);
}


closeConnection();









