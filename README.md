# [GeoGenius](https://jolantadjatlova.github.io/geogenius/)

Developer: Jolanta Djatlova ([jolantadjatlova](https://github.com/jolantadjatlova))
## Fully Functional Interactive Quiz Website

A fun, interactive geography quiz game where players can test their knowledge by choosing a difficulty level and answering world geography questions. Built using **HTML, CSS, and JavaScript**.

To view the deployed website click [here](https://jolantadjatlova.github.io/geogenius/).

![screenshot](docs/geogenius_responsive_display.png) 

### Contents

- [UX](#ux)
  - [Website Intentions](#website-intentions)
    - [For the User](#for-the-user)
    - [For the Site Developer](#for-the-site-developer)
  - [User Goals](#user-goals)
  - [User Stories](#user-stories)
- [Agile Development Process](#agile-development-process)
  - [Project Requirements & Scope](#project-requirements--scope)
    - [Requirements](#requirements)
    - [Scope](#scope)
  - [Planning Tools & Workflow](#planning-tools--workflow)
    - [GitHub Projects (Kanban)](#github-projects-kanban)
    - [GitHub Issues](#github-issues)
    - [MoSCoW Prioritization](#moscow-prioritization)
- [Architecture & Design](#architecture--design)

- [Wireframes](#wireframes)
- [Design Choices](#design-choices)
  - [Typography](#typography)
  - [Colour Scheme](#colour-scheme)
  - [Contrast Grid](#contrast-grid)
  - [Images](#images)
  - [Responsiveness](#responsiveness)
- [Features](#features)
  - [Existing Features](#existing-features)
  - [Future Enhancements](#future-enhancements)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
  - [Bugs](#bugs)
  - [Responsiveness Test](#responsiveness-test)
  - [Code Validation](#code-validation)
    - [HTML](#html)
    - [CSS](#css)
  - [User Story Testing](#user-story-testing)
  - [Form Validation Testing](#form-validation-testing)
  - [Lighthouse Testing](#lighthouse-testing)
  - [Browser Testing](#browser-testing)
- [Deployment](#deployment)
  - [To deploy the project](#to-deploy-the-project)
  - [To fork the project](#to-fork-the-project)
  - [To clone the project](#to-clone-the-project)
- [Credits](#credits)
  - [Feedback, advice and support](#feedback-advice-and-support)
  - [Learning help and Resources](#learning-help-and-resources)
  - [Images](#images-1)
  - [Visual Content](#visual-content)
- [Final Tidy-Up](#final-tidy-up)

## UX


### The 5 Planes of UX

#### 1. Strategy

**Purpose**

- Provide an educational yet entertaining quiz for users to test and expand their geography knowledge.

- Deliver quick, replayable gameplay suitable for short study breaks or casual learning.

- Encourage engagement through instant feedback, multiple difficulty levels, and score tracking.

- Offer a polished, accessible interface that makes learning feel rewarding and fun.

**Primary User Needs**

- Quickly understand how to play without needing lengthy instructions.

- Easily choose a difficulty level (Easy, Medium, Hard).

- Receive clear visual feedback for correct and incorrect answers.

- Track progress and performance (score, high scores, results).

- Access the quiz seamlessly on mobile, tablet, or desktop.

- Use a simple feedback form to share opinions or report issues.

**Business/Project Goals**

- Showcase a fully functional JavaScript project demonstrating skills in DOM manipulation, conditionals, arrays, timers, and local storage.

- Implement UX best practices including accessibility (aria attributes, keyboard navigation, responsive design).

- Apply Bootstrap for consistency and efficient responsive layout.

- Create a visually engaging, interactive quiz that could serve educational or recreational purposes.

#### 2. Scope

**Functional Requirements**

- User can enter a username and save it for the session (stored in localStorage).

- User can select from three difficulty levels: Easy, Medium, Hard.

- The quiz fetches questions dynamically from the Open Trivia Database API.

- Each question presents four possible answers (one correct).

- The timer counts down from 20 seconds per question.

- Visual feedback (correct/wrong color) is given instantly after each answer.

- Final score and personalized message are displayed on completion.

- A leaderboard stores the top five high scores locally.

- “Play Again” resets the quiz for a new attempt.

- Feedback form and instructions are accessible via the navigation bar.

**Content Requirements**

- Quiz title, username input, and difficulty descriptions.

- Questions and answers from API data.

- User feedback messages (“Congratulations!” / “Keep trying!”).

- Accessible text labels, aria roles, and color-coded states.

- Iconography for visual reinforcement (✔️ / ❌ / ⏱️).

#### 3. Structure

**Interaction Design**

- The user journey follows a simple linear flow:  
  1. Enter username  
  2. Select difficulty  
  3. Answer timed questions  
  4. View results and leaderboard  
  5. Play again if desired  
- Each step provides instant visual feedback.  
- Questions automatically advance for a smooth, continuous experience.  

**Information Architecture**

- Distinct sections for each stage: *Hero (Start)*, *Quiz*, and *Results*.  
- The navigation bar gives consistent access to *Instructions* and *Feedback*.  
- Layout built using Bootstrap’s grid and flex utilities.  
- Quiz data and scores are stored in memory and persisted in `localStorage`.  

**Navigation Layout**

- A fixed Bootstrap navbar provides quick access to:  
  - **Instructions** (how to play)  
  - **Feedback Form** (user input)  
  - **Home** (GeoGenius title link)  
- The navbar collapses into a mobile-friendly burger menu on smaller screens.  

**User Flow**

1. User lands on the homepage and sees the GeoGenius title and username input.  
2. User saves their name and selects a difficulty level (Easy, Medium, Hard).  
3. The quiz begins with timed multiple-choice questions.  
4. After each answer, visual feedback appears (green/red highlights).  
5. After all questions, the results screen shows the score and leaderboard.  
6. User can submit feedback or start a new quiz. 

#### 4. Skeleton

**Wireframes** 

Wireframes were created using [Balsamiq](https://balsamiq.com/) to map out the layout for mobile, tablet and desktop screens.
![Wireframes](docs/geogenius_wireframes.png)

#### 5. Surface

**Visual Design**

- Color palette inspired by geography and learning — cool blues with bright accent tones.  
- Glassmorphism cards add modern depth and focus.  
- Font Awesome icons enhance clarity without visual clutter.  
- Smooth animations (spinner, transitions) improve engagement.  
- Consistent typography using the **Outfit** font for a clean and readable look.  

**Typography**

- The **Outfit** typeface is used throughout the interface for a modern and approachable appearance.  
- Chosen for its clarity and rounded geometry, it ensures text remains legible across all screen sizes.  
- Font weights (400, 600, 700) establish visual hierarchy between headings, buttons, and body text.  
- The consistent type styling complements the educational and friendly tone of the quiz.

**Colour Scheme**

The colour palette was designed using [Coolors](https://coolors.co/), inspired by the quiz’s hero images and the educational theme.  
It combines soft blues and neutrals to create a calm, focused environment for users.  

![GeoGenius Colour Palette](docs/geogenius-colour-palette.png)

**Contrast Grid**

A contrast grid was used to ensure that text and interactive elements meet accessibility guidelines for contrast and readability across all device types.  

![GeoGenius Contrast Grid](docs/geogenius-contrast-grid.png)

**Responsiveness**

- The layout was designed for desktop and tablet first, then adjusted for smaller screens using max-width media queries.

- Ensures all content remains clear, accessible, and visually balanced across all device sizes. 

**Accessibility**

- High colour contrast for legibility.  
- `aria-live` and `role="status"` attributes ensure updates are announced to assistive technology.  
- Fully keyboard navigable with visible focus states.  
- Clear error messaging and validation for username input.  

## User Goals

- User-friendly navigation and layout.  
- Non-distracting, visually clear background.  
- Opportunity to provide quick feedback via a simple form.  
- Clear instructions written in plain English.  
- Relevant and varied geography questions.  
- Fair and transparent scoring system.  
- Ability to easily replay the quiz or change difficulty levels.  

## User Stories

- As a user, I want to enter my username before starting, so my score feels personal.  
- As a user, I want to choose **Easy**, **Medium**, or **Hard** so the questions suit my ability.  
- As a user, I want to find **clear instructions** or send **feedback** easily.  
- As a user, I want questions loaded from a **live API** so every quiz feels fresh.  
- As a user, I want to see my **final score** when the quiz ends.  
- As a user, I want the game to show a **leaderboard** of the top scores, so I can see how my score compares to others.  
- As a user, I want to see **how far through the quiz** I am.  
- As a user, I want the quiz to work **smoothly on any device**.  
- As a user, I want to click an answer and know **immediately if I was right or wrong**.  

[Back to contents](#contents)

## Agile Development Process

The **GeoGenius** quiz was developed using an **iterative Agile approach**, focusing on building a clear, user-friendly **Minimum Viable Product (MVP)**.  
The workflow was managed through **GitHub Projects** (Kanban board) and **GitHub Issues**, where each user story was assigned a priority using the **MoSCoW** method.  

This ensured that the most essential functionality—such as dynamic question loading, scoring, and responsive design—was developed first, followed by enhancements like the leaderboard and feedback form.

The scope and requirements of the project are detailed in the [5 Planes of UX](#the-5-planes-of-ux) section.

### Planning Tools & Workflow

To stay organised and follow an iterative Agile process, I used the following tools throughout the development of **GeoGenius**:

---

#### GitHub Projects (Kanban)

A **Kanban board** was set up in [GitHub Projects](https://github.com/users/jolantadjatlova/projects/8) to manage all tasks visually.  
Tasks were broken down into **user stories** and categorised by status:  
**To Do → In Progress → Done**

This helped me:

- Track progress easily  
- Stay focused on achievable goals  
- Maintain momentum without feeling overwhelmed  

![GitHub Projects Board](docs/github-gg-project.png)

---

#### GitHub Issues

[GitHub Issues](https://github.com/jolantadjatlova/geogenius/issues) were used to:

- Document **user stories** and **tasks**  
- Break down larger goals into manageable steps  
- Track development progress for key features  

Each issue was assigned a **priority label** using the **MoSCoW method**  
(e.g., *must-have*, *should-have*, *could-have*)  
to help focus on what was most essential for the MVP.

![GitHub Issues](docs/github-gg-issues.png)

---

[Back to contents](#contents)






---

### MoSCoW Prioritization
To prioritize tasks effectively, I applied the **MoSCoW method**:

| **Priority** | **Description** |
|---------------|-----------------|
| **Must Have** | Core quiz functionality including username input, difficulty selection, API question fetch, timer, and scoring system. These features are essential for the quiz to function correctly. |
| **Should Have** | Features that enhance the user experience such as the high score leaderboard (localStorage), responsive design adjustments, and clear feedback/instructions. |
| **Could Have** | Nice-to-have additions like sound effects, improved loading animations, or expanded quiz categories if time allows. |

This ensured a **focused, realistic development process** that stayed aligned with the project’s goals and user needs.

---
[Back to contents](#contents)
                                   
### Images

The background image for GeoGenius were generated using **ChatGPT**.  
It depicts a bright blue sky with global landmarks such as the Eiffel Tower, Big Ben, the Statue of Liberty, and Christ the Redeemer — reflecting the quiz’s geographical theme. 

The playful illustration style with planes, birds, and hot-air balloons adds an educational yet fun atmosphere, while keeping the focus on the quiz interface.  
The image was intentionally designed to be light and non-distracting, ensuring readability of the text and buttons.
---
### Responsiveness

The GeoGenius website adapts seamlessly to different screen sizes using custom CSS media queries.  
The layout, typography, and interactive elements dynamically adjust to ensure usability and visual balance across **mobile**, **tablet**, and **desktop** devices.  

- All buttons, inputs, and quiz cards remain accessible and easy to tap on smaller screens.  
- Text and visual components maintain clarity without overflow or layout shift.  
- Navigation collapses into a hamburger menu for smaller devices, improving accessibility and focus.  

To view detailed responsiveness results, see the [Responsiveness Test](#responsiveness-test).

[Back to contents](#contents)

# Features


## Existing Features


### Future Enhancements


[Back to contents](#contents)

# Technologies Used
   

[Back to contents](#contents)

# Testing
## Bugs

## Responsiveness Test

## Code Validation

### HTML

### CSS


## User Story Testing


## Form Validation Testing


## Lighthouse Testing 


Test for Mobile: 



Test for Desktop:


## Browser Testing


[Back to contents](#contents)

# Deployment

## To deploy the project


## To fork the project

Forking the GitHub repository allows you to create a duplicate of a local repository. This is done so that modifications to the copy can be performed without compromising the original repository.

- Log in to GitHub.
- Locate the repository.
- Click to open it.
- The fork button is located on the right side of the repository menu.
- To copy the repository to your GitHub account, click the button.

## To clone the project

- Log in to GitHub.
- Navigate to the main page of the repository and click Code.
- Copy the URL for the repository.
- Open your local IDE.
- Change the current working directory to the location where you want the cloned directory.
- Type git clone, and then paste the URL you copied earlier.
- Press Enter to create your local clone.

[Back to contents](#contents)

# Credits

#### Feedback, advice and support:

  - [Simen Daehlin](https://github.com/Eventyret "Simen Daehlin")

#### Learning help and Resources


#### Images:


#### Visual Content:


# Final Tidy-Up

[Back to contents](#contents)