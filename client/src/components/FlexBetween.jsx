import { Box } from "@mui/material";
import { styled } from "@mui/system";


{/*You're using the basic Box component from Material-UI as a starting point 
and then applying your own custom CSS styles to it using the styled function. 
This allows you to create a new component (FlexBetween in this case) 
that inherits the functionality of Box while also having your specified styles applied. 
This is a powerful and flexible way to create reusable styled components in your application. */}
const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
})

export default FlexBetween;