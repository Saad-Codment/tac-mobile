const getCredentials = () => {
  if (__DEV__)
    return {
      baseURL: 'https://theappforcowboys.com/tac-backend/api',
      imageURL: 'https://tac-app-bucket.s3.us-east-2.amazonaws.com/',
    };
  else {
    console.log = () => {};
    return {
      baseURL: 'https://theappforcowboys.com/tac-backend/api',
      imageURL: 'https://tac-app-bucket.s3.us-east-2.amazonaws.com/',
    };
  }
};

export const {baseURL, imageURL} = getCredentials();

export const apendUrl = url => {
  return baseURL + url;
};
export const imageUrl = url => {
  return url != null
    ? imageURL + url
    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  // : 'https://res.cloudinary.com/dd6tdswt5/image/upload/v1684830799/UserImages/mhysa2zj0sbmvnw69b35.jpg';
};

export const privacyUrl = 'https://theappforcowboys.com/privacy_policy';
export const termsUrl = 'https://theappforcowboys.com/terms_and_conditions';
export const aboutUrl = 'https://theappforcowboys.com/about_us';

export const MapAPIKey = 'AIzaSyD3C_yNoWPJmiN95CFI2brf72kJ2iOmRHY';

export const registerUrl = '/signup';
export const loginUrl = '/login';
export const VerifyUserUrl = '/verify';
export const allAssociatesUrl = '/setup/associations';
export const allEventTypeUrl = '/setup/event-types';
export const onBoardConpleteUrl = '/on-board';
export const allEventCircuitUrl = 'setup/circuits';
export const createEventUrl = '/events/store';
export const getEventDatesUrl = '/events/dates';
export const getEventByDatesUrl = '/events/get-with-date';
export const getEventDetailsUrl = '/events/';
export const getSuggestedFriendsUrl = '/friends/suggestions';
export const getMyFriendsUrl = '/friends/list?';
export const editProfileUrl = '/profile-update';
export const createPostUrl = '/posts/store';
export const sendFriendReqUrl = '/friend-request/send/';
export const acceptFriendReqUrl = '/friend-request/accept-request/';
export const rejectFriendReqUrl = '/friend-request/reject-request/';
export const homeSuggestedFriendsUrl = '/friends/suggestions-home';
export const getFriendReqUrl = '/friend-request/check/requests';
export const getAllNotificationsUrl = '/get-notifications';
export const allUpComingEventsUrl = '/home/upcoming-events';
export const allFriendEventsUrl = '/home/friends-events';
export const allSuggestedEventsUrl = '/home/suggested-events';
export const likeUnlikeUrl = '/react/like/';
export const getEventsCommentUrl = '/events/comments/';
export const getPostCommentUrl = '/posts/comments/';
export const postCommentUrl = '/react/comment';
export const getUserProfileUrl = '/user/get/';
export const getUserPostsUrl = '/user/posts-and-events/';
export const removeFriendUrl = '/friends/remove/';
export const postLikeUrl = '/react-post/like/';
export const addCommentOnPostUrl = '/react-post/comment';
export const getUserFriendsUrl = '/user/friend-list/';
export const followEventsUrl = '/events/follow-event';
export const unFollowEventsUrl = '/events/unfollow-event';
export const searchScreenDataUrl = '/search-screen-data';
export const searchDataUrl = '/user/search?search=';
export const getReasonsUrl = '/reports/fetch-reasons';
export const reportEventUrl = '/reports/report-event';
export const reportPostUrl = '/reports/report-post';
export const SavePhoneNumberUrl = '/contacts/save-user-phone';
export const SendVerficatioUrl = '/contacts/send-verification-code';
export const verifyNumberUrl = '/contacts/validate-verification-code';
export const sendNumberToServerUrl = '/contacts/send-mobile-numbers';
export const sendUpdatedAtUrl = '/contacts/match-data';
export const isPrivateUrl = '/privacy';
export const homeTimeLineUrl = '/home/timeline?page=';
export const homeUpcomingEventsUrl = '/home/upcoming-events-home';
export const sharePostUrl = '/posts/share';
export const shareEventUrl = '/events/share';
export const updateEventUrl = '/events/update/';
export const deleteEventUrl = '/events/delete/';
export const updatePostUrl = '/posts/update/';
export const deletePostUrl = '/posts/delete/';
export const GetChatListUrl = '/chat/users';
export const SendChatNotificationUrl = '/chat/notification';
export const WhenUserInAndOutChatUrl = '/chat/user-in-chat';
export const contactFormUrl = '/inquiry/store';
export const getInquiryUrl = '/inquiry/terms';
export const AfterSubBuyUrl = '/subscriptions/validate-receipt';
export const StartTrialUrl = '/subscriptions/trial-start';
export const getEventsUrl = '/events/get';
export const getMyAssociationsUrl = '/get-associations';
export const getMutalFriendsUrl = '/user/mutual-list/';

export const blockUserUrl = '/block/block-user';
export const unBlockUserUrl = '/block/unblock-user';
export const getBlockedUserUrl = '/block/blocked-users';

export const fcmTokenUrl = 'add-fcm-token';
export const deleteAccUrl = 'auth/account-delete';
export const logoutUrl = 'auth/logout';
