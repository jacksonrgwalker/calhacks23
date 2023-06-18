from typing import List

from fastapi import FastAPI
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import (HumanMessagePromptTemplate,
                               SystemMessagePromptTemplate)

from models import CharSelection, GameUpdate
from prompts import (human_message_prompt_template,
                     system_message_prompt_template)

game_update_parser = PydanticOutputParser(pydantic_object=GameUpdate)

system_message_prompt = SystemMessagePromptTemplate.from_template(
    system_message_prompt_template
)

human_message_prompt = HumanMessagePromptTemplate.from_template(
    human_message_prompt_template,
)

app = FastAPI()


@app.put("/game/start")
async def start_game(char_selection: CharSelection):
    d = CharSelection
    # sys_msg = system_message_prompt.format(
    return "game started"

@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}

@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}

