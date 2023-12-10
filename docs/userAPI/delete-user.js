module.exports = {
    delete: {
        tags: ['User API'],
        description: "Deleting a User",
        operationId: "deleteUser",
        parameters: [
            {
                name: "id",
                in: "path",
                // schema: {
                //     $ref: "#/components/schemas/User"
                // },
                required: true,
                description: "Deleting a done User"
            }
        ],
        responses: {
            '200': {
                description: "User deleted successfully"
            },
            '404': {
                description: "User not found"
            },
            '500': {
                description: "Server error"
            }
        }
    }
}