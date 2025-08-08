# MY CHAI 🎯

## Teasing Chai Wala

*Team Name:* Catalyst Crew  

### Team Members
- *Team Lead:* Deepak P V - College of Engineering, Trikaripur  
- *Member 2:* Aadith Pacheni - College of Engineering, Trikaripur

---

## Project Description
MY CHAI is a website which lets you chat with a chai wala, who he will be the one choosing what you want

---

## The Problem (that doesn't exist)
Teaching everyone how much they have to improve in their tea making skills

---

## The Solution (that nobody asked for)
We made a chai wala who can not only teach you but also tease you. I suppose its gonna be friendly.

---

## Technical Details

### Technologies/Components Used

#### For Software:
- *Languages used:* HTML,CSS,JS 
- *Frameworks used:* React  
- *Libraries used:* React built in libraries  
- *Tools used:* npm, VS code, GitHub, etc.   

---

## Implementation

### For Software:

# Diagram

```mermaid
flowchart TD
    Start([Start Conversation]) --> Q1[Show First Question from DB]
    Q1 --> U1[User Sends Reply]
    U1 --> Fetch[Fetch teasing reply from DB based on input]
    Fetch --> ShowReply[Display Chai Wala's teasing response]
    ShowReply --> NextQ[Load next question from DB]
    NextQ --> Limit{Conversation limit reached?}
    Limit -- No --> U1
    Limit -- Yes --> EndChat[End Conversation: Show restart option]
    EndChat --> Restart{Start new conversation?}
    Restart -- Yes --> Q1
    Restart -- No --> Stop([Conversation Over])
