import "dotenv/config";
import Db from "../config/Db";
import Role from "../model/role.model";
import User from "../model/user.model";
import { adminSeeder, roleSeeders } from "./seeder";
import AuthService from "../service/Auth.service";

async function seed() {
  console.log("---------connecting mongo.............................");
  await Db.connectMongo();
  await Role.insertMany(roleSeeders);
  await AuthService.register(adminSeeder, 'admin');
  console.log("................Seeder file create.........................");
}

seed()
  .then(async () => {
    await Db.disconnectMongo();
    console.log(".........Disconnect mongo.............................");
  })
  .catch(async (e) => {
    console.log(e);
    await Db.disconnectMongo();
  });
