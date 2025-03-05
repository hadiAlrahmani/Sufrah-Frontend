import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import './SigninForm.css'; // Import the CSS file for styling

const SigninForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signin(formData);
      props.setUser(user);
      navigate('/');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  return (
    <main className="signin-container">
      <h1>Log In</h1>
      {message && <p className="error-message">{message}</p>}
      <form autoComplete="off" onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            autoComplete="off"
            id="username"
            value={formData.username}
            name="username"
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Log In</button>
          <Link to="/">
            <button type="button" className="cancel-btn">Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SigninForm;