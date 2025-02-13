



export const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        const schemaKeys = Object.keys(schema)

        const Errors = []
        for(const key of schemaKeys){
            const validationResult = schema[key].validate(req[key], {abortEarly: false}).error
            
            if(validationResult){
                Errors.push(...validationResult.details)
            }
        }
        if(Errors.length){
            return res.status(400).json({message: 'Validation error', error: Errors})
        }
        next()
    }
}


// {
//     value: {
//       username: 'Yousef Adel',
//       email: 'yousefadel.dev@gmail.com',
//       password: 'Yousefadel123@',
//       confirmPassword: 'Yousefadel123@',
//       phone: '+201140095400',
//       age: 25,
//       isPublic: true
//     },


//     error: [Error [ValidationError]: "confirmPaswword" is required. "confirmPassword" is not allowed. "age" is not allowed] {
//       _original: {
//         username: 'Yousef Adel',
//         email: 'yousefadel.dev@gmail.com',
//         password: 'Yousefadel123@',
//         confirmPassword: 'Yousefadel123@',
//         phone: '+201140095400',
//         age: 25
//       },
//       details: [ [Object], [Object], [Object] ]
//     }
// }