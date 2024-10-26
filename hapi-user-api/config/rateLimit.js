// rateLimiter.js

const requestCounts = {};

const rateLimiterPlugin = {
  name: 'rateLimiter',
  version: '1.0.0',
  register: (server, options) => {
    const { userLimit = 10, timeWindow = 1000 } = options;

    server.ext('onPreHandler', (request, h) => {
      const clientIp = request.info.remoteAddress;

      if (!requestCounts[clientIp]) {
        requestCounts[clientIp] = { count: 1, startTime: Date.now() };
      } else {
        const currentTime = Date.now();
        const elapsedTime = currentTime - requestCounts[clientIp].startTime;

        if (elapsedTime < timeWindow) {
          requestCounts[clientIp].count += 1;
          if (requestCounts[clientIp].count > userLimit) {
            return h
              .response({ error: 'Too many requests, please wait and try again.' })
              .code(429)
              .takeover();
          }
        } else {
          // Reset count if the time window has passed
          requestCounts[clientIp].count = 1;
          requestCounts[clientIp].startTime = currentTime;
        }
      }

      return h.continue;
    });
  },
};

export default rateLimiterPlugin;
