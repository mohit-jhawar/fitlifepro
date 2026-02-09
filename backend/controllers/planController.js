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

        // Check owner
        const plan = await PlanModel.findById(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        if (plan.user_id.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await PlanModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Plan deleted' });
    } catch (err) {
        console.error('Delete Plan Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
