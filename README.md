# ☕ Tea-Making Interactive Web App

An interactive, humorous tea-making simulation where the user makes tea step-by-step, receives witty feedback from a chai wala (tea master), and experiences playful animations like steam cooling before sipping.

---

## 🎯 Basic Details

**Project Name:** Tea-Making Interactive Web App  
**Team Name:** [Your Team Name]  

### Team Members
- **Team Lead:** Deepak PV - College of Engineering
- **Member 2:**  Aadith Pacheni - College of Engineering

---

## 📜 Project Description

A gamified tea-making experience:
- Users choose tea type, milk, spice, sugar, and brew time.
- A chai wala character teases the user with humorous responses from the database or AI.
- Brewing and cooling animations make the experience engaging.
- Includes a branching story mode and conversation loop.

---

## 🛠 Technologies Used

### For Software
- **Languages:** HTML, CSS, JavaScript
- **Libraries:** None (vanilla JS) + OpenRouter AI API
- **Tools:** Browser-based runtime

---

## 🔄 Workflow

### Description
1. User starts a new conversation or tea-making session.
2. System shows first question or brewing option.
3. User selects an option / adjusts sliders.
4. App checks inputs and responds with chai wala’s witty comment.
5. Brewing animation plays (steam effect).
6. Cooling logic waits before sipping.
7. User sips tea and rates experience.
8. Option to restart conversation or tea-making process.

### Diagram (Mermaid Example)

```mermaid
flowchart TD
    Start([Start Conversation]) --> Q1[Show First Question or Tea Option]
    Q1 --> UserChoice[User makes a choice / adjusts sliders]
    UserChoice --> Check[Validate input & get witty reply]
    Check --> Brew[Play brewing animation + steam effect]
    Brew --> Cool[Wait for cooling time]
    Cool --> Sip[User sips tea]
    Sip --> Rate[User rates the tea]
    Rate --> Restart{Restart?}
    Restart -- Yes --> Q1
    Restart -- No --> End([End Session])
