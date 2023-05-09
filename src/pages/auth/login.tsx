import { Link, useNavigate } from 'react-router-dom';
import appRoutes from '../../routes/routes';
import { useState } from 'react';
import axios from 'axios';
type loginParameter = {
    email: String | any;
    password: String | any;
};
const loginUser = async (data: loginParameter) => {
    let user;
    if (data.email !== null || data.password !== null) {
        user = await axios.post('http://localhost:8080/user/login', data); 
    }
    else{
        console.log('Renseignez tous les champs');
    }

    return user;
    
      
};
const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
     const navigate = useNavigate();
    function setToken(userToken: String) {
        localStorage.setItem('auth', JSON.stringify({token : userToken, status : true}));
      }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await loginUser({
            email,
            password,
        });
        setToken(user.data.token)

        if(user){
          return  navigate(appRoutes.DASHBOARD_HOME)
        }
    };
    return (
        <div className="auth-page login-page-img-background">
            <div className="auth-card">
                <div className="auth-logo">LOGO</div>
                <div className="auth-form">
                    <div className="auth-form-content">
                        <label htmlFor="username" className='auth-form-label'>Nom d'utilisateur</label>
                        <div className="auth-form-content-input">
                            <i className="fa-regular fa-user custom-app-icon"></i>
                            <input
                                type="email"
                                placeholder="Votre adresse mail"
                                id="email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth-form-content">
                        <label htmlFor="password" className='auth-form-label'>Mot de passe</label>
                        <div className="auth-form-content-input">
                            <i className="fa-solid fa-lock custom-app-icon"></i>
                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" className="auth-btn-submit" onClick={handleSubmit}>
                                <i className="fa-solid fa-angle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

               <div className="auth-card-link">
               <Link to={appRoutes.FORGOT}>
                    Vous avez oublié votre mot de passe ?
                </Link>
                <Link to={appRoutes.REGISTER}>
                    Pas encore de comtpe ? Rejoignez-nous !
                </Link>
               </div>
            </div>
        </div>
    );
};

export default Login;
