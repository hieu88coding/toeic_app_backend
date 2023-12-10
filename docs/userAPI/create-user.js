module.exports = {
    post: {
        tags: ['User API'],
        description: "Create User",
        operationId: "createUser",
        parameters: [],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/User'
                    }
                }
            }
        },
        responses: {
            '201': {
                description: "User created successfully"
            },
            '500': {
                description: 'Server error'
            }
        }
    }
}