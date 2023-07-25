import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appRoutes from "../../routes/routes";
import { signup } from "../../service/frontendService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
    if (!name) {
      formIsValid = false;
      newErrors.name = "Username is required";
    }
    if (!role) {
      formIsValid = false;
      newErrors.role = "Role is required";
    }
    if (password && password != password_confirm) {
      formIsValid = false;
      newErrors.password = "Password must match with confirm password";
    }

    setErrors(newErrors);
    return formIsValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = await signup({
          name,
          email,
          password,
          password_confirm,
          role,
        });

        if (user) {
          return navigate(appRoutes.LOGIN);
        }
      } catch (error) {
        setErrorMessage(error.data);
      }
    }
  };

  return (
    <div className="auth-page register-page-img-background">
      <div className="auth-card">
        <div className="auth-logo">LOGO</div>
        <div className="auth-form">
          {errorMessage && (
            <h3 className="text-danger text-center">
              <strong>Password or Email incorrect</strong>
            </h3>
          )}
          <div className="auth-form-content">
            <label htmlFor="name" className="auth-form-label">
              Nom d'utilisateur
            </label>
            <div>
              <i className="fa-regular fa-user custom-app-icon"></i>
              <input
                type="text"
                placeholder="Votre nom d'utilisateur"
                id="name"
                name="name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && (
              <span className="text-danger" style={{ fontSize: "13px" }}>
                {errors.name}
              </span>
            )}
          </div>
          <div className="auth-form-content">
            <label htmlFor="email" className="auth-form-label">
              Email
            </label>
            <div>
              <i className="fa-regular fa-user custom-app-icon"></i>
              <input
                type="email"
                placeholder="Votre adresse mail"
                id="email"
                name="email"
                className="form-control"
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
            <label htmlFor="email" className="auth-form-label">
              Rôle
            </label>
            <div>
              <select
                name="role"
                id="role"
                onChange={(e) => setRole(e.target.value)}
                className="form-control"
              >
                <option value="PLAYER">Joueur</option>
                <option value="DEVELOPPER">Développeur</option>
              </select>
            </div>
            {errors.role && (
              <span className="text-danger" style={{ fontSize: "13px" }}>
                {errors.role}
              </span>
            )}
          </div>

          <div className="auth-form-content">
            <label htmlFor="password" className="auth-form-label">
              Mot de passe
            </label>
            <div>
              <i className="fa-solid fa-lock custom-app-icon"></i>
              <input
                type="password"
                placeholder="Votre mot de passe"
                id="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <span className="text-danger" style={{ fontSize: "13px" }}>
                {errors.password}
              </span>
            )}
          </div>

          <div className="auth-form-content">
            <label htmlFor="password_confirm" className="auth-form-label">
              Confirmez le mot de passe
            </label>
            <div>
              <i className="fa-solid fa-lock custom-app-icon"></i>
              <input
                type="password"
                placeholder="Votre mot de passe"
                id="password_confirm"
                name="password_confirm"
                className="form-control"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            {errors.password_confirm && (
              <span
                className="text-danger"
                style={{
                  marginBottom: "10px",
                  fontSize: "13px",
                }}
              >
                {errors.password_confirm}
              </span>
            )}
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
