const connectDB = require('../config/db');
const User = require('../models/User');

(async function run(){
  try{
    await connectDB();
    const users = await User.find({});
    let updated = 0;

    for (const u of users) {
      if (u.email && u.email !== u.email.toLowerCase()) {
        u.email = u.email.toLowerCase().trim();
        await u.save();
        updated++;
      }
    }

    console.log('Lowercased ' + updated + ' user emails.');
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
