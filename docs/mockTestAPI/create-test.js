module.exports = {
    post: {
        tags: ['MockTest API'],
        description: "Create MockTest",
        operationId: "createMockTest",
        parameters: [],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/MockTest'
                    }
                }
            }
        },
        responses: {
            '201': {
                description: "MockTest created successfully"
            },
            '500': {
                description: 'Server error'
            }
        }
    }
}