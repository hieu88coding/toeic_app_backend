module.exports = {
    get: {
        tags: ['User API'],
        description: "Get Users",
        operationId: 'getUsers',
        parameters: [],
        responses: {
            '200': {
                description: "Users were obtained",
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                }
            }
        }
    }
}