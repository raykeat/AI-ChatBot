import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Tooltip,
    Divider
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import FlexBetween from "./FlexBetween.jsx";
import WidgetWrapper from "./WidgetWrapper.jsx";
import { useEffect, useState } from "react";
import './mainchat.css';


const LeftSideBar = ()=>{

    //useTheme hook is a utility provided by Material-UI that allows you to 
    //access the current theme object in your React components
    //(theme object is set up using ThemeProvider)
    const theme = useTheme();

    const main = theme.palette.primary.main;
    const primaryDark = theme.palette.primary.dark;
    const primaryLight = theme.palette.primary.light;
    const neutralLight = theme.palette.neutral.light;

    const [chatSummaries, setChatSummaries] = useState([]);

    //function to fetch chatSummaries from backend database
    const fetchChatSummaries = async() =>{

        try{
            const response = await fetch('http://localhost:6001/retrievechats/', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const jsonresponse = await response.json();
            //console.log("Chat Summaries for left navigation bar: ", jsonresponse.rows);
            setChatSummaries(prevChatSummaries => [
                ...jsonresponse.rows.filter(newSummary => (
                  !prevChatSummaries.some(existingSummary => existingSummary.id === newSummary.id)
                )),
                ...prevChatSummaries,
              ]);
              
            console.log("Chat summaries: ", chatSummaries);
        }

        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchChatSummaries();
    },[]);

    useEffect(()=>{
        console.log(chatSummaries);
    }, [chatSummaries]);

    return (
        <Box alignItems="center">
            <WidgetWrapper height="93vh">

                <FlexBetween top="5vh" gap="1rem">
                    <Typography color={main} fontSize="0.1 rem" >
                        Ray's Chat App
                    </Typography>

                    <img 
                        style={{ objectFit: "cover", borderRadius: "50%"}} 
                        src="/90549chatbot-4071274_1920.jpg" 
                        height = "30px"
                        width = "30px"
                    >
                    </img>
                </FlexBetween>


                <FlexBetween marginTop="1vh">

                    <WidgetWrapper
                        sx={{
                            backgroundColor: neutralLight,
                            borderRadius: "7px", 
                            padding:"0.1rem 0.3rem"
                        }}
                    >
                        <IconButton>
                            <Typography>
                                + New Chat
                            </Typography>
                        </IconButton>
                    </WidgetWrapper>
                    
                    <IconButton>
                        <Menu />
                    </IconButton>

                </FlexBetween>

                <Divider sx={{marginTop:"4px", marginBottom:"2px"}} />

                <Box className="side-bar-container">
                        
                    {chatSummaries.map((chatSummary, index) =>{

                        return(
                            <WidgetWrapper
                                sx={{
                                    borderRadius: "7px", 
                                    padding:"0.1rem 0.3rem"
                                }}
                                key={index}
                            >
                                <IconButton>
                                    <Typography>
                                        {chatSummary.summary}
                                    </Typography>
                                </IconButton>
                            </WidgetWrapper>
                        )
                    })}
                
                </Box>



                <Box position="fixed" bottom="5vh">
                    <Typography color={primaryDark} marginBottom="0.5rem"
                        sx={{ "&:hover": {cursor: "pointer", color: main}}}
                    >
                        Theme
                    </Typography>
                    <Typography color={primaryDark} marginBottom="0.5rem"
                        sx={{ "&:hover": {cursor: "pointer", color: main}}}
                    >
                        Settings
                    </Typography>
                    <Typography color={primaryDark} marginBottom="0.5rem"
                        sx={{ "&:hover": {cursor: "pointer", color: main}}}
                    >
                        Feedback
                    </Typography>
                    <Typography color={primaryDark}
                        sx={{ "&:hover": {cursor: "pointer", color: main}}}
                    >
                        About & Privacy
                        {/*https://zapier.com/blog/best-ai-chatbot/#huggingchat*/}
                        {/*https://github.com/AIAdvantage/chatgpt-api-youtube/blob/main/01%20chatgpt%20simple*/}
                    </Typography>
                </Box>

            </WidgetWrapper>
        </Box>
    );

}

export default LeftSideBar;