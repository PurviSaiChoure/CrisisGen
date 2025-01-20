from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define agents
template_generator = Agent(
    model=Groq(id="mixtral-8x7b-32768"),
    name="Template Generator Agent",
    role="Generate templates for disaster-related messages.",
    instructions=[
        "Draft a clear, concise message based on the inputs: message type, target audience, and key details.",
        "Ensure the message is structured appropriately for the audience.",
    ],
    markdown=True,
)

validation_agent = Agent(
    model=Groq(id="mixtral-8x7b-32768"),
    name="Validation Agent",
    role="Validate and enhance the generated template.",
    instructions=[
        "Review the generated message for tone, clarity, and audience appropriateness.",
        "Ensure it meets the expected standards for communication during disasters.",
    ],
    markdown=True,
)

multi_ai_agent = Agent(
    team=[template_generator, validation_agent],
    model=Groq(id="mixtral-8x7b-32768"),
    instructions=[
        "Collaborate to generate and refine a disaster-related message.",
        "Template Generator drafts the initial message.",
        "Validation Agent ensures the message is audience-appropriate and well-structured.",
        "Produce the final refined message as output.",
    ],
    markdown=True,
)

# Generate a message using the multi-agent system
def generate_message(message_type, target_audience, key_details):
    query = (
        f"Generate a {message_type.lower()} message for {target_audience.lower()} "
        f"including the following details: {key_details}. Ensure the tone is appropriate "
        f"and the message is actionable."
    )
    response = multi_ai_agent.run(message=query)
    return response

# Terminal testing
if __name__ == "__main__":
    message_type = input("Enter message type (e.g., alert, update, resource request): ")
    target_audience = input("Enter target audience (e.g., citizens, NGOs, government): ")
    key_details = input("Enter specific details to include in the message: ")

    print("\nGenerating Message...\n")
    message = generate_message(message_type, target_audience, key_details)
    print(f"Generated Message:\n\n{message}")
