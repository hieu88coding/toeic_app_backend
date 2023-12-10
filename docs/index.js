const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const userAPI = require('./userAPI');
const mockTestAPI = require('./mockTestAPI');



module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    paths: {
        ...mockTestAPI,
        ...userAPI,
    }


};