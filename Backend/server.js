require('dotenv').config();
const app = require('./src/app'); 
const connectToDB = require('./src/config/database');



const port = process.env.PORT || 3000;

async function start() {
  await connectToDB();
  require('./src/news/news.service').startNewsScheduler();
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

start();
