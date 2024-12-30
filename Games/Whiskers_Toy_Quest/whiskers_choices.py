class WhiskersChoices:
    def __init__(self):
        self.choices = { # Dictionary of game choices
            "intro": {
                "image": "living_room.jpg",
                "scene_desc": "Whiskers lost his favorite toy and needs your help to find it! Are you ready to embark on a fun adventure?",
                "question": "Type 'start' to begin the quest.",
                "next_state": {"start": "bedroom"},
            },
            "bedroom": {
                "image": "bedroom.jpg",
                "scene_desc": "Whiskers just had a nap and dreamed about his lost toy. He woke up and found himself in the bedroom. He decides to look for his toy.",
                "question": "You are in Whiskers' bedroom. What would you like to do? Type 'look under the bed' or 'leave the bedroom' and press Enter.",
                "next_state": {
                    "look under the bed": "under_bed",
                    "leave the bedroom": "hallway"
                },
            },
            "under_bed": {
                "image": "bedroom.jpg",
                "scene_desc": "You found a hidden stash of toys under the bed! But none of them are Whiskers' favorite toy.",
                "question": "What would you like to do next? Type 'take toy' or 'leave the bedroom' and press Enter.",
                "next_state": {"take toy": "play_with_toy_ending", "leave the bedroom": "hallway"},
            },
            "hallway": {
                "image": "hallway.jpg",
                "scene_desc": "You are in the hallway. There are several rooms you can explore. But you can also leave the house and go outside.",
                "question": "Where would you like to go? Type 'kitchen', 'living room', or 'leave the house and go outside' and press Enter.",
                "next_state": {"kitchen": "kitchen", "living room": "living_room", "leave the house and go outside":
                    "outside"},
            },
            "kitchen": {
                "image": "eating.jpg",
                "scene_desc": "You are in the kitchen. It smells like food!",
                "question": "What would you like to do? Type 'eat' or 'leave the kitchen' and press Enter.",
                "next_state": {"eat": "eating", "leave the kitchen": "hallway"},
            },
            "living_room": {
                "image": "living_room.jpg",
                "scene_desc": "You are in the living room. It's cozy and quiet.",
                "question": "What would you like to do? Type 'sit on couch' or 'leave the living room' and press Enter.",
                "next_state": {"sit on couch": "sitting_on_couch", "leave the living room": "hallway"},
            },
            "outside": {
                "image": "outside.jpg",
                "scene_desc": "You are outside the house. The sun is shining, and the birds are chirping. You can explore the garden. Look near the tree or by the pond.",
                "question": "What would you like to do? Type 'look near the tree' or 'look by the pond'.",
                "next_state": {"look near the tree": "tree", "look by the pond": "pond"},
            },
            "eating": {
                "image": "eating.jpg",
                "scene_desc": "You are eating food in the kitchen. Yum! But you're so distracted by the food that you forget about the toy. You can continue eating or start over.",
                "question": "What would you like to do next? Type 'continue eating' or 'leave the kitchen' and press Enter.",
                "next_state": {"continue eating": "eating_ending", "leave the kitchen": "hallway"},
            },
            "tree": {
                "image": "tree.jpg",
                "scene_desc": "You look near the tree and find a buried pile of leaves. Underneath, there's a strange hole that looks like it might hold something interesting.",
                "question": "What would you like to do? Type 'dig' to explore the hole or 'go back' to return outside.",
                "next_state": {"dig": "find_toy", "go back": "outside"},
            },
            "pond": {
                "image": "shiny_object.jpg",
                "scene_desc": "You look by the pond and see some ripples in the water. It seems like something shiny is reflecting sunlight near the edge.",
                "question": "What would you like to do? Type 'check shiny object' or 'go back' to return outside.",
                "next_state": {"check shiny object": "shiny_object", "go back": "outside"},
            },
            "find_toy": {
                "image": "find_toy.jpg",
                "scene_desc": "You dig into the hole near the tree and find Whiskers' favorite toy! He purrs happily, his adventure complete.",
                "question": "Congratulations! You've found the toy. Would you like to start a new adventure? Type 'yes' or 'no'.",
                "next_state": {"yes": "intro", "no": "ending"},
            },
            "shiny_object": {
                "image": "shiny_object.jpg",
                "scene_desc": "The shiny object turns out to be a small bell. It's not the toy, but it seems important.",
                "question": "What would you like to do? Type 'take bell' or 'go back'.",
                "next_state": {"take bell": "bell_clue", "go back": "outside"},
            },
            "bell_clue": {
                "image": "whiskers.jpg",
                "scene_desc": "The bell jingles as you hold it. It reminds Whiskers of something. He runs toward the tree, meowing excitedly.",
                "question": "Follow Whiskers? Type 'yes' or 'no'.",
                "next_state": {"yes": "find_toy", "no": "outside"},
            },
            "sitting_on_couch": {
                "image": "sitting_on_couch.jpg",
                "scene_desc": "You sit on the couch, but Whiskers starts to feel sleepy and distracted.",
                "question": "Would you like to keep looking for the toy or take a nap? Type 'keep looking' or 'nap'.",
                "next_state": {"keep looking": "hallway", "nap": "nap_ending"},
            },
            "play_with_toy_ending": {
                "image": "whiskers.jpg",
                "scene_desc": "Whiskers plays with another toy, it's not his favorite. Maybe next time he'll "
                                "find it.",
                "question": "The adventure ends here. Would you like to start over? Type 'yes' or 'no'.",
                "next_state": {"yes": "intro", "no": "ending"},
            },
            "nap_ending": {
                "image": "whiskers.jpg",
                "scene_desc": "Whiskers falls asleep on the couch, dreaming again about his toy. Maybe next time he'll find it.",
                "question": "The adventure ends here. Would you like to start over? Type 'yes' or 'no'.",
                "next_state": {"yes": "intro", "no": "ending"},
            },
            "eating_ending": {
                "image": "eating.jpg",
                "scene_desc": "You decide to keep eating and forget all about the toy. Maybe you'll look for it another time.",
                "question": "Would you like to start the adventure again? Type 'yes' or 'no'.",
                "next_state": {"yes": "intro", "no": "ending"},
            },
            "start_over": {
                "image": "whiskers.jpg",
                "scene_desc": "You decide to start the adventure over from the beginning.",
                "question": "Type 'start' to begin again.",
                "next_state": {"start": "intro"},
            },
            "ending": {
                "image": "ending.jpg",
                "scene_desc": "Thank you for helping Whiskers in his adventure! See you next time!",
                "question": "",
                "next_state": {},
            },
        }


    def get_stage_info(self, state):
        """Returns the information for the given state."""
        return self.choices.get(state, {})
