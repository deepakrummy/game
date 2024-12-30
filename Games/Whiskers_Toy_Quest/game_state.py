class WhiskersGameState:
    def __init__(self, whiskers_choices):
        self.whiskers_choices = whiskers_choices
        self.current_state = 'intro'

    def get_current_stage_info(self):
        """Retrieve the current stage's information."""
        return self.whiskers_choices.get_stage_info(self.current_state)

    def transition_to_next_state(self, choice):
        """Move to the next state based on the user's choice."""
        current_info = self.whiskers_choices.get_stage_info(self.current_state)
        next_states = current_info.get('next_state', {})
        if choice in next_states:
            self.current_state = next_states[choice]
            return True
        return False