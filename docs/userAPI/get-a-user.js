module.exports = {
    get: {
        tags: ['User API'],
        description: "Get a User",
        operationId: "getUser",
        parameters: [
            {
                name: "id",
                in: "path",
                schema: {
                    // $ref: "#/components/schemas/User"
                    type: "integer"
                },
                required: true,
                description: "A single User id"
            }
        ],
        responses: {
            '200': {
                description: "User is obtained",
                content: {
                    'application/json': {
                        schema: {
                            $ref: "#/components/schemas/User"
                        }
                    }
                }
            },
            '404': {
                description: "User is not found",

            }
        }
    }
}