var firebase = require("firebase/app");
var db = require("firebase/database");
const cards = require("./src/assets/cards.json");
const firebaseConfig = {
   apiKey: "AIzaSyAydayQjH5DyoYfwm-KQB5ntlfu6jPRsK8",
   authDomain: "cards-discord-bot.firebaseapp.com",
   databaseURL:
      "https://cards-discord-bot-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "cards-discord-bot",
   storageBucket: "cards-discord-bot.appspot.com",
   messagingSenderId: "280979108560",
   appId: "1:280979108560:web:190df1aa0fd4f2701aa4d5",
};

class Server {
   constructor() {
      this.app = firebase.initializeApp(firebaseConfig);
      this.database = db.getDatabase(this.app);
   }

   async getData(path) {
      var snapshot = await db.get(db.ref(this.database, path));
      if (snapshot.exists()) return snapshot.val();
      else return undefined;
   }

   async setData(path, data) {
      await db.set(db.ref(this.database, path), data);
   }
}

async function main() {
   let totalUserIds = Object.keys(await server.getData("Users"));
   console.log(totalUserIds);
   totalUserIds.forEach(async (id) => {
      await server.setData(`Users/${id}/deck`, null);
   });
}

const server = new Server();
main();
