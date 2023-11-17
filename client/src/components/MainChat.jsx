import { Box, Typography, useTheme } from "@mui/material";
import { InputBase , IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import WidgetWrapper from "./WidgetWrapper";
import FlexBetween from "./FlexBetween";
import { FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './mainchat.css';


const MainChat = ()=>{

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const primaryMain = theme.palette.primary.main;
    const primaryDark = theme.palette.primary.dark;
    const [prompt, setPrompt] = useState('');

    //to store entire chat history for current chat
    const [chatHistory, setChatHistory] = useState([]);
    const [chatSummary, setChatSummary] = useState();
    const [chatId, setChatId] = useState();
    const [newChatCreated, setNewChatCreated] = useState(false);


    //once search bar input field changes, this function will be invoked and set prompt state to be whatever user typed (e.target.value)
    const handleInputChange = (e)=>{
        setPrompt(e.target.value);
    }

    //function that sends user's prompt to ChatGPT to get a response
    const sendPromptToGPT = async ()=>{

        //add user's current prompt to chatHistory local state
        const newUserMessage = {type: "user", message:prompt, saved:false};
        setChatHistory( prevChatHistory =>{
            const newChatHistory = [...prevChatHistory, newUserMessage];
            return newChatHistory;
        });

        //clearing the text in the search bar
        setPrompt('');

        try{

            const response = await fetch("http://localhost:6001/ask/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                //JSON.stringify converts javascript object to JSON-formatted string, before sending data to server
                body: JSON.stringify({ prompt })
            });

            //.json() converts JSON-formatted string received from server into javascript object
            const data = await response.json();
            console.log(data.message);
            console.log(prompt);

            // Remove newlines and special chars before first alphanumeric char
            const cleanedMessage = data.message.replace(/^\W+/, '');

            //add chatbot's response to chatHistory local state
            const newBotMessage = {type: "bot", message:cleanedMessage, saved:false};
            setChatHistory(prevChatHistory =>{
                const newChatHistory = [...prevChatHistory, newBotMessage]
                return newChatHistory;
            });

        }
        catch(error){
            console.log('Error: ', error);
            console.log({prompt});
        }

    }


    //function that gets chatGPT to summarize if user enters input for first time into current chat
    const getGPTSummary = async ()=>{
        const message = "Generate a  10 WORD OR LESS summary (it must be under 10 words and leave regular single spacing between words): "+prompt

        try{
            const response = await fetch('http://localhost:6001/ask/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                //JSON.stringify converts javascript object to JSON-formatted string, before sending data to server
                body: JSON.stringify({prompt:message})
            })

            //.json() converts JSON-formatted string received from server into javascript object
            const summary = await response.json();
            console.log("This is the summary: ", summary.message);

            // Remove newlines and special chars before first alphanumeric char
            const cleanedSummary = summary.message.replace(/^\W+/, '');
            setChatSummary(cleanedSummary);
        }
        catch (error){
            console.log(error);
        }
    }

    //function to insert new chat into Chats table of database
    const insertNewChat = async()=>{

        try{
            if (chatSummary){

                const response = await fetch('http://localhost:6001/newchat/', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    //JSON.stringify converts javascript object to JSON-formatted string, before sending data to server
                    body: JSON.stringify({summary:chatSummary})
                });
                //.json() converts JSON-formatted string received from server into javascript object
                const insertedchat = await response.json();
                console.log("This is a new chat: ", insertedchat);
                setChatId(insertedchat.id);
                setNewChatCreated(true);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    //function to filter out all the unsaved messages in chatHistory
    const filterMessages = ()=>{
        const unsaved = chatHistory.filter(message=>!message.saved);
        return unsaved;
    }


    //function to insert new Messages for a chat into Messages table of the database
    const insertNewMessages = async ()=>{
        const unsavedMessages = filterMessages();
        console.log('These are the unsaved messages: ', unsavedMessages);
        console.log('This is the current chatId', chatId);
         
        try{
            const response = await fetch(`http://localhost:6001/newmessages/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                //JSON.stringify converts javascript object to JSON-formatted string, before sending data to server
                body: JSON.stringify({chatId, unsavedMessages})
            })
            const jsonresponse = await response.json();
            console.log(jsonresponse);

            //Marking these messages in chatHistory as saved
            unsavedMessages.forEach((unsaved_message)=>{
                //finding first index where message in chatHistory === unsaved_message
                const index = chatHistory.findIndex(message => message===unsaved_message);
                chatHistory[index].saved = true;
            })
        }

        catch(error){
            console.log(error);
        }
    }


    const handleKeyDown = (e)=>{
        if (e.key==='Enter'){
            sendPromptToGPT();
        }
        if (e.key==='Enter' && chatHistory.length===0){
            getGPTSummary();
        }
    }


    //useEffect to log chat History whenever it changes
    useEffect(()=>{
        console.log(chatHistory);
    }, [chatHistory]);

    useEffect(()=>{
        if (!chatId){
            insertNewChat();
        }
    }, [chatSummary]);

    useEffect(()=>{
        const unsavedMessages = filterMessages();
        if (chatId && unsavedMessages.length!==0){
            insertNewMessages();
        }
    }, [chatId, chatHistory]);


    return(
        <div>

            <Box className = "chat-container" marginBottom="3px" alignItems="center">
            {chatHistory.map( (chat, index)=>{

                return(
                    chat.type==="user" ? (
                        <WidgetWrapper key={index} width="70vw" marginBottom="4px">
                            <Typography color={primaryMain}>
                                {chat.message}
                            </Typography>
                        </WidgetWrapper>
                    ):
                    (
                        <WidgetWrapper sx={{ backgroundColor: neutralLight }} key={index} width="70vw" marginBottom="2px">
                            <Typography color={primaryDark}>
                                {chat.message}
                            </Typography>
                        </WidgetWrapper>
                    )
                )
            })}

            {/* Default message to be displayed when user hasn't typed any input to the model yet */}
            {/* using conditional && operator */}
            {chatHistory.length === 0 && 
                <Typography>
                    Hi there! Feel free to type a prompt or query, and I will answer it to the best of my abilities!
                </Typography>
            }

            </Box>


            {/*Main Search Bar at the bottom*/}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="15px" gap="3rem"
                padding="0.1rem 1.5rem"
                width="70vw"
                height="10vh"
                position="fixed"
                bottom="5vh"
            >
                <InputBase 
                    placeholder="Send a Message" 
                    style={{ width: "900px" }} 
                    inputProps={{ style: { fontSize: "16px" } }} 
                    value = {prompt}
                    onChange = {handleInputChange}
                    onKeyDown = {handleKeyDown}
                
                />
                <IconButton onClick={sendPromptToGPT} >
                    <FaArrowRight/>
                </IconButton>
            </FlexBetween>
            </Box>
        
        </div>

    )
}

export default MainChat;