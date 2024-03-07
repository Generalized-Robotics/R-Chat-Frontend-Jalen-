// auth.js
import { auth,signInWithEmailAndPassword} from './firebaseConfig';

function login(email, password) {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // User logged in successfully
          const user = userCredential.user;
          console.log('User logged in:', user);
          resolve(user);
        })
        .catch((error) => {
          // Handle login error
          console.error('Error logging in:', error);
          reject(error.message);
        });
    });
  }

function logout() {
  auth.signOut()
    .then(() => {
      // User signed out successfully
      console.log('User signed out');
    })
    .catch((error) => {
      // Handle logout error
      console.error('Error signing out:', error);
    });
}

export { login, logout };
