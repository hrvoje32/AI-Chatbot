from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# Validates the user's input for selecting an exercise
class ValidateExerciseSelection(Action):
    def name(self) -> Text:
        # Returns the unique identifier for this action
        return "validate_exercise_selection"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Processes the user's exercise selection and validates it against the expected choices
        exercise_option = tracker.latest_message['text']

        if exercise_option in ["1", "2", "3"]:
            return [SlotSet("exercise_option", exercise_option)]
        else:
            dispatcher.utter_message(text="Please select a valid exercise option: 1, 2, or 3.")
            return [SlotSet("exercise_option", None)]

# Initiates the selected exercise
class ActionStartExercise(Action):
    def name(self) -> Text:
        # Returns the unique identifier for this action
        return "action_start_exercise"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict]:
        # Sends the initial message to start the chosen exercise
        exercise_option = tracker.get_slot("exercise_option")

        exercise_messages = {
            "1": "Starting meditation exercise. When you're ready, type 'next' or 'start'.",
            "2": "Starting emotional support exercise. When you're ready, type 'next' or 'start'.",
            "3": "Starting relaxation technique. When you're ready, type 'next' or 'start'."
        }

        message = exercise_messages.get(exercise_option, "Invalid exercise option. Please select a valid option.")
        dispatcher.utter_message(text=message)
        return []

# Manages the transition to the next step in the selected exercise
class ActionHandleNextStep(Action):
    def name(self) -> Text:
        # Returns the unique identifier for this action
        return "action_handle_next_step"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict]:
        # Provides the next step in the exercise based on the current step and selected option
        current_step = tracker.get_slot("current_step") or 0
        exercise_option = tracker.get_slot("exercise_option")

        steps_messages = get_exercise_steps(exercise_option)

        if current_step + 1 <= len(steps_messages):
            next_step = current_step + 1
            step_message = steps_messages[next_step]
            dispatcher.utter_message(text=step_message)
            return [SlotSet("current_step", next_step)]
        else:
            dispatcher.utter_message(text="You've completed the exercise! Feel free to share another stress issue or say 'goodbye' to end our session.")
            return [SlotSet("current_step", 0)]

# Restarts the current exercise
class ActionRestartExercise(Action):
    def name(self) -> Text:
        # Returns the unique identifier for this action
        return "action_restart_exercise"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict]:
        # Resets the exercise to its initial state and notifies the user
        dispatcher.utter_message(text="Restarting your chosen exercise. When you're ready, type 'next' or 'start'.")
        return [SlotSet("current_step", 0)]

def get_exercise_steps(option: Text) -> Dict[int, Text]:
    # Returns a dictionary of steps for the given exercise option
    if option == "1":
        return {
            1: "Meditation Step 1: Close your eyes and focus on your breath for 5 minutes.\n Type 'next' or 'start' when done.",
            2: "Meditation Step 2: Imagine a peaceful place and immerse yourself in that scene.\n Type 'next' or 'start' when done.",
            3: "Meditation Step 3: Listen to a guided meditation and follow the instructions.\n Type 'next' or 'start' when done."
        }
    elif option == "2":
        return {
            1: "Emotional Support Step 1: Write down your feelings in a journal and reflect on them.\n Type 'next' or 'start' when done.",
            2: "Emotional Support Step 2: Reach out to a trusted friend or family member and share your thoughts.\n Type 'next' or 'start' when done.",
            3: "Emotional Support Step 3: Practice self-compassion by saying kind words to yourself.\n Type 'next' or 'start' when done."
        }
    elif option == "3":
        return {
            1: "Relaxation Step 1: Progressive muscle relaxation - tense and relax each muscle group in your body.\n Type 'next' or 'start' when done.",
            2: "Relaxation Step 2: Practice deep breathing exercises for 5 minutes.\n Type 'next' or 'start' when done.",
            3: "Relaxation Step 3: Listen to calming music and focus on the melodies.\n Type 'next' or 'start' when done."
        }
    return {}

