/* It's a class that has a method that sets a reference to the navigation object, and another method
that navigates to a route */
class Navigation {
  ref = null;

  setRef = navigationRef => (this.ref = navigationRef);

  navigate = (route, param) => this.ref?.navigate(route, param);

  goBack = () => this.ref.goBack();

  getCurrentRoute = () => {
    return this.ref;
  };
}

export default new Navigation();
