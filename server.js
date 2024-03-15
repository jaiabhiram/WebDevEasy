const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );

  mongoose
  .connect(DB)
  .then(() => console.log('Successfully connected to MongoDB!!!'))
  .catch(err => console.log(err));  

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on PORT ${port}!!!`);
});