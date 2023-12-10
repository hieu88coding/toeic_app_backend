const getMockTests = require('./get-tests');
const getAMockTest = require('./get-a-test');
const createMockTest = require('./create-test');
const updateMockTest = require('./update-test');
const deleteMockTest = require('./delete-test');

module.exports = {
    '/mockTests': {
        // ...getMockTests,
        ...createMockTest,
    },
    '/mockTests/{testId}': {
        ...getAMockTest,
        // ...updateMockTest,
        // ...deleteMockTest
    }



}