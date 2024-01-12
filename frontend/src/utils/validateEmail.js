const validateEmail = (email) => {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.trim())
    return { valid: false, errMsg: "Please enter your email!" };
  if (!isValidEmail.test(email))
    return { valid: false, errMsg: "Please enter a valid email!" };
  return { valid: true };
};

export default validateEmail;
