import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import './SignupForm.css'; // Importing the CSS file for this component

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUserResponse = await authService.signup(formData);
      props.setUser(newUserResponse.user);
      navigate('/');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  const { username, password, passwordConf } = formData;

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <p className="error-message">{message}</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="name"
            value={username}
            name="username"
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={isFormInvalid()} className="btn btn-primary">Sign Up</button>
          <Link to="/">
            <button type="button" className="btn btn-secondary">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;