// ============================================================
// controllers/statsController.js
// Returns dashboard statistics
// ============================================================

const Threat = require('../models/Threat');

exports.getStats = async (req, res) => {
  try {
    const total  = await Threat.countDocuments();
    const high   = await Threat.countDocuments({ severity: 'HIGH' });
    const medium = await Threat.countDocuments({ severity: 'MEDIUM' });
    const low    = await Threat.countDocuments({ severity: 'LOW' });

    // Threats per action type
    const actionStats = await Threat.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Threats per country
    const countryStats = await Threat.aggregate([
      { $match: { country: { $ne: 'Unknown' } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Last 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24h = await Threat.countDocuments({ timestamp: { $gte: since } });

    // Recent threats for map
    const mapData = await Threat.find(
      { threat: true, latitude: { $ne: 0 } },
      'ip action severity country city latitude longitude timestamp'
    ).sort({ timestamp: -1 }).limit(50);

    return res.json({
      total, high, medium, low, last24h,
      actionStats, countryStats, mapData
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
