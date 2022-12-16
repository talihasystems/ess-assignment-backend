const leaveModel = require('../models/leaveModel');
const moment = require('moment'); 
const userModel = require('../models/userModel');

const applyLeave = (async (req,res) => {
    try{
        if(moment(req.body.startDate).isBefore(moment(Date.now())) || 
            moment(req.body.endDate).isBefore(moment(Date.now())) ||
            moment(req.body.endDate).isBefore(req.body.startDate)
        ){
            console.log('in if')
            res.status(400).send({
                message: "Invalid leave reuqest!",
            });
        }else{
            const difference = moment(req.body.endDate).diff(moment(req.body.startDate), 'days', false)
            let user = await userModel.find({email:req.body.email});
            let invalid_request = false;
            for(let leave of user[0].leaves){
                if(leave['leave_Name'] === req.body.leaveType && (leave['availableLeaves'] == 0 || difference >= leave['availableLeaves'])){
                    invalid_request = true;
                }
            }

            if(invalid_request){
                res.status(400).send({
                    message: "Invalid leave reuqest!",
                });
            }else{
                await leaveModel.create(req.body);
                let reduceDays = difference == 0 ? 1*(-1): difference * (-1);
                console.log('reduce days', reduceDays)
                await userModel.findOneAndUpdate({ email:req.body.email, 'leaves.leave_Name': req.body.leaveType }, { $inc: { 'leaves.$.availableLeaves': reduceDays }}).lean({ virtuals: true })
                res.status(200).send({
                    message: "Successfully applied for leave.",
                });
            }
        }
        
    }catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while fetching.",
        });
    }
})

const getLeaves = (async (req, res) => {
    try {
        console.log('her', req.query.email)
        const leaves = await userModel.find({email: req.query.email});
        res.status(200).json(leaves)
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while fetching.",
        });
    }
})

const getUserLeaves = (async (req, res) => {
    try {
        const leaves = await leaveModel.find({email: req.query.email});
        let dataReturn = {
            headers: [
                {
                  text: 'Leave Type',
                  align: 'start',
                  sortable: false,
                  value: 'leaveType',
                },
                { text: 'Leave Status', value: 'status' },
                { text: 'Start Date', value: 'startDate' },
                { text: 'End Date', value: 'endDate' }
            ]
        }
        dataReturn.leaves = leaves;
        res.status(200).json(dataReturn)
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while fetching.",
        });
    }
})


module.exports = {
    getLeaves,
    applyLeave,
    getUserLeaves
}