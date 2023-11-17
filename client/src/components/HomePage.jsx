import { Box, useMediaQuery, IconButton } from "@mui/material";
import { useState } from "react";
import { Typography } from "@mui/material";
import LeftSideBar from "./LeftSideBar";
import MainChat from "./MainChat";
import WidgetWrapper from "./WidgetWrapper";
import { Menu } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';



//HomePage React functional component
const HomePage = ()=>{
    const isLaptopScreen = useMediaQuery("(min-width: 1000px)");
    const [menuOpen, setMenuOpen] = useState(false);
    

    const changeMenu = ()=>{
        setMenuOpen((prevMenuState)=>!prevMenuState);
    }

    return(

        <Box
            width="100vw"
            gap="0.5rem"
            height="100vh"
            display = "flex"
            //{isLaptopScreen ? "flex" : "block"}
            padding="1rem 2%"
        >

            {/*Left sidebar for user to access all the chats*/}
            {isLaptopScreen && (
                <Box flexBasis = "20%">
                    <LeftSideBar />
                </Box>
            )}

            {!isLaptopScreen && (
                menuOpen ? (
                    <div>
                        <Box flexBasis = "20%" display="flex" flexDirection="row">
                            <LeftSideBar />
                            <IconButton>
                                <CloseIcon onClick={changeMenu}/>
                            </IconButton>
                        </Box>
                        
                    </div>
                ):(
                    <Box flexBasis = "5%" display="flex"  alignItems="flex-start">
                        <IconButton>
                            <Menu sx={{ fontSize: '30px' }} onClick={changeMenu}/>
                        </IconButton>
                    </Box>
                )
            )}
            

            {/* Content of current chat */}
            <Box flexBasis = {isLaptopScreen ? "80%" : "95%"} display="flex" alignItems="center" justifyContent="center">
                <MainChat />
            </Box>

        </Box>

    );
}

export default HomePage;