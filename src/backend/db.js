var firebase = require("firebase/app");
var db = require("firebase/database");
const { apiKey } = require("../../config.json");
const firebaseConfig = {
   apiKey: "AIzaSyBwOO7ARSBunD_besdlVXLQTj6LkyY2Dm8",

   authDomain: "femboytector.firebaseapp.com",

   databaseURL:
      "https://femboytector-default-rtdb.europe-west1.firebasedatabase.app",

   projectId: "femboytector",

   storageBucket: "femboytector.appspot.com",

   messagingSenderId: "1090523267825",

   appId: "1:1090523267825:web:8ccd8035517c534e785f50",
};

const dayOfYear = (date) =>
   Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
   );

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
const server = new Server();
module.exports = server;
