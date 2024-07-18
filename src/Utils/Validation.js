import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const passwordSchema = {
  password: yup
    .string()
    .required('Please Enter your password.')
    .max(25, 'Password must be less than 25 characters.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
  confirm_password: yup
    .string()
    .required('Confirm password is required.')
    .oneOf([yup.ref('password'), null], 'Password must match.'),
};
const number = yup.object().shape({
  number: yup.string().required('Please Enter your number.'),
  // .typeError('Please Enter your number'),
});

const signUpschema = yup.object().shape({
  email: yup
    .string()
    // .email('Email must be valid')
    .max(50, 'Email must be valid.')
    .required('Please enter your email.')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email.',
    ),

  name: yup
    .string()
    .required('Please enter your first name.')
    .max(100, 'Name must be less than 100 characters.')
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name.')
    .min(2, 'Name must be atleast 2 characters.')
    .max(50, 'Name must be of 50 characters.'),
  company_name: yup.string(),
  last_name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter valid last name.'),
  ...passwordSchema,
});
const logInUpschema = yup.object().shape({
  email: yup
    .string()
    // .email('Email must be valid')
    .max(50, 'Email must be valid.')
    .required('Please enter your email.')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email.',
    ),
  password: yup.string().required('Please Enter your password.'),
});
const forgotSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('Please enter your email.')
    .max(50, 'Please enter valid email.'),
});
const verificationSchema = yup.object().shape({
  reset_code: yup
    .string()
    .required('Please enter your verification code.')
    .min(6, 'Verification code must be atleast 6 characters.')
    .max(6, 'Verification code must be of 6 characters.'),
});
const resetPasswordScheme = yup.object().shape({
  password: yup
    .string()
    .required('Please enter your password.')
    .max(25, 'Password must be less than 25 characters.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Please enter valid password.',
    ),

  new_password: yup
    .string()
    .required('Please enter your new password.')
    .max(25, 'Password must be less than 25 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Your password does not match.',
    ),
});

const addUsernameScheme = yup.object().shape({
  username: yup.string().required('Please enter name.'),
});

const editProfileScheme = yup.object().shape({
  name: yup
    .string()
    .required('Please enter your first name.')
    .max(100, 'Name must be less than 100 characters.')
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name.')
    .min(2, 'Name must be atleast 2 characters.')
    .max(50, 'Name must be of 50 characters.'),
  last_name: yup.string().required('Please enter your last name.'),
  company_name: yup
    .string()
    .required('Please enter your Company Name.')
    .max(100, 'Name must be less than 100 characters.')
    .min(2, 'Name must be atleast 2 characters.')
    .max(50, 'Name must be of 50 characters.'),
  email: yup
    .string()
    .email('Email must be valid.')
    .required('Please enter your email.'),
});
const demoKitSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be valid.')
    .required('Please enter your email.'),
  first_name: yup
    .string()
    .required('Please enter your first name.')
    .max(100, 'Name must be less than 100 characters.')
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name.')
    .min(2, 'Name must be atleast 2 characters.')
    .max(50, 'Name must be of 50 characters.'),
  last_name: yup
    .string()
    .required('Please enter your last name.')
    .max(100, 'Name must be less than 100 characters.')
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name.')
    .min(2, 'Name must be atleast 2 characters.')
    .max(50, 'Name must be of 50 characters.'),
  company: yup.string().required('Please enter your company.'),
  phone: yup.string().required('Please enter your number.'),
  country: yup.string().required('Please enter your country.'),
  state: yup.string().required('Please enter your state.'),
  zip_code: yup.string().required('Please enter zip code.'),
  address: yup.string().required('Please enter Your address.'),
  city: yup.string().required('Please enter Your city.'),
});

const Schemas = {
  signUp: yupResolver(signUpschema),
  logIn: yupResolver(logInUpschema),
  forgot: yupResolver(forgotSchema),
  newPassword: yupResolver(resetPasswordScheme),
  verification: yupResolver(verificationSchema),
  username: yupResolver(addUsernameScheme),
  editProfile: yupResolver(editProfileScheme),
  demoKit: yupResolver(demoKitSchema),
};

export default Schemas;
