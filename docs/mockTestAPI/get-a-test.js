module.exports = {
    get: {
        tags: ['MockTest API'],
        description: "Get a MockTest",
        operationId: "getMockTest",
        parameters: [
            {
                name: "id",
                in: "path",
                schema: {
                    // $ref: "#/components/schemas/MockTest"
                    type: "integer"
                },
                required: true,
                description: "A single MockTest id"
            }
        ],
        responses: {
            '200': {
                description: "MockTest is obtained",
                content: {
                    'application/json': {
                        schema: {
                            $ref: "#/components/schemas/MockTest"
                        }
                    }
                }
            },
            '404': {
                description: "MockTest is not found",

            }
        }
    }
}