import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appRoutes from '../../routes/routes';
import { login } from '../../service/frontendService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function saveToken(userToken: String) {
        localStorage.setItem(
            'auth',
            JSON.stringify({ token: userToken, status: true })
        );
    }
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            saveToken(user.token);
            if (user) {
                return navigate(appRoutes.DASHBOARD_HOME);
            }
        } catch (error) {
            // Handle login error
            console.error('rrrrrrrrrrrrrrrrrrr ' + error);
        }
    };
    return (
        <div className="auth-page login-page-img-background">
            <div className="auth-card">
                <div className="auth-logo">LOGO</div>
                <div className="auth-form">
                    <div className="auth-form-content">
                        <label htmlFor="username" className="auth-form-label">
                            Nom d'utilisateur
                        </label>
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
                        <label htmlFor="password" className="auth-form-label">
                            Mot de passe
                        </label>
                        <div className="auth-form-content-input">
                            <i className="fa-solid fa-lock custom-app-icon"></i>
                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="auth-btn-submit"
                                onClick={handleSubmit}
                            >
                                <FontAwesomeIcon icon={faAngleRight} />
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
