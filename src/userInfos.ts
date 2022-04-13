import { getDatabase } from "./database";

export async function userProfil(userInfo: string) {
  const mongodb = await getDatabase();
  const userFound = await mongodb
    .db()
    .collection("Users")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?.profile);
  return userFound;
}
