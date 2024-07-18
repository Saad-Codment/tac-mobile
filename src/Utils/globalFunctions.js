/**
 * The function `getSingleCharacter` takes a text input and returns the first character in uppercase.
 * @returns The function `getSingleCharacter` takes a `text` parameter and returns the first character
 * of the text in uppercase.
 */
const getSingleCharacter = text => {
  let letter = text?.charAt(0).toUpperCase();
  return letter;
};

export {getSingleCharacter};
