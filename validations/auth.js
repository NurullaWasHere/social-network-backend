const validator = require('express-validator');

const {body} = validator;
const registerValidation = [
    body('email').isLength( {min: 3}),
    body('password').isLength( { min: 5}),
    body('fullName').isLength( { min: 3}),
];

const loginValidation = [
    body('email').isEmail(),
    body('password').isLength( { min: 5}),
];

const postValidation = [
    body('text').isLength( { min: 5}).isString(),
    body('imageUrl').optional().isString(),
];

module.exports = {registerValidation, loginValidation, postValidation};