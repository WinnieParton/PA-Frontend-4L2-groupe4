const Forgot = () => {
    return (
        <div className="auth-page forgot-page-img-background">
            <div className="auth-card">
                <div className="auth-logo">LOGO</div>
                <div className="auth-form">
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
                        <div className="auth-btn-container">
                            <button type="submit" className="auth-btn-full">
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgot;
