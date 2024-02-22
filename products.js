
import {products} from './mongoCollections.js';
import {ObjectId} from 'mongodb';


 
  export async function get(id) {
    let x = new ObjectId();


    //error checks
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: Id must be a string';
    if (id.trim().length === 0) throw 'Error: Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';


    const productCollection = await products();
    const p = await productCollection.findOne({_id: new ObjectId(id)});
    if (p === null || !p) throw 'Error: No product with that id';
    p._id = p._id.toString();
    return p;
  };


  export async function getAll() {
    const productCollection = await products();
    let productList = await productCollection.find({}).toArray();
    if (!productList) throw 'Error: Could not get all products';


    if (productList === undefined || productList === null) {
      return [];
    }


    productList = productList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return productList;
  };


  export async function create(
    productName,
    productDescription,
    modelNumber,
    price,
    manufacturer,
    manufacturerWebsite,
    keywords,
    categories,
    dateReleased,
    discontinued) {


     //Error checks
      if (!productName) throw 'Error: Input missing productName!';
      if (!productDescription) throw 'Error: Input missing productDescription!';
      if (!modelNumber) throw 'Error: Input missing modelNumber!';
      if (!price) throw 'Error: Input missing price!';
      if (!manufacturer) throw 'Error: Input missing manufacturer!';
      if (!manufacturerWebsite) throw 'Error: Input missing manufacturerWebsite!';
      if (!keywords) throw 'Error: Input missing keywords!';
      if (!categories) throw 'Error: Input missing categories!';
      if (!dateReleased) throw 'Error: Input missing dateReleased!';
      if (discontinued === undefined) throw 'Error: Input missing discontinued!';


     if (typeof productName !== 'string' || typeof productDescription !== 'string' || typeof modelNumber !== 'string' || typeof manufacturer !== 'string' || typeof manufacturerWebsite !== 'string' || typeof dateReleased !== 'string') throw 'Error: Given input must be a string!';
     if (productName.trim().length === 0 || productDescription.trim().length === 0 || modelNumber.trim().length === 0 || manufacturer.trim().length === 0 || manufacturerWebsite.trim().length === 0 || dateReleased.trim().length === 0) throw 'Error: Cannot be empty string!';
   
     if (typeof price !== 'number' || price <=0 ) throw "Error: Price must be a number greater than 0 AND must only have 2 decimal places";

      function priceFunctionForDecimal(price) {
       
        //convert price to a string
        const priceIsString = price.toString();
        //locate the index of the decimal
        const findDecimal = priceIsString.indexOf('.');
        //allow for whole numbers (not having a decimal won't casue an error)
        if (findDecimal === -1) {
          return true;
        }
        //check that there are no more than 2 decimal places after the decimal (<= 2 does not work, must be <= 3)
        const decimalGood = (priceIsString.length - findDecimal <= 3);

        return decimalGood 
      }

      if (!priceFunctionForDecimal(price)) throw "Error: only allowed 2 decimal points for the cents"


     if (typeof price !== 'number' || price <=0 ) throw "Error: Price must be a number greater than 0 AND must only have 2 decimal places";


     if (!manufacturerWebsite.startsWith('http://www.') || !manufacturerWebsite.endsWith('.com')) throw "Error: ManufacturerWebsite has invalid beginning or end!";
     const lengthBetween = manufacturerWebsite.length - 'http://www.'.length - '.com'.length;
     if (lengthBetween < 5) throw "Error: Must be at least 5 characters between http://www. and .com"


     if (!keywords || !Array.isArray(keywords) || keywords.length === 0) throw 'Error: You must provide an array of keywords!';
     if (!categories || !Array.isArray(categories) || categories.length === 0) throw 'Error: You must provide an array of categories!';
   
    for (let i in keywords) {
      if (typeof keywords[i] !== 'string' || keywords[i].trim().length === 0) {
        throw 'Error: One or more keywords is not a string or is an empty string!';
      }
      keywords[i] = keywords[i].trim();
    }
    for (let i in categories) {
      if (typeof categories[i] !== 'string' || categories[i].trim().length === 0) {
        throw 'Error: One or more categories is not a string or is an empty string!';
      }
      categories[i] = categories[i].trim();
    }

    function correctDate(dateReleased) {
      //we use / to split up the date sections, ie. 02/27/2023
      const sections = dateReleased.split('/');
      //take out month
      //month is the first section [0]
      const m = parseInt(sections[0]);
      //take out day
      //day is the second section [1]
      const d = parseInt(sections[1]);

      //array that describes the number of days in each month
      const monthly = [
        31, //Jan
        28, //Feb
        31, //March
        30, //April
        31, //May
        30, //June
        31, //July
        31, //Aug
        30, //Sep
        31, //Oct
        30, //Nov
        31  //Dec
      ];

      //days must be between 1 and it's month-1 from the monthly array and months must be between 1 and 12, Jan to Dec
      return (
         d >=1 && d <= monthly[m - 1] && m >=1 && m <=12
      );
      
    }

    if (!correctDate(dateReleased)) throw "Error: Invalid date"

    //d{2} two digits for month, d{2} two digits for day, d{4} four digits for year with ^ start and $ end... ^ mm/dd/yyyy $
    const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateFormat.exec(dateReleased)) throw "Error: Incorrect date format, must be mm/dd/yyyy";


    if (typeof discontinued !== 'boolean') throw "Error: Discontinued must be a boolean!"
 
    //trim the strings
    productName = productName.trim();
    productDescription = productDescription.trim();
    modelNumber = modelNumber.trim();
    manufacturer = manufacturer.trim();
    manufacturerWebsite = manufacturerWebsite.trim();
    dateReleased = dateReleased.trim();



    let newProduct = {
  productName: productName,
  productDescription: productDescription,
  modelNumber: modelNumber,
  price: price,
  manufacturer: manufacturer,
  manufacturerWebsite: manufacturerWebsite,
  keywords: keywords,
  categories: categories,
  dateReleased: dateReleased,
  discontinued: discontinued
    };
    const productCollection = await products();
    const insertInfo = await productCollection.insertOne(newProduct);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Error: Could not add product';




    const newId = insertInfo.insertedId.toString();




    const prod = await get(newId);
    return prod;
  };


  export async function remove(id) {
    if (!id) throw 'Error: You must provide an ID to search for';
    if (typeof id !== 'string') throw 'Error: ID must be a string';
    if (id.trim().length === 0) throw 'Error: ID cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';
    const productCollection = await products();
    const deletionInfo = await productCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });




    if (!deletionInfo) {
      throw `Error: Could not delete product with id of ${id}`;
    }
    return `${deletionInfo.productName} has been successfully deleted!`;
  };



  export async function rename(id, newProductName) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: ID must be a string';
    if (id.trim().length === 0) throw 'Error: ID cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Error: Invalid object ID';
    if (!newProductName) throw 'Error: You must provide a name for your product';
    if (typeof newProductName !== 'string') throw 'Error: newProductName must be a string';
    if (newProductName.trim().length === 0) throw 'Error: newProductName cannot be an empty string or string with just spaces';
   
    newProductName = newProductName.trim();


   
    const updatedProduct = {
      productName: newProductName,
    };
    const productCollection = await products();
    const updatedInfo = await productCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: updatedProduct},
      {returnDocument: 'after'}
    );


   


    if (!updatedInfo) {
      throw 'Error: Could not update product successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
  }









