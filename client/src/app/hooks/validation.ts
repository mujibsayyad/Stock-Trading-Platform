interface UserInput {
  fullname?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

type FormType = 'login' | 'signup';

const validateUserData = (
  input: UserInput,
  type: FormType
): ValidationResult => {
  let errors: Record<string, string> = {};

  // email validation
  if (!input.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(input.email)) {
    errors.email = 'Email is invalid';
  }

  // password validation
  if (!input.password) {
    errors.password = 'Password is required';
  }

  if (type === 'signup') {
    if (!input.fullname || input.fullname.trim().length < 1) {
      errors.fullname = 'Full Name is required';
    }
    if (input.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!input.confirmPassword || input.password !== input.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: errors,
  };
};

export default validateUserData;
