const Group = require('../models/group');
const Member = require('../models/member');
const { Op } = require('sequelize');

exports.createGroup = async (req, res) => {
    try {
        const { id, name } = req.user;
        const { groupName } = req.body;
        const response = await Group.create({
            groupName: groupName,
            creatorId: id,
            createdBy: name,
            userId: id,
        });
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Create Group Api' });
    }
}

exports.getGroup = async (req, res) => {
    try {
        const { id, name } = req.user;
        const member = await Member.findAll({ where: { memberName: name } });
        const response = await Group.findAll({ where: { userId: id } });
        for (let i = 0; i < member.length; i++){
            res.status(200).json({ response: response, member: member[i].groupName });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Get Group Api' });
    }
}

exports.addMember = async (req, res) => {
    try {
        const { id } = req.user;
        const { nameArray, groupId } = req.body;
        const group = await Group.findOne({ where: { id: groupId } });
        for (let i = 0; i < nameArray.length; i++){
            const members = await Member.create({
                memberName: nameArray[i],
                groupName: group.groupName,
                isAdmin: false,
                userId: id,
                groupId: groupId,
            });
        }
        res.status(201).json({ msg: 'Member Added Successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Add Member Api' });
    }
}

exports.getMember = async (req, res) => {
    try {
        const { id, name } = req.user;
        const groupId = req.header('groupId');
        const members = await Member.findAll({ where: { groupId: groupId } });
        res.status(200).json({ members, id: id, name: name });
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Get Member Api' });
    }
}