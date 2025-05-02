import logoImg from '../assets/logo-sasbinf.png';
// Optional: Import CSS Modules if you have styles
// import styles from './LoginPage.module.css';

function LoginPage() {
  return (
    // Optional: Add a class from CSS Modules if needed
    // <div className={styles.loginContainer}>
    <div>
      {/* Add the img tag */}
      <img
        src={logoImg} // Use the imported variable here
        alt="SasbINF"
        style={{ width: '16em', height: 'auto', marginBottom: '20px' }} // Optional: Add styles directly or use CSS Modules
      />

      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
