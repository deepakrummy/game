import customtkinter as ctk
import os
from tkinter import Image
from PIL import Image, ImageTk

class GameGUI:
    def __init__(self, master, game_state, whiskers_choices):
        self.master = master
        self.master.title("Whiskers Toy Quest")
        self.master.geometry("800x600")

        # Save game state and choices
        self.game_state = game_state
        self.whiskers_choices = whiskers_choices

        # Configure grid layout
        self.master.grid_rowconfigure(0, weight=1)
        self.master.grid_rowconfigure(1, weight=1)
        self.master.grid_columnconfigure(0, weight=1)
        self.master.grid_columnconfigure(1, weight=1)

        # Title label
        self.title_label = ctk.CTkLabel(self.master, text="Whiskers Toy Quest",
                                        font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.grid(row=0, column=0, columnspan=2, pady=10)

        # Left frame for button and image
        self.left_frame = ctk.CTkFrame(self.master)
        self.left_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=20)

        # Story label
        self.story_label = ctk.CTkLabel(self.left_frame, text="", wraplength=300, justify="left",
                                        font=ctk.CTkFont(size=14))
        self.story_label.pack()

        self.image_label = ctk.CTkLabel(self.left_frame, text="", width=400, height=300)
        self.image_label.pack(pady=20, padx=20)

        # Right frame for story and input
        self.right_frame = ctk.CTkScrollableFrame(self.master, width=400, height=500)
        self.right_frame.grid(row=1, column=1, sticky="nsew", padx=20, pady=20)

        # Question label
        self.question_label = ctk.CTkLabel(self.right_frame, text="", wraplength=300, font=ctk.CTkFont(size=14))
        self.question_label.pack()

        # Input field
        self.user_input = ctk.CTkEntry(self.right_frame, placeholder_text="Type your choice here", width=350)
        self.user_input.pack(pady=20)
        self.user_input.bind("<Return>", self.handle_input)
        self.user_input.configure(state="disabled")

        # Start the game
        self.start_game()

    def get_asset_path(self, filename):
        """Get the full path to the asset file."""
        return os.path.join("assets", filename)

    def start_game(self):
        """Start the game by displaying the intro story."""
        self.update_stage_description()
        self.user_input.configure(state="normal")

    def display_next_char(self, text, callback):
        """Display the next character in a given text."""
        if hasattr(self, '_current_text'):  # Ensure continuation between calls
            current_text = self._current_text
        else:
            current_text = ""

        if len(current_text) < len(text): # If there are more characters to display
            next_char = text[len(current_text)] # Get the next character
            self._current_text = current_text + next_char # Append the next character
            self.story_label.configure(text=self._current_text) # Update the label
            self.master.after(50, lambda: self.display_next_char(text, callback)) # Call the function again
        else:
            delattr(self, '_current_text') # Remove the attribute
            callback() # Call the callback function

    def update_stage_description(self):
        """Update the stage description and question."""
        stage_info = self.game_state.get_current_stage_info()
        if stage_info:
            self.display_next_char(stage_info['scene_desc'], self.enable_input)
            self.update_image(stage_info['image'])
            self.question_label.configure(text=stage_info['question'])

    def handle_input(self, event):
        """Handle the user input."""
        user_input = self.user_input.get().strip()
        if user_input:
            self.user_input.delete(0, "end") # Clear the input field
            if self.game_state.transition_to_next_state(user_input): # Transition to the next state
                self.update_stage_description() # Update the stage description
            else:
                self.story_label.configure(text="Invalid choice. Try again.") # Display an error message

    def enable_input(self):
        """Enable the user input field."""
        self.user_input.configure(state="normal")

    def update_image(self, image_path):
        """Loads and updates the image in the GUI."""
        img_path = self.get_asset_path(image_path)
        try:
            img = Image.open(img_path)
            img_resized = ctk.CTkImage(img, size=(350, 350))
            self.image_label.configure(image=img_resized, text="")
            self.image_label.image = img_resized
        except FileNotFoundError:
            print(f"Error: Image file not found: {img_path}")
            self.image_label.configure(image='', text="Image not found")
            self.image_label.image = None