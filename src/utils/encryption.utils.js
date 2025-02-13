import CryptoJS from "crypto-js"


export const encryption = async ({value, secretKey} = {}) => {
    return CryptoJS.AES.encrypt(value, secretKey).toString()
}


export const decryption = async ({cipher, secretKey} = {}) => {
    return CryptoJS.AES.decrypt(cipher, secretKey).toString(CryptoJS.enc.Utf8)
}