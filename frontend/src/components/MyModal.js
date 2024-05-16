import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from 'react-responsive';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    p: 4,
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    backgroundColor: '#f7faff',
    borderRadius: '4px'
};

const MyModal = ({open, close, children}) => {
    const isSmallDevice = useMediaQuery({query: '(max-width: 450px)'})

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box style={{...style, width: isSmallDevice ? '330px' : '400px'}}>
                {children}
            </Box>
        </Modal>
    );
}

export default MyModal;