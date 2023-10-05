const { faker } = require('@faker-js/faker');


function generateUsersRecord() {
  const products = [];
  const count = 100
  for (let i = 0; i < count; i++) {
    const code = faker.commerce.isbn() 
    const title = faker.commerce.product();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price({ min: 100, max: 200 })
    const thumbnail = faker.image.urlLoremFlickr({ category: 'product' })
    const stock = faker.number.int({ max: 100 });
    const status = faker.helpers.arrayElement([true, false])
    const category = faker.helpers.arrayElement(['Deporte', 'Electrónica', 'Moda', 'Jardineria','Pileta'])

    products.push({ code, title, description, price, thumbnail, stock, status, category });
  }

  return products;
}

module.exports = {generateUsersRecord}