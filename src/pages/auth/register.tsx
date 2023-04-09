import { Link } from "react-router-dom";
import appRoutes from "../../routes/routes";


const Register = () => {
    return (
        <div className="auth-page register-page-img-background">
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
                                type="text"
                                placeholder="Votre nom d'utilisateur"
                                id="username"
                            />
                        </div>
                    </div>
                    <div className="auth-form-content">
                        <label htmlFor="email" className="auth-form-label">
                            Email
                        </label>
                        <div className="auth-form-content-input">
                            <i className="fa-regular fa-user custom-app-icon"></i>
                            <input
                                type="email"
                                placeholder="Votre adresse mail"
                                id="email"
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
                            />
                        </div>
                    </div>

                    <div className="auth-form-content">
                        <label
                            htmlFor="password_confirm"
                            className="auth-form-label"
                        >
                            Confirmez le mot de passe
                        </label>
                        <div className="auth-form-content-input">
                            <i className="fa-solid fa-lock custom-app-icon"></i>
                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                id="password_confirm"
                            />
                        </div>
                    </div>
                </div>
                <div className="auth-btn-container">
                    
                    <Link to={appRoutes.LOGIN} className="auth-btn-empty">Annuler</Link>
                    <button type="submit" className="auth-btn-full">
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
