const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 60 * 60,
});


const rateLimitMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (err) {
        res.status(429).json({ error: 'Rate limit exceeded' });
    }
};

module.exports = rateLimitMiddleware;