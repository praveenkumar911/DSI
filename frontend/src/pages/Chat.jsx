import React, { useState, useEffect, useRef } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showFooter, setShowFooter] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const chatContainerRef = useRef(null);

  // Activity categories 
    const activityCategories = [
      "Educational Activities",
      "Creative & Artistic Activities",
      "Sports & Outdoor Activities",
      "Community & Social Activities",
      "Entertainment & Fun Activities"
    ];

  // Activities organized by category
  const categoryActivities = {
    "Educational Activities": [
      {
        name: "Science Fair",
        description: "Arrange a science fair to encourage creativity and innovation.",
        topics: ["Project ideas", "Judging criteria", "Display setup"],
        suggestions: [
          "Provide a list of project ideas for students.",
          "Arrange for judges to evaluate the projects.",
          "Set up display tables for each project.",
        ],
        plan: "1. Announce the fair. 2. Guide students on projects. 3. Arrange judging. 4. Set up the fair. 5. Award winners.",
      },
      {
        name: "Storytelling Session",
        description: "Host a storytelling session where students share their favorite stories.",
        topics: ["Selecting stories", "Setting the stage", "Engaging the audience"],
        suggestions: [
          "Choose a theme for the stories.",
          "Provide a comfortable seating arrangement.",
          "Encourage audience participation with Q&A.",
        ],
        plan: "1. Decide on a theme. 2. Invite storytellers. 3. Prepare the venue. 4. Host the session. 5. Gather feedback.",
      },
      {
        name: "Debate Competition",
        description: "Organize a debate competition to improve public speaking skills.",
        topics: ["Topic selection", "Team formation", "Judging criteria"],
        suggestions: [
          "Choose thought-provoking topics.",
          "Provide guidelines for constructive debates.",
          "Invite experienced judges.",
        ],
        plan: "1. Select topics. 2. Form teams. 3. Set judging criteria. 4. Host the competition. 5. Award winners.",
      },
      {
        name: "Quiz Competition",
        description: "Arrange a quiz competition to test knowledge and promote learning.",
        topics: ["Question preparation", "Team formation", "Scoring system"],
        suggestions: [
          "Cover diverse subjects in the quiz.",
          "Have clear rules for answering questions.",
          "Use a fair scoring system.",
        ],
        plan: "1. Prepare questions. 2. Form teams. 3. Set up the venue. 4. Host the competition. 5. Award winners.",
      },
      {
        name: "Coding Challenge",
        description: "Host a coding challenge to improve programming skills.",
        topics: ["Problem selection", "Evaluation criteria", "Tool setup"],
        suggestions: [
          "Choose problems suitable for different skill levels.",
          "Provide a clear evaluation rubric.",
          "Set up necessary tools and environments.",
        ],
        plan: "1. Select problems. 2. Set up the environment. 3. Brief participants. 4. Host the challenge. 5. Evaluate solutions.",
      }
    ],
    "Creative & Artistic Activities": [
      {
        name: "Talent Show",
        description: "Organize a talent show where students can showcase their skills.",
        topics: ["Planning the event", "Selecting judges", "Promoting the show"],
        suggestions: [
          "Create a sign-up sheet for participants.",
          "Arrange a rehearsal session before the event.",
          "Provide certificates for all participants.",
        ],
        plan: "1. Set a date and venue. 2. Invite participants. 3. Arrange judges. 4. Promote the event. 5. Host the show.",
      },
      {
        name: "Art Exhibition",
        description: "Organize an art exhibition to display students' artwork.",
        topics: ["Selecting artwork", "Setting up the exhibition", "Promoting the event"],
        suggestions: [
          "Choose a theme for the exhibition.",
          "Provide materials for students to create artwork.",
          "Invite parents and teachers to attend.",
        ],
        plan: "1. Decide on a theme. 2. Collect artwork. 3. Set up the exhibition. 4. Promote the event. 5. Host the exhibition.",
      },
      {
        name: "Poetry Slam",
        description: "Host a poetry slam for students to share their original poems.",
        topics: ["Poem selection", "Performance training", "Audience engagement"],
        suggestions: [
          "Provide guidelines for poem content and length.",
          "Offer workshops on effective poem delivery.",
          "Create a supportive atmosphere for performers.",
        ],
        plan: "1. Announce the event. 2. Collect entries. 3. Prepare performers. 4. Set up the venue. 5. Host the slam.",
      },
      {
        name: "Photography Contest",
        description: "Organize a photography contest to showcase visual creativity.",
        topics: ["Theme selection", "Submission guidelines", "Judging criteria"],
        suggestions: [
          "Choose an inspiring theme for the contest.",
          "Provide clear guidelines for photo submissions.",
          "Invite professional photographers as judges.",
        ],
        plan: "1. Announce the contest. 2. Collect submissions. 3. Evaluate photos. 4. Display entries. 5. Award winners.",
      },
      {
        name: "Short Film Making",
        description: "Host a short film making contest to encourage visual storytelling.",
        topics: ["Script writing", "Filming techniques", "Editing basics"],
        suggestions: [
          "Provide workshops on basic filmmaking.",
          "Set reasonable time limits for film length.",
          "Offer equipment for those who need it.",
        ],
        plan: "1. Announce the contest. 2. Conduct workshops. 3. Support filming. 4. Collect entries. 5. Screen films and award winners.",
      }
    ],
    "Sports & Outdoor Activities": [
      {
        name: "Sports Day",
        description: "Host a sports day with fun games and activities.",
        topics: ["Choosing games", "Organizing teams", "Setting up the venue"],
        suggestions: [
          "Select a variety of games for all skill levels.",
          "Arrange for referees and volunteers.",
          "Provide prizes for winners.",
        ],
        plan: "1. Choose games. 2. Organize teams. 3. Set up the venue. 4. Host the event. 5. Award prizes.",
      },
      {
        name: "Scavenger Hunt",
        description: "Organize a scavenger hunt with fun clues and prizes.",
        topics: ["Creating clues", "Setting up locations", "Organizing teams"],
        suggestions: [
          "Create a list of clues and hiding spots.",
          "Divide students into teams.",
          "Provide small prizes for the winners.",
        ],
        plan: "1. Create clues. 2. Set up locations. 3. Organize teams. 4. Start the hunt. 5. Award prizes.",
      },
      {
        name: "Marathon Race",
        description: "Organize a marathon or fun run for students and staff.",
        topics: ["Route planning", "Safety measures", "Participation incentives"],
        suggestions: [
          "Plan a safe and accessible route.",
          "Arrange for water stations and first aid.",
          "Provide completion certificates for all participants.",
        ],
        plan: "1. Plan the route. 2. Arrange safety measures. 3. Register participants. 4. Host the event. 5. Award completion certificates.",
      },
      {
        name: "Adventure Camp",
        description: "Organize an outdoor adventure camp with various activities.",
        topics: ["Activity selection", "Safety protocols", "Equipment needs"],
        suggestions: [
          "Include activities like hiking, climbing, and orienteering.",
          "Ensure proper safety measures for all activities.",
          "Provide necessary equipment or itemized lists.",
        ],
        plan: "1. Select location and activities. 2. Arrange logistics. 3. Prepare safety protocols. 4. Conduct the camp. 5. Debrief participants.",
      },
      {
        name: "Yoga & Meditation Session",
        description: "Host yoga and meditation sessions for stress relief and mindfulness.",
        topics: ["Session planning", "Instructor selection", "Space setup"],
        suggestions: [
          "Choose appropriate yoga styles for beginners.",
          "Invite experienced instructors.",
          "Create a calm and comfortable environment.",
        ],
        plan: "1. Plan session content. 2. Arrange for instructors. 3. Set up the space. 4. Host the sessions. 5. Gather feedback.",
      }
    ],
    "Community & Social Activities": [
      {
        name: "Community Service Project",
        description: "Plan a community service project like a neighborhood clean-up.",
        topics: ["Choosing a project", "Volunteer recruitment", "Logistics"],
        suggestions: [
          "Identify areas that need cleaning.",
          "Provide gloves and trash bags for volunteers.",
          "Partner with local organizations for support.",
        ],
        plan: "1. Select a project. 2. Recruit volunteers. 3. Gather supplies. 4. Execute the project. 5. Thank participants.",
      },
      {
        name: "Blood Donation Camp",
        description: "Organize a blood donation camp to help local hospitals.",
        topics: ["Medical partnerships", "Donor recruitment", "Venue setup"],
        suggestions: [
          "Partner with local blood banks or hospitals.",
          "Educate potential donors about eligibility.",
          "Create a comfortable and safe environment.",
        ],
        plan: "1. Establish partnerships. 2. Recruit donors. 3. Set up the venue. 4. Host the camp. 5. Follow up with donors.",
      },
      {
        name: "Charity Fundraiser",
        description: "Host a fundraiser for a worthy cause or charity.",
        topics: ["Cause selection", "Fundraising methods", "Fund management"],
        suggestions: [
          "Choose a relatable cause for participants.",
          "Use various fundraising methods (auctions, sales, etc.).",
          "Maintain transparency in fund management.",
        ],
        plan: "1. Select a cause. 2. Plan fundraising activities. 3. Promote the event. 4. Host the fundraiser. 5. Distribute funds.",
      },
      {
        name: "Environmental Awareness Drive",
        description: "Organize an awareness campaign about environmental issues.",
        topics: ["Topic selection", "Campaign planning", "Community engagement"],
        suggestions: [
          "Focus on relevant environmental issues.",
          "Use creative methods to spread awareness.",
          "Encourage community participation and action.",
        ],
        plan: "1. Choose focus issues. 2. Plan campaign activities. 3. Create materials. 4. Execute the campaign. 5. Evaluate impact.",
      },
      {
        name: "Tree Plantation Campaign",
        description: "Organize a tree planting event to improve the environment.",
        topics: ["Site selection", "Tree selection", "Planting logistics"],
        suggestions: [
          "Choose appropriate sites for planting.",
          "Select native tree species.",
          "Arrange for proper planting tools and guidance.",
        ],
        plan: "1. Select sites. 2. Acquire saplings. 3. Organize volunteers. 4. Conduct planting. 5. Plan follow-up care.",
      }
    ],
    "Entertainment & Fun Activities": [
      {
        name: "Dance Competition",
        description: "Organize a dance competition with various styles and categories.",
        topics: ["Category selection", "Judging criteria", "Performance logistics"],
        suggestions: [
          "Include various dance styles and categories.",
          "Establish clear judging criteria.",
          "Provide adequate performance space and equipment.",
        ],
        plan: "1. Decide on categories. 2. Register participants. 3. Arrange judges. 4. Host the competition. 5. Award winners.",
      },
      {
        name: "Music Battle",
        description: "Host a music battle for bands, singers, or instrumentalists.",
        topics: ["Performance format", "Equipment needs", "Audience engagement"],
        suggestions: [
          "Set clear rules for performances (time limits, etc.).",
          "Provide necessary sound equipment.",
          "Encourage audience participation in judging.",
        ],
        plan: "1. Set performance rules. 2. Register participants. 3. Arrange equipment. 4. Host the battle. 5. Select winners.",
      },
      {
        name: "Stand-up Comedy Night",
        description: "Organize a stand-up comedy night for aspiring comedians.",
        topics: ["Content guidelines", "Performance order", "Audience management"],
        suggestions: [
          "Provide clear guidelines for appropriate content.",
          "Arrange a suitable order of performers.",
          "Create a supportive atmosphere for performers.",
        ],
        plan: "1. Set guidelines. 2. Register performers. 3. Arrange the venue. 4. Host the event. 5. Gather feedback.",
      },
      {
        name: "Cultural Fest",
        description: "Host a cultural festival celebrating diversity and traditions.",
        topics: ["Cultural representation", "Activity planning", "Food and decoration"],
        suggestions: [
          "Ensure representation of various cultures.",
          "Include traditional foods, dances, and customs.",
          "Use appropriate decorations for each culture.",
        ],
        plan: "1. Select featured cultures. 2. Plan activities. 3. Arrange food and decorations. 4. Host the festival. 5. Document the event.",
      },
      {
        name: "Treasure Hunt",
        description: "Organize an exciting treasure hunt with challenging clues.",
        topics: ["Clue creation", "Prize selection", "Route planning"],
        suggestions: [
          "Create challenging but solvable clues.",
          "Choose attractive prizes for winners.",
          "Plan a safe and interesting route.",
        ],
        plan: "1. Create clues and map. 2. Hide treasures. 3. Form teams. 4. Host the hunt. 5. Award prizes.",
      }
    ],
  };

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        type: "bot",
        text: "Hello! I can help you organize activities. What type of activities are you interested in?",
        options: activityCategories,
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    // Add user message to the chat
    setMessages((prev) => [
      ...prev,
      { type: "user", text: userInput },
    ]);

    // Process user input
    const lowerCaseInput = userInput.toLowerCase();
    setUserInput("");

    // Always return to the main categories
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Here are the activity categories you can choose from:",
          options: activityCategories,
        },
      ]);
    }, 500);
  };

  const handleOptionClick = (option) => {
    // Check if the option is a category
    if (activityCategories.includes(option)) {
      handleSelectCategory(option);
    } else {
      // Must be an activity
      handleSelectActivity(option);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    
    setMessages((prev) => [
      ...prev,
      { type: "user", text: category },
    ]);

    // Show activities for the selected category
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: `Here are the activities under ${category}:`,
          options: categoryActivities[category].map(activity => activity.name),
        },
      ]);
    }, 500);
  };

  const handleSelectActivity = (activityName) => {
    if (!selectedCategory) return;
    
    setMessages((prev) => [
      ...prev,
      { type: "user", text: activityName },
    ]);

    // Show details for the selected activity
    setTimeout(() => {
      const selected = categoryActivities[selectedCategory].find(
        activity => activity.name === activityName
      );
      
      if (selected) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: `You selected "${selected.name}". Here are some details:`,
            details: {
              description: selected.description,
              topics: selected.topics,
              suggestions: selected.suggestions,
              plan: selected.plan,
            },
            nextAction: {
              text: "Would you like to explore more activities?",
              options: ["Yes, show me more activities", "No, thank you"],
            }
          },
        ]);
      }
    }, 500);
  };

  const handleNextAction = (choice) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: choice },
    ]);

    if (choice === "Yes, show me more activities") {
      // If user wants more activities, show categories again
      setTimeout(() => {
        setSelectedCategory(null);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Here are the activity categories you can choose from:",
            options: activityCategories,
          },
        ]);
      }, 500);
    } else {
      // User is done
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Thank you for exploring activities with me! If you need any other assistance, feel free to ask.",
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Chat Messages Section */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto bg-white p-8 mb-[70px]"
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-lg ${message.type === "user" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"}`}
              style={{ maxWidth: "70%" }}
            >
              {message.text}
              {message.options && (
                <div className="mt-2">
                  {message.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(option)}
                      className="block w-full text-left p-2 my-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {message.details && (
                <div className="mt-4">
                  <h3 className="font-bold">Description:</h3>
                  <p>{message.details.description}</p>
                  <h3 className="font-bold mt-2">Topics:</h3>
                  <ul className="list-disc pl-5">
                    {message.details.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                  <h3 className="font-bold mt-2">Suggestions:</h3>
                  <ul className="list-disc pl-5">
                    {message.details.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                  <h3 className="font-bold mt-2">Plan:</h3>
                  <p>{message.details.plan}</p>
                </div>
              )}
              {message.nextAction && (
                <div className="mt-4">
                  <p>{message.nextAction.text}</p>
                  <div className="mt-2">
                    {message.nextAction.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleNextAction(option)}
                        className="block w-full text-left p-2 my-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-[70px] left-0 w-full bg-gray-100 border-t border-gray-200 p-4 flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Send
        </button>
      </div>

      {/* Conditional Footer */}
      {showFooter && (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg h-[70px] flex items-center justify-around">
          <button className="text-gray-500 hover:text-purple-600 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M9 21V3M15 21V3" />
            </svg>
            <span className="text-sm">Home</span>
          </button>
          <button className="text-gray-500 hover:text-purple-600 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.707 9.707 0 01-4-.812l-4.243 1.061a1 1 0 01-1.235-1.235l1.06-4.243A9.707 9.707 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Chat</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default Chat;