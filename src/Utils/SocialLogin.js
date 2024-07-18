import auth from '@react-native-firebase/auth';
// import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import {appleAuth} from '@invertase/react-native-apple-authentication';
import {sha256} from 'react-native-sha256';
import {Platform} from 'react-native';

export const faceBookLogin = async () => {
  // if (Platform.OS === 'android') {
  //   LoginManager.setLoginBehavior('web_only');
  // }
  // Attempt login with permissions
  // const result = await LoginManager.logInWithPermissions([
  //   'public_profile',
  //   'email',
  // ]);
  // console.log('result', result);
  // if (result.isCancelled) {
  //   throw 'User cancelled the login process';
  // }
  // // Once signed in, get the users AccesToken
  // const data = await AccessToken.getCurrentAccessToken();
  // if (!data) {
  //   throw 'Something went wrong obtaining access token';
  // }
  // // Create a Firebase credential with the AccessToken
  // const facebookCredential = auth.FacebookAuthProvider.credential(
  //   data.accessToken,
  // );
  // // Sign-in the user with the credential
  // const {user} = await auth().signInWithCredential(facebookCredential);
  // return user;
};

export const appleIdlogin = async () => {
  // Start the sign-in request
  // if (!appleAuth.isSupported)
  //   throw new Error(
  //     'AppleAuth is not supported on the device. Currently Apple Authentication works on iOS devices running iOS 13 or later',
  //   );
  // const appleAuthRequestResponse = await appleAuth.performRequest({
  //   requestedOperation: appleAuth.Operation.LOGIN,
  //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  // });
  // if (!appleAuthRequestResponse.identityToken)
  //   throw new Error('Apple Sign-In failed - no identify token returned');
  // const {
  //   identityToken,
  //   nonce,
  //   fullName: {givenName, familyName},
  // } = appleAuthRequestResponse;
  // const token = auth.AppleAuthProvider.credential(identityToken, nonce);
  // const {additionalUserInfo} = await auth().signInWithCredential(token);
  // return {
  //   token,
  //   name: `${givenName || ''} ${familyName || ''}`,
  //   identityToken,
  //   isNewUser: additionalUserInfo.isNewUser,
  // };
};

export const googleLogin = async () => {
  console.log('isdvbjksdbj');
  const logOutWithGoogle = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('logOutWithGoogle');
  };

  const hasPlayService = await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });
  if (!hasPlayService) throw new Error('play services not available');
  const isSignIn = GoogleSignin.hasPreviousSignIn();
  if (isSignIn) await logOutWithGoogle();
  console.log('isSIngIN ', isSignIn);
  const {idToken, user} = await GoogleSignin.signIn();
  console.log('tpken', idToken, user);
  const token = auth.GoogleAuthProvider.credential(idToken);
  const {additionalUserInfo} = await auth().signInWithCredential(token);

  return {...token, ...user, isNewUser: additionalUserInfo?.isNewUser};
};

export const PhoneNumberLogin = async phoneNumber => {
  // Handle the button press
  try {
    const {confirm} = await auth().signInWithPhoneNumber(phoneNumber);
    return confirm;
  } catch (error) {
    console.log('eror', error);
  }
};

export const verifyCode = async ({confirm, code}) => {
  try {
    await confirm(code);
  } catch (error) {
    console.log('Invalid code.');
  }
};

export const forgotPasswordServices = async email =>
  auth().sendPasswordResetEmail(email);

export const emailSignUp = async ({email, password}) => {
  console.log('dffs', email, password);
  const data = await auth().createUserWithEmailAndPassword(email, password);
  return data;
};

export const emailLogin = async ({email, password}) => {
  const data = await auth().signInWithEmailAndPassword(email, password);
  return data;
};
