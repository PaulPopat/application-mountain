export default {
  get is_dev() {
    return (
      process &&
      process.mainModule &&
      process.mainModule.filename.indexOf("app.asar") === -1
    );
  }
};
