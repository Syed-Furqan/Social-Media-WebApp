import { Button } from "@mui/material"

const MyButton = (props) => {
    return (
        <Button 
            variant="contained"
            {...props}
            sx={{
                textTransform: 'inherit',
                ...props.sx
            }}
        />
    )
}

export default MyButton;