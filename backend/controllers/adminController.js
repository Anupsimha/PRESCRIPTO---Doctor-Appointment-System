// API for addding doctor
const addDoctor = async (req , res) => {
    try {
        const {name , email , password , speciality , degree , experience , about , fess , address} = req.body;
        const imageFile = req.file;

        

    } catch (error) {
        
    }
}

export {addDoctor};