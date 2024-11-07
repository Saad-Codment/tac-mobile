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

  first_name: yup
    .string()
    .required('Please enter your first name.')
    .max(100, 'Name must be less than 100 characters.')
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name.')
    .min(2, 'Name must be atleast 2 characters.')
    .max(50, 'Name must be of 50 characters.'),
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

const eventCreateSchema = yup.object().shape({
  eventTitle: yup
    .string()
    .required('Please enter the event title.')
    .max(50, 'Name must be less than 50 characters.')
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid name.'),
  eventImg: yup.mixed().required('Event image is required'),
  eventStartDate: yup.date().required('Event start date is required'),
  eventStartTime: yup.string().required('Event start time is required'),
  eventEndDate: yup.date().required('Event end date is required'),
  eventEndTime: yup.string().required('Event end time is required'),
  eventLocation: yup.string().required('Event location is required'),
  eventType: yup.string().required('Event type is required'),
  privateEvent: yup
    .boolean()
    .required('Specify if the event is private or not'),
  eventAssociation: yup.string().required('Event association is required'),
  eventCircuit: yup.string().required('Event circuit is required'),
  evnetTour: yup.string().required('Event tour is required'),
  evnetConfirm: yup.boolean().required('Event confirmation is required'),
  perfEventList: yup
    .array()
    .of(
      yup.object().shape({
        title: yup
          .string()
          .required('Event title is required in performance list'),
        date: yup.date().required('Event date is required in performance list'),
        time: yup
          .string()
          .required('Event time is required in performance list'),
      }),
    )
    .min(1, 'At least one performance event is required'),
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
  eventCreate: yupResolver(eventCreateSchema),
};

export default Schemas;
