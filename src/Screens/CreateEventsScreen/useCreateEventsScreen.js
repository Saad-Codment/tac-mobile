const useCreateEventsScreen = ({navigate}) => {
  const currentDate = new Date();

  const dynamicRoute = (screenName, screenData) =>
    navigate(screenName, screenData);

  return {currentDate, dynamicRoute};
};
export default useCreateEventsScreen;
