const PlanModel = require('../models/PlanSchema');

exports.createPlan = async (req, res) => {
    try {
        const { plan_type, plan_name, ...planData } = req.body;
        const userId = req.user.id;

        const plan = await PlanModel.create({
            user_id: userId,
            plan_type: plan_type || 'workout',
            plan_name: plan_name || 'My Plan',
            plan_data: planData
        });

        // Format for frontend
        const formattedPlan = {
            ...plan.plan_data,
            plan_id: plan._id,
            plan_type: plan.plan_type,
            plan_name: plan.plan_name,
            timestamp: plan.created_at,
            id: new Date(plan.created_at).getTime() // helper for frontend keys
        };

        res.status(201).json({ success: true, plan: formattedPlan });
    } catch (err) {
        console.error('Create Plan Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        const plans = await PlanModel.find({ user_id: userId })
            .sort({ created_at: -1 })
            .lean();

        const formattedPlans = plans.map(row => ({
            ...row.plan_data,
            plan_id: row._id,
            plan_type: row.plan_type,
            plan_name: row.plan_name,
            timestamp: row.created_at,
            id: new Date(row.created_at).getTime()
        }));

        res.json({ success: true, plans: formattedPlans });
    } catch (err) {
        console.error('Get Plans Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        console.log('=== DELETE PLAN REQUEST ===');
        console.log('Plan ID:', id);
        console.log('User ID:', userId);

        // Check owner
        const plan = await PlanModel.findById(id);
        console.log('Found plan:', plan ? 'YES' : 'NO');

        if (!plan) {
            console.log('Plan not found in database');
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        console.log('Plan user_id:', plan.user_id.toString());
        console.log('Request user_id:', userId);

        if (plan.user_id.toString() !== userId.toString()) {
            console.log('Authorization failed - user does not own this plan');
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const result = await PlanModel.findByIdAndDelete(id);
        console.log('Delete result:', result ? 'SUCCESS' : 'FAILED');
        console.log('=== DELETE COMPLETE ===');

        res.json({ success: true, message: 'Plan deleted' });
    } catch (err) {
        console.error('Delete Plan Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { plan_type, plan_name, ...planData } = req.body;

        const plan = await PlanModel.findById(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        // Fix: Ensure both IDs are strings for comparison
        if (plan.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updatedPlan = await PlanModel.findByIdAndUpdate(
            id,
            {
                plan_type: plan_type || plan.plan_type,
                plan_name: plan_name || plan.plan_name,
                plan_data: { ...plan.plan_data, ...planData }
            },
            { new: true }
        );

        const formattedPlan = {
            ...updatedPlan.plan_data,
            plan_id: updatedPlan._id,
            plan_type: updatedPlan.plan_type,
            plan_name: updatedPlan.plan_name,
            timestamp: updatedPlan.created_at,
            id: new Date(updatedPlan.created_at).getTime()
        };

        res.json({ success: true, plan: formattedPlan });
    } catch (err) {
        console.error('Update Plan Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
