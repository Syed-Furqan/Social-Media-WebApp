import './Mostpopular.css'
import { Avatar } from '@mui/material';

const Mostpopular = ({popular, showpopularProfile}) => {
    return (
        <div className="popular" onClick={showpopularProfile}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                {popular.profilePic ? <Avatar alt="Remy Sharp" src={popular.profilePic} sx={{width: '40px', height: '40px'}}/> : 
                <Avatar sx={{ bgcolor: 'brown' }}>{popular.username[0]}</Avatar>}
                <div className='popularInfo'>
                    <h4 style={{margin: 0}}>{popular.username}</h4>
                </div>
            </div>
            <div className='popularFollowers'>
                {`${popular.length}k`}
            </div>
        </div>
    );
}

export default Mostpopular;