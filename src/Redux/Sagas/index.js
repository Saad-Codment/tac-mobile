import {all} from 'redux-saga/effects';
import Auth_Saga from './AuthSaga';
import contentSaga from './contentSaga';
// import RecentLocationSaga from './QuestionSaga';
// import questionSaga from './QuestionSaga';

function* rootSaga() {
  yield all([Auth_Saga(), contentSaga()]);
  // yield all([Auth_Saga(), questionSaga()]);
}

export default rootSaga;

// import {all} from 'redux-saga/effects';
// import Auth_Saga from './AuthSaga';
// import contentSaga from './contentSaga';
// // import RecentLocationSaga from './QuestionSaga';
// // import questionSaga from './QuestionSaga';

// function* rootSaga() {
//   yield all([Auth_Saga(), contentSaga()]);
//   // yield all([Auth_Saga(), questionSaga()]);
// }

// export default rootSaga;
