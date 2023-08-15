const { faker } = require('@faker-js/faker');
const productModel = require('../../dao/models/product.model')
const mongoose = require('mongoose')

function generateUsersRecord(count) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const code = faker.vehicle.vrm() 
    const title = faker.commerce.product();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price({ min: 100, max: 200 })
    const thumbnail = faker.image.urlLoremFlickr({ category: 'product' })
    const stock = faker.number.int({ max: 100 });
    const status = Math.random() < 0.8
    const category = categoryPrd[Math.floor(Math.random()*categoryPrd.length)]

    products.push({ code, title, description, price, thumbnail, stock, status, category });
  }

  return products;
}
const categoryPrd = ['Deporte', 'Electrónica', 'Moda', 'Jardineria','Pileta']
const numberOfUsers = 5000;
const usersRecords = generateUsersRecord(numberOfUsers);

// console.log(usersRecords)

async function main() {
  await mongoose.connect("mongodb+srv://agustincivano:CyIyEfz39CK8k6Je@cluster0.hcav26p.mongodb.net/ecommerce?retryWrites=true&w=majority")
  const result = await productModel.insertMany(usersRecords)

//   const result = await userModel.find({ lastname: "Doe" }).explain("executionStats")


  await mongoose.disconnect()
}

main()