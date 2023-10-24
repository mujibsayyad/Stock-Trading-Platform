import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

// login validation rules
export const signinValidationRules = () => {
  return [
    check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please enter a valid email address'),

    check('password')
      .trim()
      .customSanitizer((value) => {
        return value.replace(/\s+/g, '');
      }),
  ];
};

// signup validation rules
export const signupValidationRules = () => {
  return [
    check('fullname')
      .notEmpty()
      .trim()
      .escape()
      .isString()
      .withMessage('Full Name is required'),

    check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Provide a valid email address'),

    check('password')
      .trim()
      .customSanitizer((value) => {
        return value.replace(/\s+/g, '');
      })
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),

    check('confirmPassword')
      .trim()
      .customSanitizer((value) => {
        return value.replace(/\s+/g, '');
      })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password does not match');
        }
        return true;
      }),
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
