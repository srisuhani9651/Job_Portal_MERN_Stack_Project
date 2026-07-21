import {Company} from '../models/company.model.js'

export const registerCompany = async(req, res) =>{
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({message:"Company Name is required", success: false})
        }

        let company = await Company.findOne({name:companyName})
        if(company){
            return res.status(400).json({message: "You can't register same company", success:false})
        }

        company = await Company.create({
            name: companyName,
            userId : req.id
        })
        return res.status(201).json({message:"Company registered successfully.", company, success:true
         })
    } catch (error) {
        return res.status(400).json({message: error.message, success: false})
    }
}

export const getCompany = async(req,res)=>{
    try {
        const userId = req.id // logged in user id h ye
        const companies = await Company.find({userId})
        if(!companies){
            return res.status(404).json({message:"Companies not found", success: false})
        }
        return res.status(200).json({message:"Companies found successfully",companies, success:true})
    } catch (error) {
        return res.status(500).json({message:error.message, success: false})
    }   
}

export const getCompanyById = async(req, res)=>{
    try {
        const companyId = req.params.id 
        const companyById = await Company.findById(companyId) 
        if(!companyById){
            return res.status(404).json({message:"Company not found", success: false})
        }

        return res.status(200).json({message:"Company found",companyById, success: true})
    } catch (error) {
        return res.status(500).json({message:error.message, success: false})
    }
}

export const updateCompany = async(req,res)=>{
    try {
        const {name, description, website, location} = req.body
        const file = req.file
        //idhar cloudinary aayega

        const updateData = {name, description, website, location}

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true})
        if(!company){
            return res.status(404).json({message:"Company not found", success: false})
        }
        return res.status(200).json({message:"Company information updated", success: true})
    } catch (error) {
        return res.status(500).json({message:error.message, success: false})
    }
}