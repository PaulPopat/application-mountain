export default {
  get is_dev() {
    return process && process.env.DEVELOPMENT === "true";
  }
};
