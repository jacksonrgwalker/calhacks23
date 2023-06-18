
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
  } from "langchain/prompts";
import {systemMessagePromptTemplate, humanMessagePromptTemplate} from "./prompts.js"

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            systemMessagePromptTemplate
        ),
        new MessagesPlaceholder("history"),
        HumanMessagePromptTemplate.fromTemplate(humanMessagePromptTemplate),
    ],
);

const chat = new ChatOpenAI({
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token) {
                process.stdout.write(token);
            },
        },
    ],
});

const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
});

// await chain.call([
//     new HumanChatMessage("Write me a song about sparkling water."),
// ]);