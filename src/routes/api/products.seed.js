const { faker } = require('@faker-js/faker');


function generateUsersRecord() {
  const products = [];
  const count = 200
  for (let i = 0; i < count; i++) {
    const code = faker.commerce.isbn() 
    const title = faker.commerce.product();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price({ min: 100, max: 200 })
    const thumbnail = faker.image.urlLoremFlickr({ category: 'product' })
    const stock = faker.number.int({ max: 100 });
    const status = faker.helpers.arrayElement([true, false])
    const category = faker.helpers.arrayElement(['Deporte', 'Electrónica', 'Moda', 'Jardineria','Pileta'])
    const owner = faker.helpers.arrayElement(['Admin', 'Admin', 'a@a.com', 'ab@ab.com', 'agustincivano@gmail.com'])
    products.push({ code, title, description, price, thumbnail, stock, status, category,owner });
  }

  return products;
}

module.exports = {generateUsersRecord}