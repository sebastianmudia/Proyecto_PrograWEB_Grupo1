import fondo_ulima from '../../assets/sede_ulima.jpg'

const styles = {
        container: {
            width: '90vw',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${fondo_ulima})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            padding: '30px'
        },

        logo: {
            width: '50px',
            height: 'auto',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '12px',
            opacity: '0.7'
            },

        card: {
            width: '100%',
            maxWidth: '420px',
            background: '#ffffff',
            borderRadius: '4px',
            padding: '28px',
            color: '#333333',
            fontFamily: "'Montserrat', sans-serif"
        },

        title: {
            marginBottom: '20px',
            fontSize: '1.6rem',
            textAlign: 'center',
        },

        label: {
            display: 'block',
            marginBottom: '4px',
            fontWeight: '600',
            color: '#444444'
        },

        input: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '14px',
            border: '1px solid #dcdcdc',
            marginBottom: '12px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease'
        },

        button: {
            width: '100%',
            padding: '14px 16px',
            background: '#ff5117',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '20px'
        },

        subButton: {
            width: 'auto',
            background: 'none',
            color: '#000000',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px',
            fontFamily: "'Montserrat', sans-serif",
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
        }        

    };


export default styles