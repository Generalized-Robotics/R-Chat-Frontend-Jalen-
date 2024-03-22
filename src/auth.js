// auth.js
import { auth,signInWithEmailAndPassword,sendPasswordResetEmail ,getUserByEmail  } from './firebaseConfig';

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

function getUid(){
return auth.currentUser.uid
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


function reset(email) {
  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent successfully!');
        resolve();
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        reject(error.message);
      });
  });
}


// Function to disable user account


export { login, logout, reset, getUid };
