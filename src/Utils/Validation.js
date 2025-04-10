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

// Helper function to parse time strings into Date objects for comparison
const parseTimeString = timeString => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const currentDate = new Date();

const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Adds 1 day in milliseconds

const eventCreateSchema = yup.object().shape({
  eventTitle: yup
    .string()
    .required('Please enter the event title.')
    .max(50, 'Name must be less than 50 characters.'),
  eventImg: yup.mixed().required('Event image is required'),
  eventPrice: yup.mixed().required('Event price is required'),
  eventStartDate: yup
    .date()
    .required('Event start date is required')
    .default(currentDate),
  eventStartTime: yup
    .date()
    .required('Event start time is required')
    .default(currentDate),
  eventEndDate: yup
    .date()
    .required('Event end date is required')
    .test(
      'is-after-start',
      'End date must be after start date',
      function (value) {
        const {eventStartDate} = this.parent;
        return !eventStartDate || !value || value >= eventStartDate;
      },
    )
    .default(nextDay),
  eventEndTime: yup
    .date()
    .required('Event end time is required')
    .test(
      'is-after-start-time',
      'End time must be after start time',
      function (value) {
        const {eventStartTime, eventStartDate, eventEndDate} = this.parent;

        if (
          eventStartDate &&
          eventEndDate &&
          eventStartDate.getTime() === eventEndDate.getTime()
        ) {
          if (eventStartTime && value) {
            const startTime = parseTimeString(eventStartTime);
            const endTime = parseTimeString(value);
            return endTime > startTime;
          }
          return true;
        }
        return true; // No need to validate if dates are different
      },
    ),
  // .default(currentDate),
  eventLocation: yup.object().shape({
    locationName: yup.string().required('Event location Name is required'),
    coords: yup.object().shape({
      latitude: yup.string().required('Please select locaiton'),
      longitude: yup.string().required('Please select locaiton'),
    }),
  }),

  eventType: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required('Please select event type'),
        name: yup.string().required('Please select event type'),
      }),
    )
    .min(1, 'At least one event type is required'),

  privateEvent: yup.boolean().required('Specify the event type'),
  eventAssociation: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      name: yup.string(),
    }),
  ),
  eventCircuit: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        name: yup.string(),
      }),
    )
    .min(1, 'At least one event circuit is required'),
  evnetTour: yup.string().required('Specify the event tour'),
  eventConfirm: yup.boolean().required('Event confirmation is required'),
  eventSync: yup.boolean(),
  perfEventList: yup.array(),
  // .of(
  //   yup.object().shape({
  //     title: yup.string().required('Event title is required'),
  //     date: yup.date().required('Event date is required'),
  //     startTime: yup.string().required('Start time is required'),
  //     endTime: yup.string().required('End time is required'),
  //   }),
  // )
  // .min(1, 'At least one performance event is required'),
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
