import {
  faAngleRight,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appRoutes from "../../routes/routes";
import { login } from "../../service/frontendService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    if (!email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    }
    if (!password) {
      formIsValid = false;
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = await login(email, password);
        if (user) {
          return navigate(appRoutes.DASHBOARD_HOME);
        }
      } catch (error) {
        setErrorMessage(true);
      }
    }
  };
  return (
    <div className="auth-page login-page-img-background">
      <div className="auth-card">
        <div className="auth-logo">LOGO</div>
        <div className="auth-form">
          {errorMessage && (
            <h3 className="text-danger text-center">
              <strong>Password or Email incorrect</strong>
            </h3>
          )}
          <div className="auth-form-content">
            <label htmlFor="username" className="auth-form-label">
              Nom d'utilisateur
            </label>
            <div className="auth-form-content-input">
              <FontAwesomeIcon icon={faUser} className="custom-app-icon" />
              <input
                type="email"
                placeholder="Votre adresse mail"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <span className="text-danger" style={{ fontSize: "13px" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="auth-form-content">
            <label htmlFor="password" className="auth-form-label">
              Mot de passe
            </label>
            <div className="auth-form-content-input">
              <FontAwesomeIcon icon={faLock} className="custom-app-icon" />
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
            {errors.password && (
              <span
                className="text-danger"
                style={{
                  marginBottom: "10px",
                  fontSize: "13px",
                }}
              >
                {errors.password}
              </span>
            )}
          </div>
        </div>

        <div className="auth-card-link">
          <Link to={appRoutes.FORGOT}>
            Vous avez oublié votre mot de passe ?
          </Link>
          <Link to={appRoutes.REGISTER}>
            Pas encore de compte ? Rejoignez-nous !
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
