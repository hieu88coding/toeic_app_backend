const getUsers = require('./get-users');
const getAUser = require('./get-a-user');
const createUser = require('./create-user');
const updateUser = require('./update-user');
const deleteUser = require('./delete-user');

module.exports = {
    '/users': {
        ...getUsers,
        ...createUser
    },
    '/users/{userId}': {
        ...getAUser,
        ...updateUser,
        ...deleteUser
    }


}