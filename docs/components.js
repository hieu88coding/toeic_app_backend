module.exports = {
    components: {
        schemas: {
            Blog: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    title: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    blogImage: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    contentHTML: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                    contentMarkdown: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                },
            },
            MockTest: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    testName: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    images: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    audiomp3: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    correctAnswer: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                },
            },
            Listening: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    level: {
                        type: "string",
                        description: "User identification number",
                        example: "1",
                    },
                    number: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    images: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    audiomp3: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    correctAnswer: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                },
            },
            Reading: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    level: {
                        type: "string",
                        description: "User identification number",
                        example: "1",
                    },
                    number: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    images: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    correctAnswer: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                },
            },
            Grammar: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    level: {
                        type: "string",
                        description: "User identification number",
                        example: "1",
                    },
                    number: {
                        type: "integer",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    content: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    images: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                    correctAnswer: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                },
            },
            VocabularyExcercise: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    topicId: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    number: {
                        type: "integer",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    content: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    transcribe: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    image: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                    audiomp3: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    meaning: {
                        type: "string",
                        description: "The status of the todo",
                        example: "bruh",
                    },
                },
            },
            VocabularyTopic: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    topicName: {
                        type: "integer",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                },
            },
            User: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "User identification number",
                        example: "1",
                    },
                    firstName: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    lastName: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    email: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    picture: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    address: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    phoneNumber: {
                        type: "string",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                    role: {
                        type: "boolean",
                        description: "Todo's title",
                        example: "Coding in JavaScript",
                    },
                },
            },
        },
    },
};