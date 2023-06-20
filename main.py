from fastapi import FastAPI
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
)
from starlette.middleware.cors import CORSMiddleware


from models import CharSelection, GameUpdate
from prompts import human_message_prompt_template, system_message_prompt_template

game_update_parser = PydanticOutputParser(pydantic_object=GameUpdate)

system_message_prompt = SystemMessagePromptTemplate.from_template(
    system_message_prompt_template
)

human_message_prompt = HumanMessagePromptTemplate.from_template(
    human_message_prompt_template,
)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/game/start")
async def start_game(char_selection: CharSelection):
    sys_msg = system_message_prompt.format(
        background=char_selection.background,
        trait=char_selection.trait,
        location=char_selection.location,
        goal=char_selection.goal,
        item=char_selection.item,
    )

    input_variables = ["input", "history"]

    partial_variables = dict(
        format_instructions=game_update_parser.get_format_instructions(),
    )

    messages = [
        sys_msg,
        MessagesPlaceholder(variable_name="history"),
        human_message_prompt,
    ]

    prompt = ChatPromptTemplate(
        messages=messages,
        input_variables=input_variables,
        partial_variables=partial_variables,
    )

    chat_llm = ChatOpenAI(temperature=1)
    memory = ConversationBufferMemory(return_messages=True)
    conversation = ConversationChain(memory=memory, prompt=prompt, llm=chat_llm)

    response = conversation.predict(input="Let's Start")
    game_update = game_update_parser.parse(response)
    return game_update


@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}


@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}
