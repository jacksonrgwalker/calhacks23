from typing import List

from pydantic import BaseModel, Field

class CharSelection(BaseModel):
    background: str
    trait: str
    location: str
    goal: str
    item: str

class AIGameUpdate(BaseModel):
    player_message: str = Field(description="message that the player will see")
    inventory: List[str] = Field(description="list of items in the player's inventory")
    player_stats: List[int] = Field(
        description="the player's stats (health, energy, gold)"
    )
    action_options: List[str] = Field(
        description=(
            "list of the player's action options in order"
            "options should be brief but descriptive and about 5-10 words long"
        )
    )
    can_rest: bool = Field(
        description=(
            "whether the player can rest at the moment"
            "Player cannot rest in combat or if they have full energy."
        )
    )
    can_heal: bool = Field(
        description=(
            "whether the player can heal at the moment."
            "Player can heal if they have a healing item in their inventory or have healing abilities."
            "Player cannot heal if they have full health."
        )
    )

    image_prompt: str | None = Field(
        description=(
            "a visual description of the player's surroundings or other characters."
            "Fed into the image generator to create an image of the scene."
        )
    )

    generate_image: bool = Field(
        description=(
            "Whether to generate an image of the scene or not."
            "True if something exciting or visually interesting is happening."
        )
    )

    previous_messages: List[dict] | None = Field(
        description=(
            "list of previous messages in the conversation."
            "Used to generate the next message."
        )
    )
    char_selection: CharSelection | None = Field(description="the player's character selection")

class PlayerGameUpdate(BaseModel):
    player_move: str = Field(description="the player's move. Could be a chosen action, or a custom message.")
    previous_messages: List[dict] | None = Field(
        description=(
            "list of previous messages in the conversation."
            "Used to generate the next AI message."
        )
    )
    char_selection: CharSelection = Field(description="the player's character selection")
