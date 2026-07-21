import {Application} from '../models/application.model.js'
import { Job } from '../models/job.model.js'

export const applyJob = async(req, res)=>{
    try {
        const userId = req.id
        const jobId = req.params.id
        if(!jobId){
            return res.status(400).json({message: "Job Id is required", success: false})
        }
        // check if the user has already applied for the job or not
        const existingApplication = await Application.findOne({job:jobId, applicant:userId}) // dono match hoge tbhi existing application check hoga
        if(existingApplication){
            return res.status(400).json({message: "You have applied for this job", success: false})
        }
        //check if the job exists
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(400).json({message: "Job not found", success: false})
        }
        //create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        })
        job.application.push(newApplication._id)
        await job.save()
        return res.status(201).json({message: "Job applied successfully", success:true})
    } catch (error) {
         return res.status(500).json({ message: error.message, success: false });
    }
}

export const getAppliedJobs = async(req,res)=>{
    try {
        const userId = req.id
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options: {sort:{createdAt:-1}}, //createdAt for getting everything in sorted order
            populate: {
                path: 'company', // job model me company bhi h isliye we have to give the company path as well
                options: {sort:{createdAt:-1}},
            }
        })
        if(!application){
            return res.status(404).json({message: "No Application", success: false})
        }
        return res.status(201).json({application, success:true})
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

//applicants ko find krne k liye(recruiter will see kitne user ne apply kiya h)
export const getApplicants = async(req, res)=>{
    try {
        const jobId= req.params.id // from this first job find krege, then check krege usme kitne users ne apply kiya h
        const job = await Job.findById(jobId).populate({
            path: 'application',
            options : {sort:{createdAt:-1}},
            populate : {
                path: 'applicant' // application path k andar applicant h (this is called nested populate)
            }
        });
        if(!job){
            return res.status(404).json({message: "No applicant has applied for this role", success: false})
        }
        return res.status(200).json({job, success:true})
    } catch (error) {
         return res.status(500).json({ message: error.message, success: false });
    }
}

// this is for, the applicant has rejected or selected

export const updateStatus = async(req,res)=>{
    try {
        const {status} = req.body
        const applicationId = req.params.id
        if(!status){
            return res.status(400).json({message: "status is required", success: false})
        }
        //find application by applicant Id
        const application = await Application.findOne({_id:applicationId})
        if(!application){
            return res.status(400).json({message: "Application not found", success: false})
        }

        //update status
        application.status = status.toLowerCase();
        await application.save()
        return res.status(200).json({message: "Status updated successfully", success:true})
    } catch (error) {
         return res.status(500).json({ message: error.message, success: false });
    }

}