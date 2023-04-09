import { Link } from 'react-router-dom';
import appRoutes from '../../routes/routes';

const Login = () => {
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
                                type="text"
                                placeholder="Votre adresse mail"
                                id="username"
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
                            />
                            <button type="submit" className="auth-btn-submit">
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
