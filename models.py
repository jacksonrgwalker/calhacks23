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

    @validator("player_message")
    def player_message_must_be_string(cls, v):
        if not isinstance(v, str):
            raise TypeError("player_message must be a string")
        return v

    @validator("inventory")
    def inventory_must_be_list(cls, v):
        if not isinstance(v, list):
            raise TypeError("inventory must be a list")
        return v

    @validator("player_stats")
    def player_stats_must_be_list(cls, v):
        if not isinstance(v, list):
            raise TypeError("player_stats must be a list")

        # must be length 3
        if len(v) != 3:
            raise ValueError("player_stats must be length 3")

        # must be integers
        for stat in v:
            if not isinstance(stat, int):
                raise TypeError("player_stats must be a list of integers")
        return v

    @validator("action_options")
    def action_options_must_be_list(cls, v):
        if not isinstance(v, list):
            raise TypeError("action_options must be a list")

        # must be length 3
        if len(v) != 3:
            raise ValueError("action_options must be length 3")

        # must be strings
        for option in v:
            if not isinstance(option, str):
                raise TypeError("action_options must be a list of strings")
        return v

    @validator("can_rest")
    def can_rest_must_be_bool(cls, v):
        if not isinstance(v, bool):
            raise TypeError("can_rest must be a bool")
        return v

    @validator("can_heal")
    def can_heal_must_be_bool(cls, v):
        if not isinstance(v, bool):
            raise TypeError("can_heal must be a bool")
        return v

class CharSelection(BaseModel):
    history: str
    trait: str
    location: str
    goal : str
    item: str

