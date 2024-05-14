import './Logo.css'

const Logo = ({styles, ...props}) => {
    return (
        <div className="logo" style={styles} {...props}>
            Share Space
        </div>
    );
}

export default Logo;