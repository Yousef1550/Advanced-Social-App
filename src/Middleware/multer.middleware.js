import multer from "multer";
import fs from 'fs'




// will mot give it (req, res, next) as parameters, because multer is predefined middleware, we do not dreate it

export const MulterLocal = (destinationPath = 'general', allowedExtentions = []) => {
    // creating the folder if not exists
    const destinationFolder = `Assets/${destinationPath}`
    if(!fs.existsSync(destinationFolder)){
        fs.mkdirSync(destinationFolder, {recursive: true}) // allow creating nested folders
    }

    // diskStroage or memoryStorage
    const storage = multer.diskStorage({
        // destination
        destination: function(req, file, cb) {          
            cb(null, destinationFolder)
        },

        // filename
        filename: function(req, file, cb) {
            console.log(file);  // file data before uploading
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '__' + file.originalname)                
        }
    })

    // Have the priority to execute first, before destination and filename
    const fileFilter = (req, file, cb) => {
        if(allowedExtentions.includes(file.mimetype)){
            console.log('++++++++>', file.mimetype);
            
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }
    // file filter must be before storing the file
    const upload = multer({fileFilter, storage})

    return upload       // to use it's methods in the router
}



export const MulterCloud = (allowedExtentions = []) => {
    const storage = multer.diskStorage({})

    const fileFilter = (req, file, cb) => {
        if(allowedExtentions.includes(file.mimetype)){
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }
    // file filter must be before storing the file
    const upload = multer({fileFilter, storage})

    return upload       // to use it's methods in the router
}
