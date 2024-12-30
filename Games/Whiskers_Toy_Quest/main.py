import customtkinter as ctk

from game import GameGUI
from game_state import WhiskersGameState
from whiskers_choices import WhiskersChoices

if __name__ == "__main__":
    root = ctk.CTk()
    root.title("Whiskers Toy Quest")
    root.geometry("800x600")

    whiskers_choices = WhiskersChoices() # Create an instance of WhiskersChoices
    game_state = WhiskersGameState(whiskers_choices) # Create an instance of WhiskersGameState
    gui = GameGUI(root, game_state, whiskers_choices) # Create an instance of GameGUI

    root.mainloop() # Start the main event loop