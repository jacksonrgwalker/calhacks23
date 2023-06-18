
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import { HumanChatMessage } from "langchain/schema";
import { humanMessagePromptTemplate, systemMessagePromptTemplate } from "./prompts.js";

import { OutputFixingParser, StructuredOutputParser } from "langchain/output_parsers";

// GAME UPDATE PARSER
const gameUpdateParser = z.object({
    player_message: z.string().description("message that the player will see"),
    inventory: z.array(z.string()).description("list of items in the player's inventory"),
    player_stats: z.array(z.number()).description("the player's stats (health, energy, gold)"),
    action_options: z.array(z.string()).description("list of the player's action options in order"),
    can_rest: z.boolean().description("whether the player can rest at the moment"),
    can_heal: z.boolean().description("whether the player can heal at the moment"),
    generate_image: z.boolean().description("whether to generate an image of the game state"),
    image_prompt: z.string().description("prompt to generate the image of the game state"),
});
const gameUpdateFormatInstructions = gameUpdateParser.getFormatInstructions();


const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        systemMessagePromptTemplate
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate(humanMessagePromptTemplate),
],
    inputVariables = ["history", "input"],
    partialVariables = { "formatInstructions": gameUpdateFormatInstructions },
);

const chat = new ChatOpenAI({
    streaming: false
});

const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
});



// const input = await chain.format({
//     question: "What is the capital of France?",
// });
// const response = await model.call(input);

// console.log(input);


// await chain.call([
//     new HumanChatMessage("Write me a song about sparkling water."),
// ]);