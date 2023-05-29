import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appRoutes from '../../routes/routes';
import { signup } from '../../service/frontendService';

type registerParameter = {
    name: String | any;
    email: String | any;
    password: String | any;
    password_confirm: String | any;
    role: String;
};
const registerUser = async (data: registerParameter) => {
    if (
        data.name === null ||
        data.email === null ||
        data.password === null ||
        data.password_confirm === null
    ) {
        console.log('Renseignez tous les champs');
    }
    if (data.password !== data.password_confirm) {
        console.log('Les mots de passe ne concordent pas.');
    }
    try {
        return await signup(data);
    } catch (error) {
        // Handle login error
        console.error('rrrrrrrrrrrrrrrrrrr ' + error);
    }
};

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await registerUser({
            name,
            email,
            password,
            password_confirm,
            role: 'PLAYER',
        });

        if (user) {
            return navigate(appRoutes.LOGIN);
        }
    };

    return (
        <div className="auth-page register-page-img-background">
            <div className="auth-card">
                <div className="auth-logo">LOGO</div>
                <div className="auth-form">
                    <div className="auth-form-content">
                        <label htmlFor="name" className="auth-form-label">
                            Nom d'utilisateur
                        </label>
                        <div className="auth-form-content-input">
                            <i className="fa-regular fa-user custom-app-icon"></i>
                            <input
                                type="text"
                                placeholder="Votre nom d'utilisateur"
                                id="name"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
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
                                name="password_confirm"
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="auth-btn-container">
                    <Link to={appRoutes.LOGIN} className="auth-btn-empty">
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        className="auth-btn-full"
                        onClick={handleSubmit}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
