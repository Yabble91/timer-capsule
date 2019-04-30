module.exports = {
  "app": [
    {
      "name": "timer-capsule",
      "script": "app.js",
      "env": {
        "COMMON_VARIABLE": "true"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ],
  "deploy": {
    "aliTimerCapsule": {
      "user": "root",
      "host": ["47.93.15.178"],
      "ref": "origin/master",
      "repo": "https://github.com/Yubble/timer-capsule.git",
      "path": "/www/website/timerCapsule",
      "ssh_options": "StrictHostKeyChecking=no",
      "post-deploy":"npm install && npm run build && pm2 startOrRestart ecosystem.json --env production",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}