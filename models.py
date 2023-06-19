from langchain.prompts import (
    PromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
from typing import List

class GameUpdate(BaseModel):
    player_message: str = Field(description="message that the player will see")
    inventory: List[str] = Field(description="list of items in the player's inventory")
    player_stats: List[int] = Field(
        description="the player's stats (health, energy, gold)"
    )
    action_options: List[str] = Field(
        description="list of the player's action options in order"
    )
    can_rest: bool = Field(description="whether the player can rest at the moment")
    can_heal: bool = Field(description="whether the player can heal at the moment")

    generate_image: bool = Field(
        description="whether to generate an image of the game state"
    )
    image_prompt: str = Field(
        description="prompt to generate the image of the game state"
    )

class CharSelection(BaseModel):
    background: str
    trait: str
    location: str
    goal : str
    item: str

