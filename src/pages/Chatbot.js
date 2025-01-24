import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { TextInputsQueryRequest, AiplatformClient } from '@google-cloud/aiplatform';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [projectId, setProjectId] = useState(''); 
  const [location, setLocation] = useState(''); 
  const [displayName, setDisplayName] = useState(''); 

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (!userInput) return;

    const aiplatformClient = new AiplatformClient();
    const endpoint = aiplatformClient.conversationEndpointPath(projectId, location, displayName);

    const query = new TextInputsQueryRequest({
      textInput: userInput,
    });

    try {
      const [response] = await aiplatformClient.queryConversation(endpoint, query);
      const messages = response.getMessagesList();

      setChatHistory([...chatHistory, { user: true, message: userInput }]);
      setUserInput('');
      messages.forEach((message) => {
        setChatHistory((prevHistory) => [...prevHistory, { user: false, message: message.text }]);
      });
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  useEffect(() => {
    // Replace with your project ID and location
    setProjectId('your-project-id');
    setLocation('us-central1');
    setDisplayName('your-conversation-display-name'); // From Vertex AI
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6">AI Chatbot</Typography>
      <div className="flex flex-col">
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}>
            <Typography variant="body1" className={`p-2 ${message.user ? 'bg-blue-200 rounded-br-md rounded-tl-md' : 'bg-gray-200 rounded-bl-md rounded-tr-md'}`}>
              {message.message}
            </Typography>
          </div>
        ))}
      </div>
      <TextField
        label="Your message"
        value={userInput}
        onChange={handleUserInputChange}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Send
      </Button>
    </div>
  );
};

export default Chatbot;
