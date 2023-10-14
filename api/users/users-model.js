const db = require("../../data/db-config"); 
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  return await db("users");
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  return await db("users").where(filter);
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const [result] = await db('users').where({user_id : user_id});
  const {user_id : userId,username} = result;
  const resolved = {
    user_id : userId,
    username : username,
  }
  return resolved;
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [result] = await db("users").insert(user);
  
  const result2 = await db("users").where("user_id",result).first();
  const {user_id,username} = result2;
  return {user_id : user_id,username : username}
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}