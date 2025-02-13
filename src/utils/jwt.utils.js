import jwt from 'jsonwebtoken'



export const signToken = ({data, secretKey, options}) => {
    return jwt.sign(data, secretKey, options)
}


export const verifyToken = ({token, secretKey} = {}) => {
    return jwt.verify(token, secretKey)
}